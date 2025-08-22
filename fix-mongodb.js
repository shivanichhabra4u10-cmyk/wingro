// MongoDB Connection Fix Script
// This script helps test MongoDB connection and set up the right connection string

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('MongoDB Connection Fix Script');
console.log('============================');

// List of possible MongoDB connection strings to try
const connectionStrings = [
  'mongodb://localhost:27017/wingrox_db',
  'mongodb://127.0.0.1:27017/wingrox_db',
  'mongodb+srv://shivanichhabra4u10:MXqw6OydCMoNi1G6@wingrocluster.rdz8evo.mongodb.net/wingrox_db?retryWrites=true&w=majority'
];

// Default .env file path
const envFilePath = path.join(process.cwd(), '.env');

async function testConnections() {
  console.log('\nTesting MongoDB connections...');
  
  for (const uri of connectionStrings) {
    console.log(`\nTrying connection with: ${uri.includes('mongodb+srv') ? 'MongoDB Atlas' : uri}`);
    
    try {
      // Attempt to connect with a short timeout
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      
      console.log('✅ Successfully connected to MongoDB!');
      console.log(`Database name: ${mongoose.connection.name}`);
      console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
      
      // Get list of collections if connected
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`Available collections (${collections.length}):`);
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Update the .env file with the working connection string
      updateEnvFile(uri);
      
      // Disconnect after successful connection
      await mongoose.connection.close();
      console.log('Connection closed safely.');
      
      return uri; // Return the working connection URI
    } catch (error) {
      console.error(`❌ Failed to connect: ${error.message}`);
      console.log('Trying next connection string...');
    }
  }
  
  console.error('\n❌ All connection attempts failed!');
  return null;
}

// Function to update the .env file with the working MongoDB URI
function updateEnvFile(uri) {
  console.log('\nUpdating .env file with working connection string...');
  
  try {
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Check if MONGODB_URI already exists in the file
      if (envContent.includes('MONGODB_URI=')) {
        // Replace the existing MONGODB_URI
        envContent = envContent.replace(
          /MONGODB_URI=.*/,
          `MONGODB_URI=${uri}`
        );
      } else {
        // Add MONGODB_URI to the end of file
        envContent += `\nMONGODB_URI=${uri}\n`;
      }
    } else {
      // Create new .env file with MONGODB_URI
      envContent = `MONGODB_URI=${uri}\n`;
    }
    
    // Write updated content to .env file
    fs.writeFileSync(envFilePath, envContent);
    console.log('✅ Successfully updated .env file with working MongoDB URI!');
  } catch (error) {
    console.error(`❌ Failed to update .env file: ${error.message}`);
  }
}

// Function to create a test document
async function createTestDocument(uri) {
  console.log('\nTesting document creation...');
  
  try {
    await mongoose.connect(uri);
    
    // Define a simple schema for testing
    const TestSchema = new mongoose.Schema({
      name: String,
      testData: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create model
    const TestModel = mongoose.model('ConnectionTest', TestSchema);
    
    // Create a test document
    const testDoc = new TestModel({
      name: 'Connection Test',
      testData: `Test successful at ${new Date().toISOString()}`
    });
    
    // Save the document
    await testDoc.save();
    console.log('✅ Successfully created test document!');
    console.log(`Test document ID: ${testDoc._id}`);
    
    // Close the connection
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error(`❌ Failed to create test document: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  // Test all connections and get a working URI
  const workingUri = await testConnections();
  
  if (workingUri) {
    console.log('\n✅ Found a working MongoDB connection!');
    
    // Test document creation with the working URI
    const testResult = await createTestDocument(workingUri);
    
    if (testResult) {
      console.log('\n=================================');
      console.log('MongoDB connection fixed successfully!');
      console.log('=================================');
      console.log('\nSummary:');
      console.log(`- Working MongoDB URI: ${workingUri.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : workingUri}`);
      console.log('- .env file updated with working connection');
      console.log('- Test document created successfully');
      console.log('\nNext steps:');
      console.log('1. Restart your server or application');
      console.log('2. Verify MongoDB connection in your application');
    }
  } else {
    console.error('\n=================================');
    console.error('❌ MongoDB connection fix failed!');
    console.error('=================================');
    console.error('\nPossible solutions:');
    console.error('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('2. Start MongoDB service if installed');
    console.error('3. Use MongoDB Atlas cloud service');
    console.error('4. Check firewall or network settings');
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
