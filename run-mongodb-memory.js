// Local MongoDB Memory Server Setup
// This script sets up an in-memory MongoDB server for development
// No need to install MongoDB locally or use Atlas

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('Setting up Local MongoDB Memory Server...');
console.log('=======================================');

// Initialize MongoDB Memory Server
let mongoServer;

// Store MongoDB Memory Server URI in .env file
const envFilePath = path.join(process.cwd(), '.env');

async function startServer() {
  console.log('\nStarting MongoDB Memory Server...');
  
  try {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'wingrox_db',
        port: 27017
      }
    });
    
    // Get connection URI
    const mongoUri = mongoServer.getUri();
    console.log(`✅ MongoDB Memory Server started at: ${mongoUri}`);
    
    // Connect to in-memory server
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Memory Server successfully!');
    
    // Update .env file with memory server URI
    updateEnvFile(mongoUri);
    
    // Initialize database with sample data
    await initializeDatabase();
    
    console.log('\n=======================================');
    console.log('🚀 MongoDB Memory Server is running!');
    console.log('=======================================');
    console.log('\nIMPORTANT: Keep this terminal window open to maintain the database.');
    console.log('The in-memory database will be lost if you close this window.');
    console.log('\nNow you can run your application in a separate terminal:');
    console.log('1. node guaranteed-community-api.js');
    console.log('2. node mongodb-products-api.js');
    console.log('3. Open another terminal to run your React app');
    
    // Keep the process running to maintain the in-memory database
    process.stdin.resume();
    
    // Handle termination signals
    process.on('SIGINT', async () => {
      await stopServer();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await stopServer();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`❌ Failed to start MongoDB Memory Server: ${error}`);
    process.exit(1);
  }
}

async function stopServer() {
  console.log('\nShutting down MongoDB Memory Server...');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ Mongoose connection closed.');
  }
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('✅ MongoDB Memory Server stopped.');
  }
}

function updateEnvFile(uri) {
  console.log('\nUpdating .env file with MongoDB Memory Server URI...');
  
  try {
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Check if MONGODB_URI already exists in the file
      if (envContent.includes('MONGODB_URI=')) {
        // Replace the existing MONGODB_URI
        envContent = envContent.replace(
          /MONGODB_URI=.*/,
          `MONGODB_URI=${uri}`
        );
      } else {
        // Add MONGODB_URI to the end of file
        envContent += `\nMONGODB_URI=${uri}\n`;
      }
    } else {
      // Create new .env file with MONGODB_URI
      envContent = `MONGODB_URI=${uri}\n`;
    }
    
    // Write updated content to .env file
    fs.writeFileSync(envFilePath, envContent);
    console.log('✅ Successfully updated .env file with MongoDB Memory Server URI!');
  } catch (error) {
    console.error(`❌ Failed to update .env file: ${error.message}`);
  }
}

async function initializeDatabase() {
  console.log('\nInitializing database with required collections...');
  
  try {
    // Define schemas for required collections
    
    // Products collection
    const ProductSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      image: String,
      category: String,
      featured: Boolean,
      productType: String,
      oldPrice: Number,
      badge: String,
      features: [String],
      createdAt: { type: Date, default: Date.now }
    });
    
    // Community Posts collection
    const CommunityPostSchema = new mongoose.Schema({
      author: String,
      authorId: mongoose.Schema.Types.ObjectId,
      role: String,
      question: String,
      details: String,
      segmentId: String,
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    // User schema for admin testing
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, default: 'user' },
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create models
    const Product = mongoose.model('Product', ProductSchema);
    const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
    const User = mongoose.model('User', UserSchema);
    
    // Sample products
    const sampleProducts = [
      {
        name: 'Career Growth Playbook',
        description: 'A comprehensive guide to accelerate your career growth',
        price: 49.99,
        image: '/images/products/career-growth.jpg',
        category: 'playbooks',
        featured: true,
        productType: 'individual',
        oldPrice: 69.99,
        badge: 'Best Seller',
        features: ['45+ actionable strategies', '10 career templates', 'Email support']
      },
      {
        name: 'Leadership Essentials',
        description: 'Master the core skills of effective leadership',
        price: 79.99,
        image: '/images/products/leadership.jpg',
        category: 'courses',
        featured: true,
        productType: 'individual',
        features: ['12 video modules', 'Certificate of completion', 'Case studies']
      },
      {
        name: 'Enterprise Growth Package',
        description: 'Complete solution for company-wide professional development',
        price: 1299.99,
        image: '/images/products/enterprise.jpg',
        category: 'packages',
        featured: false,
        productType: 'enterprise',
        features: ['Access for up to 50 employees', 'Custom learning paths', 'Quarterly insights report']
      }
    ];
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${sampleProducts.length} sample products to the database.`);
    
    // Sample community posts
    const samplePosts = [
      {
        author: 'John Doe',
        role: 'Professional',
        question: 'How to transition from technical to management role?',
        details: 'I have been a developer for 5 years and want to move into management. Any advice?',
        segmentId: 'career',
        views: 120,
        likes: 15,
        comments: 8
      },
      {
        author: 'Jane Smith',
        role: 'Leader',
        question: 'Best practices for remote team leadership?',
        details: 'My team is now fully remote. Looking for strategies to maintain productivity and culture.',
        segmentId: 'leadership',
        views: 89,
        likes: 12,
        comments: 6
      }
    ];
    
    // Insert sample community posts
    await CommunityPost.insertMany(samplePosts);
    console.log(`✅ Added ${samplePosts.length} sample community posts to the database.`);
    
    // Add admin user for testing
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password_here', // In a real app, this would be properly hashed
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ Added admin user to the database.');
    
    console.log('\n✅ Database initialization complete!');
    
  } catch (error) {
    console.error(`❌ Error initializing database: ${error.message}`);
  }
}

// Start the MongoDB Memory Server
startServer().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});
