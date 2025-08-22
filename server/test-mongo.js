const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shivanichhabra4u10:LP5qI0XTyBLiz9DE@wingrocluster.rdz8evo.mongodb.net/wingrox_db?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
  
  // Create a simple schema for testing
  const TestSchema = new mongoose.Schema({
    name: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const TestModel = mongoose.model('Test', TestSchema);
  
  // Create a test document
  return TestModel.create({ name: 'test-' + Date.now() });
})
.then(doc => {
  console.log('Created test document:', doc);
  console.log('MongoDB connection is working correctly!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
