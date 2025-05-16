#!/bin/bash

# Function to print colored status messages
print_status() {
    echo -e "\033[1;34m==>\033[0m $1"
}

print_error() {
    echo -e "\033[1;31mError:\033[0m $1"
}

print_success() {
    echo -e "\033[1;32mSuccess:\033[0m $1"
}

# Check if target directory is provided
if [ $# -eq 0 ]; then
    print_error "Please provide a target directory path"
    echo "Usage: $0 <target_directory>"
    exit 1
fi

TARGET_DIR="$1"

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "git is not installed. Please install git first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    print_status "Creating target directory: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Change to target directory
cd "$TARGET_DIR" || {
    print_error "Failed to change to directory: $TARGET_DIR"
    exit 1
}

# Check if .git exists and add to .gitignore if it does
if [ -d ".git" ]; then
    print_status "Git repository detected in target directory"
    if [ ! -f ".gitignore" ]; then
        touch .gitignore
    fi
    if ! grep -q "^dota$" .gitignore; then
        echo "dota" >> .gitignore
        print_success "Added 'dota' to .gitignore"
    fi
fi

# Clone the repository
print_status "Cloning the repository..."
if [ -d "dota" ]; then
    print_status "Repository already exists, updating..."
    cd dota
    git fetch origin
    git checkout feature/launch-script
    git pull origin feature/launch-script
else
    git clone -b feature/launch-script https://github.com/dream-sports-labs/dota
    cd dota
fi

# Check if env.dev.sh exists and is executable
if [ ! -f "env.dev.sh" ]; then
    print_error "env.dev.sh not found in the repository"
    exit 1
fi

# Make env.dev.sh executable
chmod +x env.dev.sh

# Run environment setup
print_status "Setting up environment files..."
./env.dev.sh

# Navigate to API directory and start the server
print_status "Starting the development server..."
cd api
npm install
npm run dev:web 