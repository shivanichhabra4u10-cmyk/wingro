const mongoose = require('mongoose');

// Simplified connection string - remove database name and options
const MONGODB_URI = 'mongodb+srv://shivanichhabra4u10:MXqw6OydCMoNi1G6@wingrocluster.rdz8evo.mongodb.net/?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB Atlas with simplified URI...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    console.log('Connection information:');
    console.log('- Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Exit the process with success
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    
    // Log more detailed error information
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.error('\nAuthentication failed. Please check:');
      console.error('1. Username and password are correct');
      console.error('2. The user has the necessary permissions');
      console.error('3. The password doesn\'t contain special characters that need URL encoding');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('\nServer selection error. Please check:');
      console.error('1. Your IP address is whitelisted in MongoDB Atlas');
      console.error('2. The cluster name and region are correct');
    }
    
    process.exit(1);
  });
