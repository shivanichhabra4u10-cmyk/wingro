const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Manually read and parse the .env file
function loadEnvFile(filePath) {
  const envConfig = {};
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    
    lines.forEach(line => {
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) return;
      
      const [key, value] = line.split('=');
      if (key && value) {
        envConfig[key.trim()] = value.trim();
      }
    });
    
    return envConfig;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
}

// Load the .env file
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env file from:', envPath);
const env = loadEnvFile(envPath);

// Get MongoDB URI
const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
// Hide credentials in console output
const redactedURI = MONGODB_URI.includes('@') 
  ? MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') 
  : MONGODB_URI;
console.log('URI:', redactedURI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Create a simple test collection
    const TestCollection = mongoose.connection.collection('test_collection');
    
    // Insert a test document
    return TestCollection.insertOne({
      name: 'Test Document',
      createdAt: new Date()
    });
  })
  .then(result => {
    console.log('Inserted test document:', result);
    console.log('MongoDB connection and database creation successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
