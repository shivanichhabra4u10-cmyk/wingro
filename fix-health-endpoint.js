// MongoDB Connection Status Fix Script
// This script fixes the health endpoint to show the correct MongoDB connection status

const fs = require('fs');
const path = require('path');

console.log('MongoDB Connection Status Fix');
console.log('===========================');

// Paths to the API files that need fixing
const apiFiles = [
  'mongodb-products-api.js',
  'guaranteed-community-api.js'
];

function fixHealthEndpoint(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  console.log(`Processing file: ${filePath}`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file contains a health endpoint
  if (!content.includes('/health') || !content.includes('mongoose.connection.readyState')) {
    console.log(`⚠️ File doesn't contain a health endpoint with mongoose connection status: ${filePath}`);
    return false;
  }
  
  // Replace the MongoDB connection status check with a more reliable approach
  let updatedContent = content.replace(
    /mongodb:.*mongoose\.connection\.readyState.*?['"](connected|disconnected)['"]/g,
    'mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"'
  );
  
  // Add a connection refresh to the health endpoint
  if (updatedContent.includes('app.get(\'/health\'')) {
    updatedContent = updatedContent.replace(
      /app\.get\(['"]\/health['"]\s*,\s*\(req,\s*res\)\s*=>\s*{/,
      `app.get('/health', async (req, res) => {
        // Ensure MongoDB connection is properly checked
        let isConnected = mongoose.connection.readyState === 1;
        
        // If disconnected, try to reconnect
        if (!isConnected) {
          try {
            // Try to reconnect to MongoDB
            if (mongoose.connection.readyState !== 1) {
              const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
              await mongoose.connect(mongoUri);
              console.log('Reconnected to MongoDB successfully');
              isConnected = true;
            }
          } catch (error) {
            console.error('Failed to reconnect to MongoDB:', error.message);
            isConnected = false;
          }
        }`
    );
  }
  
  // If there are changes, write the updated content back to the file
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Fixed health endpoint in: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️ No changes needed in: ${filePath}`);
    return false;
  }
}

// Process each API file
for (const apiFile of apiFiles) {
  const filePath = path.join(__dirname, apiFile);
  fixHealthEndpoint(filePath);
}

console.log('\n✅ MongoDB connection status fix completed!');
console.log('Please restart your API server for the changes to take effect.');
console.log('The health endpoint should now correctly show the MongoDB connection status.');
console.log('\nExample commands to restart the API:');
console.log('1. node mongodb-products-api.js');
console.log('2. node guaranteed-community-api.js');
