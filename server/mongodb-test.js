// Simple script to test MongoDB connection
const mongoose = require('mongoose');

// Hard-coded MongoDB URI for testing
const MONGODB_URI = 'mongodb+srv://shivanichhabra4u10:LP5qI0XTyBLiz9DE@wingrocluster.rdz8evo.mongodb.net/wingrox_db?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Create a simple Contact model
    const ContactSchema = new mongoose.Schema({
      name: String,
      email: String,
      phoneNumber: String,
      subject: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const Contact = mongoose.model('Contact', ContactSchema);
    
    // Create a test document
    return Contact.create({
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+1234567890',
      subject: 'Test Message',
      message: 'This is a test message'
    });
  })
  .then(doc => {
    console.log('Created test document in MongoDB Atlas:');
    console.log(doc);
    
    // Check what collections exist
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Collections in database:');
    collections.forEach(coll => console.log(`- ${coll.name}`));
    
    console.log('\nTest completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    
    // For local testing, try with a local MongoDB
    console.log('\nTrying to connect to local MongoDB...');
    
    mongoose.connect('mongodb://localhost:27017/wingrox_db')
      .then(() => {
        console.log('Connected to local MongoDB successfully!');
        
        // Create schema
        const ContactSchema = new mongoose.Schema({
          name: String,
          email: String,
          phoneNumber: String,
          subject: String,
          message: String,
          createdAt: { type: Date, default: Date.now }
        });
        
        const Contact = mongoose.model('Contact', ContactSchema);
        
        // Create a test document
        return Contact.create({
          name: 'Local Test User',
          email: 'local@example.com',
          phoneNumber: '+1987654321',
          subject: 'Local Test Message',
          message: 'This is a test message to local MongoDB'
        });
      })
      .then(doc => {
        console.log('Created test document in local MongoDB:');
        console.log(doc);
        process.exit(0);
      })
      .catch(localErr => {
        console.error('Error connecting to local MongoDB:', localErr);
        
        console.error('\nSuggestions:');
        console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
        console.error('2. Verify your username and password');
        console.error('3. For local testing, make sure MongoDB is running (docker-compose up mongodb)');
        
        process.exit(1);
      });
  });
