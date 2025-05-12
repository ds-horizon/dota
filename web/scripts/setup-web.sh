#!/bin/bash

# Function to display error messages and exit
error_exit() {
    echo "Error: $1" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js 18.18.0
install_node() {
    echo "Installing Node.js 18.18.0..."
    if command_exists nvm; then
        nvm install 18.18.0 || error_exit "Failed to install Node.js 18.18.0 via nvm"
        nvm use 18.18.0 || error_exit "Failed to use Node.js 18.18.0 via nvm"
        echo "18.18.0" > .nvmrc || echo "Warning: Failed to create .nvmrc file"
    else
        # Install Node.js 18.18.0 using curl
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 18.18.0 || error_exit "Failed to install Node.js 18.18.0"
        nvm use 18.18.0 || error_exit "Failed to use Node.js 18.18.0"
    fi
}

# Check and install Node.js 18.18.0
CURRENT_NODE_VERSION=$(node -v 2>/dev/null || echo "none")
if [ "$CURRENT_NODE_VERSION" != "v18.18.0" ]; then
    echo "Node.js 18.18.0 is required. Current version: $CURRENT_NODE_VERSION"
    install_node
fi

# Verify Node.js version
NODE_VERSION=$(node -v)
if [ "$NODE_VERSION" != "v18.18.0" ]; then
    error_exit "Failed to set Node.js version to 18.18.0. Current version: $NODE_VERSION"
fi
echo "Using Node.js version: $NODE_VERSION"

# Check if pnpm is installed
if ! command_exists pnpm; then
    echo "pnpm not found. Installing pnpm..."
    npm install -g pnpm || error_exit "Failed to install pnpm"
fi

# Copy environment variables
echo "Setting up environment variables..."
node ../api/scripts/setup-aws-env.js .env.example .env || error_exit "Failed to copy environment variables"

# Install dependencies with force flag to automatically accept reinstallation
echo "Installing dependencies..."
rm -rf node_modules
pnpm install --force || error_exit "Failed to install dependencies"

# Check if mode argument is provided
if [ "$1" = "prod" ]; then
    echo "Starting production server..."
    pnpm build && pnpm start
elif [ "$1" = "dev" ]; then
    echo "Starting development server..."
    pnpm dev
else
    error_exit "Please specify mode: 'dev' or 'prod'"
fi 