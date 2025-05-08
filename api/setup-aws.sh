#!/bin/bash

# Change to api directory
cd "$(dirname "$0")"

# Set Node.js version to 20
echo "🔄 Setting Node.js version to 20..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
nvm use 20 || nvm install 20

echo "🚀 Starting AWS setup process..."

# Inflate .env file
echo "📝 Inflating .env file..."
node scripts/setup-aws-env.js

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

# Run AWS setup script in detached mode
echo "🔧 Running AWS setup script..."
nohup ./runaws.sh > aws-setup.log 2>&1 &

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
while ! curl -s http://localhost:3010 > /dev/null; do
    sleep 1
done

# Change to CLI directory and install dependencies
echo "📦 Installing CLI dependencies..."
cd ../cli
npm install

# Run CLI cleanup
echo "🧹 Running CLI cleanup..."
npm run exec:clean

# Login using CLI
echo "🔑 Logging in to CLI..."
dota login http://localhost:3010 --accessKey=mock-google-token

echo "✅ AWS setup completed! Check aws-setup.log for details" 