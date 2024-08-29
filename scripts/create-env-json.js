const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envPath = path.resolve(__dirname, '../.env');
const envJsonPath = path.resolve(__dirname, '../env.json');

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

const envJson = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envJson[key.trim()] = value.trim();
  }
});

fs.writeFileSync(envJsonPath, JSON.stringify(envJson, null, 2), 'utf8');
console.log('env.json file created successfully.');
