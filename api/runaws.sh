#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  # Find and kill any process using port 3010
  lsof -ti:3010 | xargs kill -9 2>/dev/null || true
  exit 0
}

# Trap Ctrl+C (SIGINT) and call cleanup
trap cleanup SIGINT SIGTERM EXIT

# Database Configuration
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=root
export DB_NAME=codepushdb

# AWS Storage Configuration
export STORAGE_PROVIDER=aws
export AWS_ACCESS_KEY_ID=localstack
export AWS_SECRET_ACCESS_KEY=localstack
export S3_ENDPOINT=http://localhost:4566

# Other settings
export PORT=3010
export EMULATED=true
export NODE_ENV=development
export LOCAL_GOOGLE_TOKEN="mock-google-token"

# Check if LocalStack is running
if ! curl -s http://localhost:4566 > /dev/null; then
  echo "❌ Error: LocalStack is not running. Please start it with:"
  echo "   docker run --rm -p 4566:4566 -p 4571:4571 localstack/localstack"
  exit 1
else
  echo "🗂️ AWS LocalStack initialized at http://localhost:4566"
fi

# Check if port 3010 is already in use and release it
if lsof -ti:3010 >/dev/null; then
  lsof -ti:3010 | xargs kill -9 > /dev/null 2>&1
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

# Start server with AWS configuration
echo "🛜 Starting server with AWS storage..."
npm start aws:env > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready (checking if port 3010 is listening)
echo "⏳ Waiting for server to be ready..."
while ! lsof -i:3010 -sTCP:LISTEN >/dev/null 2>&1; do
  sleep 1
  # Check if server is still running
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Server failed to start. Check server.log for details."
    exit 1
  fi
done

echo "🚀 Server started with AWS storage"

# Clean up before login
echo "🧹 Cleaning environment before login..."
pwd
cd ../cli
npm run exec:clean > /dev/null 2>&1

# Login using CLI
echo "🔑 Logging in to CLI..."
dota login http://localhost:3010 --accessKey=mock-google-token

# Keep the script running
echo "📝 Server log available at: $(pwd)/server.log"
echo "⏹️  Press Ctrl+C to stop the server"
wait $SERVER_PID