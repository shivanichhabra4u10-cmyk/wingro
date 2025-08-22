const fs = require('fs');
const path = require('path');

console.log('Starting to add missing community routes to the server...');

// Path to the server file
const serverFile = path.join(__dirname, 'products-api', 'index.js');
const communityRoutesFile = path.join(__dirname, 'products-api', 'community-routes.js');

// Read the files
const serverCode = fs.readFileSync(serverFile, 'utf8');
const communityRoutes = fs.readFileSync(communityRoutesFile, 'utf8');

// Check if the routes are already present
if (serverCode.includes('/community/posts')) {
  console.log('Community routes already present in server file.');
} else {
  console.log('Adding community routes to server file...');
  
  // Find insertion point - after the API community endpoints section
  const insertionPoint = serverCode.indexOf('// COMMUNITY API ENDPOINTS');
  
  if (insertionPoint === -1) {
    console.error('Could not find insertion point in server file.');
    process.exit(1);
  }
  
  // Find the next section to insert before
  let nextSection = serverCode.indexOf('// Health check endpoint', insertionPoint);
  if (nextSection === -1) {
    nextSection = serverCode.indexOf('// Start server', insertionPoint);
  }
  
  if (nextSection === -1) {
    console.error('Could not find next section in server file.');
    process.exit(1);
  }
  
  // Insert the community routes before the next section
  const newServerCode = 
    serverCode.substring(0, nextSection) + 
    '\n\n// ADDITIONAL COMMUNITY ROUTES FOR CLIENT COMPATIBILITY\n\n' + 
    communityRoutes + 
    '\n\n' + 
    serverCode.substring(nextSection);
  
  // Write the updated server code
  fs.writeFileSync(serverFile, newServerCode, 'utf8');
  
  console.log('Successfully added community routes to server file.');
}

// Update client API service
const clientApiFile = path.join(__dirname, 'client', 'src', 'services', 'api.ts');
const newClientApiFile = path.join(__dirname, 'client', 'src', 'services', 'api.ts.new');

if (fs.existsSync(newClientApiFile)) {
  console.log('Updating client API service...');
  
  // Backup the original file
  const backupFile = path.join(__dirname, 'client', 'src', 'services', 'api.ts.bak');
  if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(clientApiFile, backupFile);
    console.log('Created backup of original client API service.');
  }
  
  // Replace the client API service with the new one
  fs.copyFileSync(newClientApiFile, clientApiFile);
  
  console.log('Successfully updated client API service.');
}

console.log('All changes completed. Please restart the server and client.');
