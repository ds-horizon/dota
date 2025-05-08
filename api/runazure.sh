#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  # Kill Azurite if it was started by this script
  if [ -n "$AZURITE_PID" ]; then
    kill $AZURITE_PID 2>/dev/null || true
  fi
  
  # Find and kill any process using port 3010
  lsof -ti:3010 | xargs kill -9 2>/dev/null || true
  exit 0
}

# Trap Ctrl+C (SIGINT) and call cleanup
trap cleanup SIGINT SIGTERM EXIT

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
npm start azure:env > server.log 2>&1 &
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

echo "🚀 Server started with Azure storage"

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