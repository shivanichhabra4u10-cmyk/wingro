// This script adds a require statement to load community-routes.js if it's not already included
const fs = require('fs');
const path = require('path');

console.log('Adding community routes import to server...');

// Path to the server file and the community routes file
const serverFile = path.join(__dirname, 'products-api', 'index.js');
const communityRoutesFile = path.join(__dirname, 'products-api', 'community-routes.js');

// Check if the files exist
if (!fs.existsSync(serverFile)) {
  console.error(`Server file not found: ${serverFile}`);
  process.exit(1);
}

if (!fs.existsSync(communityRoutesFile)) {
  console.error(`Community routes file not found: ${communityRoutesFile}`);
  process.exit(1);
}

// Read the server file
let serverCode = fs.readFileSync(serverFile, 'utf8');

// Check if community-routes.js is already included
if (serverCode.includes('require(\'./community-routes\')') || 
    serverCode.includes('require("./community-routes")')) {
  console.log('Community routes import already exists. Nothing to do.');
} else {
  console.log('Adding community routes import to server file...');
  
  // Find a suitable position - before the server start line
  const serverStartLine = serverCode.indexOf('const PORT =');
  
  if (serverStartLine === -1) {
    console.error('Could not find a suitable position to add the import.');
    process.exit(1);
  }
  
  // Create the import line
  const importLine = '\n// Include community routes\nrequire(\'./community-routes\');\n\n';
  
  // Insert the import
  serverCode = 
    serverCode.substring(0, serverStartLine) + 
    importLine +
    serverCode.substring(serverStartLine);
  
  // Write the updated code
  fs.writeFileSync(serverFile, serverCode, 'utf8');
  
  console.log('Successfully added community routes import.');
}

console.log('Done. Please restart the server for changes to take effect.');
