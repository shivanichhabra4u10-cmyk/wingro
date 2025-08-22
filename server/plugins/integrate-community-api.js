/**
 * Script to integrate community API endpoints into the main server
 * 
 * This script safely modifies the server's app.js file to include
 * the community API plugin, adding all necessary endpoints without
 * disrupting existing functionality.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const serverDir = path.resolve(__dirname, '..');
const distDir = path.join(serverDir, 'dist');
const appJsPath = path.join(distDir, 'app.js');
const pluginsDir = path.join(serverDir, 'plugins');

// Ensure the plugins directory exists
if (!fs.existsSync(pluginsDir)) {
  fs.mkdirSync(pluginsDir, { recursive: true });
}

// Check if the app.js file exists
if (!fs.existsSync(appJsPath)) {
  console.error(`Cannot find app.js at ${appJsPath}`);
  process.exit(1);
}

// Read the app.js file
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Check if the community plugin is already integrated
if (appJsContent.includes('require("../plugins/community-api")')) {
  console.log('Community API plugin is already integrated.');
  process.exit(0);
}

// Add the plugin require and initialization code
const pluginRequireCode = `
// Community API plugin integration
const communityApiPlugin = require("../plugins/community-api");`;

// Find a suitable insertion point after all requires but before app initialization
let insertRequireIdx = appJsContent.indexOf('const app = express();');

if (insertRequireIdx === -1) {
  console.error('Could not find express app initialization in app.js');
  process.exit(1);
}

// Insert the plugin require statement before app initialization
appJsContent = 
  appJsContent.substring(0, insertRequireIdx) + 
  pluginRequireCode + 
  appJsContent.substring(insertRequireIdx);

// Find a good spot to initialize the plugin, after all routes are defined
// Typically this would be before the module.exports line
let initializePluginIdx = appJsContent.indexOf('module.exports');

if (initializePluginIdx === -1) {
  // Fallback: look for the last route definition
  const routeDefinitions = [
    'app.use("/api"',
    'app.use(express.static',
    'app.get("*"'
  ];
  
  for (const routeDef of routeDefinitions.reverse()) {
    const idx = appJsContent.lastIndexOf(routeDef);
    if (idx !== -1) {
      // Find the end of this statement block
      let endIdx = appJsContent.indexOf(';', idx);
      if (endIdx !== -1) {
        initializePluginIdx = endIdx + 1;
        break;
      }
    }
  }
}

if (initializePluginIdx === -1) {
  console.error('Could not find a suitable location to initialize the community API plugin');
  process.exit(1);
}

// Add the plugin initialization
const pluginInitCode = `

// Initialize community API routes
console.log("Initializing Community API routes...");
communityApiPlugin(app);
`;

// Insert the plugin initialization
appJsContent = 
  appJsContent.substring(0, initializePluginIdx) + 
  pluginInitCode + 
  appJsContent.substring(initializePluginIdx);

// Write the modified file
fs.writeFileSync(appJsPath, appJsContent);

console.log(`Successfully integrated Community API plugin into ${appJsPath}`);

// Create a backup copy of the original app.js
const backupPath = appJsPath + '.backup';
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(appJsPath, backupPath);
  console.log(`Created backup of original app.js at ${backupPath}`);
}

console.log('Integration complete! The server now supports all community endpoints:');
console.log('- /api/community/segments');
console.log('- /emergency/community/segments');
console.log('- /community/segments');
console.log('- /api/community/posts');
console.log('- /emergency/community/posts');
console.log('- /community/posts');
console.log('\nRestart the server for changes to take effect.');
