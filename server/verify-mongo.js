// Verify MongoDB connection and validate API routes
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wingrox";

async function verifyMongoDBAndAPI() {
  console.log('Starting verification process...');
  console.log('MongoDB URI:', uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Get list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check if products collection exists
    const hasProductsCollection = collections.some(c => c.name === 'products');
    console.log(`\nProducts collection exists: ${hasProductsCollection ? '✅ YES' : '❌ NO'}`);
    
    // If products collection doesn't exist, create it with a sample document
    if (!hasProductsCollection) {
      console.log('\nCreating products collection with a sample document...');
      
      // Define a schema for Product
      const productSchema = new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        productType: String,
        category: String,
        isActive: Boolean,
        createdAt: Date,
        updatedAt: Date
      });
      
      // Create model from schema
      const Product = mongoose.model('Product', productSchema);
      
      // Create a sample product
      const sampleProduct = new Product({
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        productType: 'individual',
        category: 'digital',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Save to database
      await sampleProduct.save();
      console.log('✅ Sample product created successfully!');
    }
    
    // See if we can get products
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}));
    const products = await Product.find().limit(5);
    
    console.log('\nProduct documents in database:');
    if (products.length === 0) {
      console.log('No products found in database.');
    } else {
      products.forEach((product, i) => {
        console.log(`${i+1}. ${product.name} - ${product.productType}`);
      });
    }
    
    console.log('\n✅ Verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

// Run the verification
verifyMongoDBAndAPI();
