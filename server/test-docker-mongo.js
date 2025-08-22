const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://mongodb:27017/wingrox_db';

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
  return mongoose.disconnect();
})
.then(() => {
  console.log('Disconnected from MongoDB');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
