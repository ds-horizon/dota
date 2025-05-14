#!/bin/bash

# Function to load environment variables
load_env() {
  # Check for .env file, fallback to .env.example
  if [ -f .env ]; then
    echo "📝 Loading environment from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
  elif [ -f .env.example ]; then
    echo "📝 Loading environment from .env.example file..."
    export $(cat .env.example | grep -v '^#' | xargs)
  else
    echo "⚠️  No .env or .env.example file found, using default values"
  fi
}

# Function to setup Node.js environment
setup_node() {
  echo "🔄 Setting up Node.js environment..."
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
  
  # Use Node.js 20, install if not available
  nvm use 20 || nvm install 20
  
  # Verify Node.js version
  NODE_VERSION=$(node -v)
  echo "✅ Using Node.js $NODE_VERSION"
}

# Function to handle cleanup on exit
cleanup() {
  # Find and kill any process using the configured port
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
  exit 0
}

# Function to check if dota CLI is installed
check_dota_cli() {
  # Store current directory
  local CURRENT_DIR=$(pwd)
  
  # Change to CLI directory
  pwd
  
  # Verify dota command is available
  if ! command -v dota &> /dev/null; then
    echo "❌ Error: DOTA CLI is not found in PATH"
    echo "   Please ensure it is installed correctly:"
    echo "   1. Check if you're in the correct directory"
    echo "   2. Run 'npm install' in the cli directory"
    echo "   3. Ensure the cli directory is in your PATH"
    # Return to original directory
    cd "$CURRENT_DIR"
    exit 1
  fi
  
  # Return to original directory
  cd "$CURRENT_DIR"
}

# Function to handle login
handle_login() {
  echo "🔑 Attempting to login to CLI..."
  
  # Store current directory
  local CURRENT_DIR=$(pwd)
  
  # Change to CLI directory and ensure PATH is set
  cd ../cli
  export PATH="$(pwd)/node_modules/.bin:$PATH"
  
  # Check if already logged in
  if dota whoami &> /dev/null; then
    echo "ℹ️  Already logged in. Current user:"
    dota whoami
    cd "$CURRENT_DIR"
    return 0
  fi
  
  # Try to login
  if ! dota login http://localhost:$PORT --accessKey=mock-google-token; then
    echo "❌ Failed to login to CLI"
    echo "   Please check:"
    echo "   1. Server is running correctly"
    echo "   2. You have proper permissions"
    echo "   3. No conflicting sessions"
    cd "$CURRENT_DIR"
    exit 1
  fi
  
  echo "✅ Successfully logged in. Current user:"
  dota whoami
  
  # Return to original directory
  cd "$CURRENT_DIR"
}

# Function to setup AWS environment
setup_aws() {
  echo "🚀 Starting AWS setup process..."
  
  # Inflate .env file if setup script exists
  if [ -f "scripts/setup-aws-env.js" ]; then
    echo "📝 Inflating .env file..."
    node scripts/setup-aws-env.js
  fi
  
  # Install dependencies
  echo "📦 Installing dependencies..."
  npm install
  
  # Initialize AWS (docker compose up)
  echo "🐳 Starting AWS services..."
  docker compose up -d
  
  # Wait for services to be ready
  echo "⏳ Waiting for services to be ready..."
  sleep 5
  
  # Check if services are running
  if ! docker compose ps | grep -q "Up"; then
    echo "❌ Docker services failed to start properly"
    exit 1
  fi
}

# Main script starts here
# Trap Ctrl+C (SIGINT) and call cleanup
trap cleanup SIGINT SIGTERM EXIT

# Change to api directory
cd "$(dirname "$0")"

# Load environment variables
load_env

# Setup Node.js environment
setup_node

# Parse command line arguments
SETUP_ONLY=false
RUN_ONLY=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --setup-only)
      SETUP_ONLY=true
      shift
      ;;
    --run-only)
      RUN_ONLY=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Default to running both setup and server if no flags provided
if [ "$SETUP_ONLY" = false ] && [ "$RUN_ONLY" = false ]; then
  SETUP_ONLY=false
  RUN_ONLY=false
fi

# Server Configuration
DEFAULT_PORT=3010
PORT=${PORT:-$DEFAULT_PORT}  # Use PORT if set, otherwise use DEFAULT_PORT

# Run setup if needed
if [ "$SETUP_ONLY" = true ] || [ "$RUN_ONLY" = false ]; then
  setup_aws
fi

# Exit if only setup was requested
if [ "$SETUP_ONLY" = true ]; then
  echo "✅ AWS setup completed!"
  exit 0
fi

# Database Configuration
export DB_HOST=${DB_HOST:-localhost}
export DB_USER=${DB_USER:-root}
export DB_PASS=${DB_PASS:-root}
export DB_NAME=${DB_NAME:-codepushdb}

