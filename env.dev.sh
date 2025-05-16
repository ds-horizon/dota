#!/bin/bash

# Check if env.web.dev exists
if [ ! -f "env.web.dev" ]; then
    echo "Error: env.web.dev file not found in the current directory"
    echo "Please ensure env.web.dev exists in the root directory"
    exit 1
fi

# Create directories if they don't exist
mkdir -p api web

# Copy env.web.dev to api/.env
cp env.web.dev api/.env
if [ $? -eq 0 ]; then
    echo "✓ Copied env.web.dev to api/.env"
else
    echo "✗ Failed to copy to api/.env"
    exit 1
fi

# Copy env.web.dev to web/.env
cp env.web.dev web/.env
if [ $? -eq 0 ]; then
    echo "✓ Copied env.web.dev to web/.env"
else
    echo "✗ Failed to copy to web/.env"
    exit 1
fi

echo "✅ Environment files have been copied successfully!" 