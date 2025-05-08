#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  echo "Cleaning up..."
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

# Local Storage Configuration
export STORAGE_PROVIDER=local
export LOCAL_STORAGE_PATH="./JsonStorage.json"

# Other settings
export PORT=3010
export EMULATED=true
export NODE_ENV=development
export LOCAL_GOOGLE_TOKEN="mock-google-token"
export REDIS_HOST=localhost
export REDIS_PORT=6379

# Check if port 3010 is already in use and release it
if lsof -ti:3010 >/dev/null; then
  lsof -ti:3010 | xargs kill -9 > /dev/null 2>&1
fi

# Seed the JsonStorage with sample data
echo "🗂️ Initializing Local JSON storage..."
npx ts-node script/storage/seedDataLocal.ts > /dev/null 2>&1
echo "📂 Data seeded successfully"

# Build TypeScript before starting server
echo "🔨 Building application..."
npm run build > /dev/null 2>&1

# Copy JsonStorage.json to the bin directory where the server looks for it
mkdir -p bin/script/storage > /dev/null 2>&1
cp ./JsonStorage.json bin/script/storage/JsonStorage.json > /dev/null 2>&1

# Start server with local storage configuration
echo "🛜 Starting server with Local storage..."
npm start > server.log 2>&1 &
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

echo "🚀 Server started with Local storage"

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