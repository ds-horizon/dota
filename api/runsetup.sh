#!/usr/bin/env node

/**
 * Script to determine which storage provider to use and run the appropriate setup script
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Parse command line arguments
const args = process.argv.slice(2);
const withWeb = args.includes('--web');

// Print current directory and environment information
console.log('Current directory:', process.cwd());
console.log('Environment variables:');
console.log('- STORAGE_PROVIDER:', process.env.STORAGE_PROVIDER);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- EMULATED:', process.env.EMULATED);

// Check if STORAGE_PROVIDER is set
if (!process.env.STORAGE_PROVIDER) {
    console.error("Error: STORAGE_PROVIDER environment variable is not set");
    console.error("Please ensure your .env file is properly configured");
    process.exit(1);
}

// Get the storage provider from environment variables
const provider = process.env.STORAGE_PROVIDER;

console.log(`🔍 Using storage provider: ${provider}`);

// Create the command with web flag if specified
const webFlag = withWeb ? ' --web' : '';

// Run the appropriate setup script
try {
  switch (provider) {
    case 'azure':
      execSync(`./runazure.sh${webFlag}`, { stdio: 'inherit', cwd: __dirname });
      break;
    case 'aws':
      execSync(`./runaws.sh${webFlag}`, { stdio: 'inherit', cwd: __dirname });
      break;
    default:
      execSync(`./runlocal.sh${webFlag}`, { stdio: 'inherit', cwd: __dirname });
      break;
  }
} catch (error) {
  console.error('❌ Error starting server:', error.message);
  process.exit(1);
}
