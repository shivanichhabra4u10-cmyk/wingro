// Simple MongoDB Connection Test
const mongoose = require('mongoose');

console.log('Simple MongoDB Connection Test');
console.log('=============================');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/wingrox_db';
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

// Connect to MongoDB with improved error handling
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log(`Database name: ${mongoose.connection.name}`);
  console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
  
  // Create a test document to verify write access
  const TestSchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Test = mongoose.model('Test', TestSchema);
  
  return Test.create({ name: 'Connection Test' })
    .then(doc => {
      console.log(`✅ Test document created with ID: ${doc._id}`);
      return mongoose.connection.close();
    });
})
.catch(error => {
  console.error('❌ MongoDB connection error:', error);
  
  if (error.name === 'MongoServerSelectionError') {
    console.error('\nPossible causes:');
    console.error('1. MongoDB server is not running');
    console.error('2. MongoDB server is not accessible on port 27017');
    console.error('3. Firewall is blocking the connection');
    
    console.error('\nTry these solutions:');
    console.error('1. Start MongoDB server: mongod --dbpath="/data/db"');
    console.error('2. Or use Docker: docker run -d -p 27017:27017 mongo');
    console.error('3. Check if MongoDB is running: ps aux | grep mongo');
  }
})
.finally(() => {
  console.log('Test complete.');
  process.exit();
});
