const mongoose = require('mongoose');
require('dotenv').config();

// Use the URI directly to avoid any issues with loading from .env
const MONGODB_URI = 'mongodb+srv://shivanichhabra4u10:MXqw6OydCMoNi1G6@wingrocluster.rdz8evo.mongodb.net/wingrox_db?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    
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
    
    // This will create the "contacts" collection in the "wingrox_db" database
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
    console.log('MongoDB database and collection created successfully!');
    
    // List all collections in the database
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log('- ' + collection.name);
    });
    
    console.log('\nDatabase connection information:');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('MongoDB connection is working correctly!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\nThis error typically means one of the following:');
      console.error('1. Your IP address is not whitelisted in MongoDB Atlas');
      console.error('2. Your MongoDB Atlas username/password is incorrect');
      console.error('3. The cluster name or region in the connection string is wrong');
    }
    
    process.exit(1);
  });
