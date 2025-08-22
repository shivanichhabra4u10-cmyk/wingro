try {
  const mongoose = require('mongoose');
  
  console.log('Testing MongoDB connection...');
  const MONGODB_URI = 'mongodb://localhost:27017/wingrox_db';
  console.log(`Connecting to: ${MONGODB_URI}`);
  
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
  })
  .finally(() => {
    process.exit();
  });
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error('❌ Error: Required module not found. Installing mongoose...');
    console.error('Please run: npm install mongoose');
    process.exit(1);
  } else {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}
