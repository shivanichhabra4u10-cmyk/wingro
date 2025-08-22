/**
 * MongoDB Connection Test Script
 * -----------------------------
 * This script will try to connect to MongoDB using the same logic
 * as the actual application. It will provide detailed feedback on
 * connection success or failure.
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Main execution function
async function testMongoDBConnection() {
  console.log('\n═════════════════════════════════════════════════');
  console.log('🔍 MONGODB CONNECTION TEST');
  console.log('═════════════════════════════════════════════════\n');

  // Get MongoDB URI from environment variables
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
  
  console.log('Connection string:', mongoURI);
  console.log('Attempting to connect...\n');
  
  try {
    // Connection options matching the application's settings
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };
    
    // Attempt to connect to MongoDB
    await mongoose.connect(mongoURI, options);
    
    // If we get here, connection was successful
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('-----------------------------------');
    console.log(`Connected to: ${mongoose.connection.name}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Get list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    if (collections.length === 0) {
      console.log('- No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Create a test document
    console.log('\nCreating test document...');
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('TestConnection', TestSchema);
    const testDoc = await TestModel.create({ name: 'Connection Test ' + new Date().toISOString() });
    
    console.log(`Test document created with ID: ${testDoc._id}`);
  } catch (error) {
    // Connection failed
    console.log('❌ CONNECTION FAILED!');
    console.log('-----------------------------------');
    console.log(`Error type: ${error.name}`);
    console.log(`Error message: ${error.message}`);
    
    console.log('\n🛠️ TROUBLESHOOTING STEPS:');
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      console.log('1. Check if MongoDB is running:');
      console.log('   → For Docker: cd .. && docker-compose up -d mongodb');
      console.log('   → For local MongoDB: Check MongoDB service status');
      console.log('2. Verify connection string format:');
      console.log('   → Local: mongodb://localhost:27017/wingrox_db');
      console.log('   → Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>');
      console.log('3. Check network connectivity:');
      console.log('   → Can you ping the MongoDB host?');
      console.log('   → Are there any firewall rules blocking the connection?');
    } else if (error.name === 'MongoServerSelectionError') {
      console.log('1. MongoDB server is not reachable or not running');
      console.log('2. Check Docker container status');
      console.log('3. Try restarting the MongoDB container');
    } else if (error.name === 'MongoAuthenticationError') {
      console.log('1. Username or password is incorrect');
      console.log('2. Check your credentials in the .env file');
    }
  } finally {
    // Close connection if it was established
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed.');
    }
    
    console.log('\n═════════════════════════════════════════════════');
  }
}

// Run the test
testMongoDBConnection()
  .catch(err => console.error('Script execution error:', err))
  .finally(() => process.exit());