# AWS Storage Configuration
export STORAGE_PROVIDER=${STORAGE_PROVIDER:-aws}
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-localstack}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-localstack}
export S3_ENDPOINT=${S3_ENDPOINT:-http://localhost:4566}

# Other settings
export PORT=$PORT
export EMULATED=${EMULATED:-true}
export NODE_ENV=${NODE_ENV:-development}
export LOCAL_GOOGLE_TOKEN=${LOCAL_GOOGLE_TOKEN:-"mock-google-token"}

# Check if LocalStack is running
if ! curl -s http://localhost:4566 > /dev/null; then
  echo "❌ Error: LocalStack is not running. Please start it with:"
  echo "   docker run --rm -p 4566:4566 -p 4571:4571 localstack/localstack"
  exit 1
else
  echo "🗂️ AWS LocalStack initialized at http://localhost:4566"
fi

# Check if port is already in use and release it
if lsof -ti:$PORT >/dev/null; then
  lsof -ti:$PORT | xargs kill -9 > /dev/null 2>&1
fi

# Check if seed data script for AWS exists and run it
if [ -f "script/storage/seedData.ts" ]; then
  echo "📂 Seeding AWS storage with sample data..."
  npx ts-node script/storage/seedData.ts > /dev/null 2>&1
else
  echo "❌ Warning: No AWS seed data script found at script/storage/seedData.ts"
  exit 1
fi

# Build TypeScript before starting server
echo "🔨 Building application..."
npm run build > /dev/null 2>&1

# Start server with AWS configuration in detached mode
echo "🛜 Starting server with AWS storage on port $PORT..."
nohup npm start aws:env > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready (checking if port is listening)
echo "⏳ Waiting for server to be ready..."
TIMEOUT=30
COUNTER=0
while ! lsof -i:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  sleep 1
  COUNTER=$((COUNTER + 1))
  # Check if server is still running
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Server failed to start. Check server.log for details."
    exit 1
  fi
  # Add timeout
  if [ $COUNTER -ge $TIMEOUT ]; then
    echo "❌ Server failed to start within $TIMEOUT seconds. Check server.log for details."
    kill $SERVER_PID 2>/dev/null
    exit 1
  fi
done

echo "🚀 Server started with AWS storage on port $PORT (PID: $SERVER_PID)"

# Clean up before login
echo "🧹 Cleaning environment before login..."
pwd
cd ../cli
pwd
npm run exec > /dev/null 2>&1

# Check if DOTA CLI is installed and setup PATH
check_dota_cli

# Handle login with error checking
handle_login

echo "📝 Server log available at: $(pwd)/server.log"
echo "ℹ️  Server is running in background with PID: $SERVER_PID"
echo "ℹ️  To stop the server, run: kill $SERVER_PID"
echo "✅ Setup complete! You can now use the CLI."

# Function to display error messages and exit
error_exit() {
    echo "Error: $1" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if the dota CLI is installed
check_dota_cli() {
    if ! command_exists dota; then
        echo "⚠️  DOTA CLI not found in PATH"
        echo "Installing CLI dependencies..."
        cd ../cli
        npm install
        npm run build
        cd ../api
    fi
}

# Function to handle login
handle_login() {
    echo "Checking login status..."
    if dota whoami >/dev/null 2>&1; then
        echo "✅ Already logged in. Current user:"
        dota whoami
    else
        echo "Logging in..."
        if dota login http://localhost:$PORT; then
            echo "✅ Successfully logged in. Current user:"
            dota whoami
        else
            error_exit "Failed to login. Please check your credentials and try again."
        fi
    fi
}

# Function to setup web environment
setup_web() {
    echo "Setting up web environment..."
    cd ../web

    # Create .env file with mock values for development
    cat > .env << EOL
GOOGLE_CLIENT_ID=mock-client-id
GOOGLE_CLIENT_SECRET=mock-client-secret
CODEPUSH_SERVER_URL=http://localhost:$PORT
AWS_S3_BUCKET=local-bucket
aws_secret_access_key=test
aws_access_key_id=test
EOL

    # Install dependencies and start web
    if command_exists pnpm; then
        pnpm install
        pnpm dev
    else
        npm install
        npm run dev
    fi

    cd ../api
}

# Function to cleanup processes
cleanup() {
    echo "Cleaning up..."
    # Kill any process using the configured port
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
}

# Set up cleanup on script exit
trap cleanup EXIT

# Check if port is in use
if lsof -ti:$PORT >/dev/null 2>&1; then
    error_exit "Port $PORT is already in use. Please free up the port or use a different one."
fi

# Check for dota CLI
check_dota_cli

# Handle login
handle_login

# Export PORT for the server
export PORT=$PORT

# Start the server
echo "Starting server on port $PORT..."
npm run dev &

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:$PORT/health >/dev/null; then
        echo "✅ Server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        error_exit "Server failed to start within 30 seconds"
    fi
    echo "Waiting... ($i/30)"
    sleep 1
done

# Setup web if --web flag is provided
if [ "$1" = "--web" ]; then
    setup_web
fi

# Keep the script running
wait