/*
  This script is intendeed to run before the "make" command and performs the following tasks:
  1. Creates the folder structure:
     - xml-fixer-backend/public/input
     - xml-fixer-backend/public/output
     if they do not already exist.

  2. Reads environment variables from a .env file located one level above the script directory.

  3. Converts the .env file content into a JSON object and writes it to an env.json file
     located one level above the script directory.
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config();
console.log('Pre-make tasks started.');

// Paths for the folders
const inputFolderPath = path.resolve(__dirname, '../xml-fixer-backend/public/input');
const outputFolderPath = path.resolve(__dirname, '../xml-fixer-backend/public/output');

// Create the directories if they don't exist
if (!fs.existsSync(inputFolderPath)) {
  fs.mkdirSync(inputFolderPath, { recursive: true });
  console.log('Input folder created successfully.');
}

if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
  console.log('Output folder created successfully.');
}

// Paths for environment files
const envPath = path.resolve(__dirname, '../.env');
const envJsonPath = path.resolve(__dirname, '../env.json');

// Read and parse the .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const envJson = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envJson[key.trim()] = value.trim();
  }
});

// Write the env.json file
fs.writeFileSync(envJsonPath, JSON.stringify(envJson, null, 2), 'utf8');
console.log('env.json file created successfully.');
console.log('Pre-make tasks ended.');
