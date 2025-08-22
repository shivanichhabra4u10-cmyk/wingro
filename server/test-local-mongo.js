const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// Manually load environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '.env');
    console.log('Loading .env from:', envPath);
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      // Skip empty lines and comments
      if (!line || line.trim().startsWith('#')) return;
      
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        // Join with = in case the value itself contains = characters
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
    
    console.log('Environment variables loaded successfully');
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
}

// Load environment variables
loadEnv();

// Get MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
console.log('Using MongoDB URI:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
  
  // Define a Contact schema for testing
  const ContactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: false
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Contact = mongoose.model('Contact', ContactSchema);
  
  // Create a test contact
  return Contact.create({
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '123-456-7890',
    subject: 'Test Subject',
    message: 'This is a test message'
  });
})
.then(contact => {
  console.log('Created test contact:', contact);
  return mongoose.connection.db.listCollections().toArray();
})
.then(collections => {
  console.log('Collections in the database:');
  collections.forEach(collection => {
    console.log('-', collection.name);
  });
  
  console.log('Test completed successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB error:', err);
  process.exit(1);
});
