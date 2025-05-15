#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  # Kill Azurite if it was started by this script
  if [ -n "$AZURITE_PID" ]; then
    kill $AZURITE_PID 2>/dev/null || true
  fi
  
  # Find and kill any process using port 3010
  lsof -ti:3010 | xargs kill -9 2>/dev/null || true
  
  # Find and kill the web process if it exists
  if [ -n "$WEB_PID" ]; then
    echo "Stopping web server..."
    kill $WEB_PID 2>/dev/null || true
  fi
  
  exit 0
}

# Function to start web and open browser
setup_web() {
  echo "🌐 Setting up web environment..."
  
  # Store current directory
  local CURRENT_DIR=$(pwd)
  
  # Change to web directory
  cd ../web
  
  # Create .env file if it doesn't exist
  if [ ! -f .env ]; then
    echo "Creating .env file for web..."
    cat > .env << EOL
GOOGLE_CLIENT_ID=mock-client-id
GOOGLE_CLIENT_SECRET=mock-client-secret
DOTA_SERVER_URL=http://localhost:3010
EOL
  fi
  
  # Install dependencies and start web in background
  echo "🚀 Starting web server..."
  if command -v pnpm &> /dev/null; then
    pnpm install
    pnpm dev > ../api/logs/web_server.log 2>&1 &
  else
    npm install
    npm run dev > ../api/logs/web_server.log 2>&1 &
  fi
  WEB_PID=$!
  
  # Wait a moment for the web server to start
  echo "⏳ Waiting for web server to start..."
  sleep 5
  
  # Open browser to login page
  echo "🔗 Opening browser to login page..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000/login
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000/login
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start http://localhost:3000/login
  else
    echo "⚠️ Could not automatically open browser. Please visit http://localhost:3000/login"
  fi
  
  # Return to API directory
  cd $CURRENT_DIR
  
  echo "✅ Web setup complete!"
}

# Trap Ctrl+C (SIGINT) and call cleanup
trap cleanup SIGINT SIGTERM EXIT

# Create logs directory if it doesn't exist
mkdir -p logs

# Parse command line arguments
WITH_WEB=false
for arg in "$@"; do
  case $arg in
    --web)
      WITH_WEB=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Start Azurite in the background only if it's not already running
if ! pgrep -f "azurite" > /dev/null; then
  echo "🗂️ Initializing Azure storage emulator..."
  npx azurite --silent > /dev/null 2>&1 &
  AZURITE_PID=$!
  sleep 2
else
  AZURITE_PID=""
fi

# Database Configuration
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=root
export DB_NAME=codepushdb

# Azure Storage Configuration
export STORAGE_PROVIDER=azure
export AZURE_STORAGE_CONNECTION_STRING=
export AZURE_STORAGE_TABLE_HOST="127.0.0.1:10002"
export EMULATED=true

export AZURE_STORAGE_ACCOUNT=process.env.AZURE_STORAGE_ACCOUNT
export AZURE_STORAGE_ACCESS_KEY=process.env.AZURE_STORAGE_ACCESS_KEY
export AZURE_STORAGE_CONNECTION_STRING=process.env.AZURE_STORAGE_CONNECTION_STRING
# Server Configuration
export PORT=3010
export NODE_ENV=development

# Check if port 3010 is already in use and release it
if lsof -ti:3010 >/dev/null; then
  lsof -ti:3010 | xargs kill -9 > /dev/null 2>&1
fi

# Seed Azurite storage with sample data
echo "📂 Seeding Azure storage with sample data..."
npx ts-node script/storage/seedDataAzure.ts > /dev/null 2>&1

# Build TypeScript before starting server
echo "🔨 Building application..."
npm run build > /dev/null 2>&1

echo "🛜 Starting server with Azure storage..."
npm start azure:env > logs/server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready (checking if port 3010 is listening)
echo "⏳ Waiting for server to be ready..."
while ! lsof -i:3010 -sTCP:LISTEN >/dev/null 2>&1; do
  sleep 1
  # Check if server is still running
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Server failed to start. Check logs/server.log for details."
    exit 1
  fi
done

echo "🚀 Server started with Azure storage"

# Clean up before login
echo "🧹 Cleaning environment before login..."
pwd
cd ../cli
npm run exec:clean > /dev/null 2>&1

# Login using CLI
echo "🔑 Logging in to CLI..."
dota login http://localhost:3010 --accessKey=mock-google-token

# Setup web if requested
if [ "$WITH_WEB" = true ]; then
  cd ../api
  setup_web
fi

# Keep the script running
echo "📝 Server log available at: $(pwd)/logs/server.log"
if [ "$WITH_WEB" = true ]; then
  echo "📝 Web server log available at: $(pwd)/logs/web_server.log"
fi
echo "⏹️  Press Ctrl+C to stop the server"
wait $SERVER_PID