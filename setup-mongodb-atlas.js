// MongoDB Atlas Connect Script
// This script creates a new MongoDB Atlas connection and sets up the project
// It works without requiring a local MongoDB installation

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('MongoDB Atlas Connection Setup');
console.log('=============================');

// MongoDB Atlas connection URI (read-only for demo purposes)
const MONGODB_ATLAS_URI = 'mongodb+srv://wingrox-readonly:zHGKrGZTlcOOxB6G@demo.mongodb.net/wingrox_db?retryWrites=true&w=majority';

// Default .env file path
const envFilePath = path.join(process.cwd(), '.env');

async function setupAtlasConnection() {
  console.log('\nSetting up MongoDB Atlas connection...');
  
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`Database name: ${mongoose.connection.name}`);
    
    // Update the .env file with the MongoDB Atlas URI
    updateEnvFile(MONGODB_ATLAS_URI);
    
    // Get collection information
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections in the database:`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Initialize database with required collections if they don't exist
    await initializeDatabase();
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to MongoDB Atlas: ${error.message}`);
    return false;
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Connection closed safely.');
    }
  }
}

function updateEnvFile(uri) {
  console.log('\nUpdating .env file with MongoDB Atlas URI...');
  
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
    console.log('✅ Successfully updated .env file with MongoDB Atlas URI!');
  } catch (error) {
    console.error(`❌ Failed to update .env file: ${error.message}`);
  }
}

async function initializeDatabase() {
  console.log('\nInitializing database with required collections...');
  
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_ATLAS_URI);
    
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
      createdAt: { type: Date, default: Date.now }
    });
    
    // Community Posts collection
    const CommunityPostSchema = new mongoose.Schema({
      author: String,
      question: String,
      details: String,
      segmentId: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create models
    const Product = mongoose.model('Product', ProductSchema);
    const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
    
    // Check if we need to initialize sample data
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Adding sample product data...');
      
      // Sample products
      const sampleProducts = [
        {
          name: 'Career Growth Playbook',
          description: 'A comprehensive guide to accelerate your career growth',
          price: 49.99,
          image: '/images/products/career-growth.jpg',
          category: 'playbooks',
          featured: true,
          productType: 'individual'
        },
        {
          name: 'Leadership Essentials',
          description: 'Master the core skills of effective leadership',
          price: 79.99,
          image: '/images/products/leadership.jpg',
          category: 'courses',
          featured: true,
          productType: 'individual'
        }
      ];
      
      // Insert sample products
      await Product.insertMany(sampleProducts);
      console.log(`✅ Added ${sampleProducts.length} sample products to the database.`);
    } else {
      console.log(`Found ${productCount} existing products - skipping sample data creation.`);
    }
    
    // Check if we need to add sample community posts
    const postCount = await CommunityPost.countDocuments();
    if (postCount === 0) {
      console.log('Adding sample community posts...');
      
      // Sample community posts
      const samplePosts = [
        {
          author: 'John Doe',
          question: 'How to transition from technical to management role?',
          details: 'I have been a developer for 5 years and want to move into management. Any advice?',
          segmentId: 'career'
        },
        {
          author: 'Jane Smith',
          question: 'Best practices for remote team leadership?',
          details: 'My team is now fully remote. Looking for strategies to maintain productivity and culture.',
          segmentId: 'leadership'
        }
      ];
      
      // Insert sample community posts
      await CommunityPost.insertMany(samplePosts);
      console.log(`✅ Added ${samplePosts.length} sample community posts to the database.`);
    } else {
      console.log(`Found ${postCount} existing community posts - skipping sample data creation.`);
    }
    
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error(`❌ Error initializing database: ${error.message}`);
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

// Main function
async function main() {
  const setupSuccess = await setupAtlasConnection();
  
  if (setupSuccess) {
    console.log('\n=================================');
    console.log('MongoDB Atlas setup completed successfully!');
    console.log('=================================');
    console.log('\nNext steps:');
    console.log('1. Restart your server or application');
    console.log('2. The application will now use MongoDB Atlas instead of a local MongoDB instance');
    console.log('3. Any of these commands should now work properly:');
    console.log('   - node guaranteed-community-api.js');
    console.log('   - node mongodb-products-api.js');
  } else {
    console.error('\n=================================');
    console.error('❌ MongoDB Atlas setup failed!');
    console.error('=================================');
    console.error('\nPossible solutions:');
    console.error('1. Check your internet connection');
    console.error('2. Make sure your IP is whitelisted in MongoDB Atlas');
    console.error('3. Try a different MongoDB Atlas connection string');
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
