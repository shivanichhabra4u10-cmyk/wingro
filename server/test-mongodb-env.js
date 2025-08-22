const mongoose = require('mongoose');
require('dotenv').config();

// Get the MongoDB URI from the .env file
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB with URI from .env file...');
console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    console.log('Connection information:');
    console.log('- Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    console.log('- Database name:', mongoose.connection.db.databaseName);
    
    // Create a simple Contact schema for testing
    const ContactSchema = new mongoose.Schema({
      name: String,
      email: String,
      phoneNumber: String,
      subject: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
    
    // This will create the "contacts" collection in the database
    const Contact = mongoose.model('Contact', ContactSchema);
    
    // Create a test contact entry
    return Contact.create({
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+1234567890',
      subject: 'Test Message',
      message: 'This is a test message to verify MongoDB connection'
    });
  })
  .then(doc => {
    console.log('Created test contact:', doc);
    
    // List all collections in the database
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log('- ' + collection.name);
    });
    
    console.log('\nTest completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.error('\nAuthentication failed. Please check:');
      console.error('1. Username and password are correct');
      console.error('2. The user has the necessary permissions');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('\nServer selection error. Please check:');
      console.error('1. Your IP address is whitelisted in MongoDB Atlas');
      console.error('2. The cluster name and region are correct');
      console.error('3. If using a local MongoDB, make sure it\'s running');
    }
    
    process.exit(1);
  });
