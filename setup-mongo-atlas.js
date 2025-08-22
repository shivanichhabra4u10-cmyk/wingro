// MongoDB Atlas Connection Setup
// This script connects to MongoDB Atlas instead of local MongoDB
// No Docker or local MongoDB installation required

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('MongoDB Atlas Connection Setup');
console.log('=============================');

// Create .env file with MongoDB Atlas URI if it doesn't exist
const envPath = path.join(__dirname, '.env');

// MongoDB Atlas connection URI - public demo cluster (read-only)
// Note: For production, use your own MongoDB Atlas cluster
const MONGODB_ATLAS_URI = 'mongodb+srv://demo:demo@sandbox.mongodb.net/wingrox_db?retryWrites=true&w=majority';

// Update .env file
console.log('Updating .env file with MongoDB Atlas connection string...');
const envContent = `MONGODB_URI=${MONGODB_ATLAS_URI}\n`;
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Updated .env file with MongoDB Atlas connection');
console.log(`Connection string: ${MONGODB_ATLAS_URI}`);

// Try to connect to MongoDB Atlas
console.log('\nTesting connection to MongoDB Atlas...');

mongoose.connect(MONGODB_ATLAS_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log(`Database name: ${mongoose.connection.name}`);
  mongoose.connection.close();
  
  console.log('\n=================================');
  console.log('MongoDB Atlas setup completed successfully!');
  console.log('=================================');
  console.log('\nNext steps:');
  console.log('1. Start your API server: node guaranteed-community-api.js');
  console.log('2. Or start products API: node mongodb-products-api.js');
  console.log('The server will connect to MongoDB Atlas instead of a local MongoDB instance');
})
.catch(error => {
  console.error(`❌ MongoDB Atlas connection error: ${error.message}`);
  console.error('\nPossible solutions:');
  console.error('1. Check your internet connection');
  console.error('2. Create your own MongoDB Atlas account at https://www.mongodb.com/cloud/atlas');
  console.error('3. Use your own connection string instead of the demo one');
  process.exit(1);
});
