const fs = require('fs');
const path = require('path');

// Path to .env.example and .env files
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envPath = path.join(__dirname, '..', '.env');

// AWS LocalStack section markers
const AWS_SECTION_START = '# 9) LOCAL EMULATION (uncomment to use)';
const AWS_SECTION_END = '# -- Local Azure via Azurite Emulator --';

try {
  // Read .env.example file
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Extract AWS section
  const awsSectionStart = envExampleContent.indexOf(AWS_SECTION_START);
  if (awsSectionStart === -1) {
    throw new Error('AWS LocalStack section not found in .env.example');
  }

  // Find the end of the AWS section
  const nextSectionStart = envExampleContent.indexOf(AWS_SECTION_END, awsSectionStart);
  const awsSection = nextSectionStart === -1 
    ? envExampleContent.slice(awsSectionStart)
    : envExampleContent.slice(awsSectionStart, nextSectionStart);
  
  // Extract variables (lines that contain =) and uncomment them
  const awsVars = awsSection
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('# --'))
    .map(line => line.replace(/^#\s*/, '').trim())
    .filter(line => line) // Remove empty lines
    .map(line => {
      // Replace localhost with db for DB_HOST
      if (line.startsWith('DB_HOST=')) {
        return 'DB_HOST=localhost';
      }
      // Fix password variable name
      if (line.startsWith('DB_PASS=')) {
        return line.replace('DB_PASS=root', 'DB_PASSWORD=root');
      }
      // Update MySQL port
      if (line.startsWith('DB_PORT=')) {
        return 'DB_PORT=3306'; // Use 3306 since we're connecting inside Docker network
      }
      return line;
    })
    .join('\n');

  // Write to .env file
  fs.writeFileSync(envPath, awsVars);

  console.log('✅ AWS LocalStack environment variables have been extracted from .env.example and written to .env');
  console.log('\nEnvironment variables added:');
  console.log(awsVars);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 