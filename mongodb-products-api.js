/**
 * MONGODB PRODUCTS API
 * 
 * This is a standalone Express server that serves product-related API endpoints
 * with MongoDB database storage for persistence.
 * It runs on port 3001 and provides all the necessary product management functionality.
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
console.log(`Attempting to connect to MongoDB at: ${MONGO_URI}`);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,  // Keep trying to connect for 5 seconds
  socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
  family: 4                        // Use IPv4, skip trying IPv6
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('\nTROUBLESHOOTING STEPS:');
  console.log('1. Is MongoDB running? Try: docker-compose up -d mongodb');
  console.log('2. If using local MongoDB, ensure it\'s started on port 27017');
  console.log('3. For Docker: docker run -d -p 27017:27017 --name mongodb mongo');
});

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  oldPrice: {
    type: Number
  },
  badge: {
    type: String,
    enum: ['New', 'Best Seller', 'Popular', 'Premium', 'AI-Powered', 'Quick Win', 'Flagship', 'Enterprise', 'Teams']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['digital', 'platform', 'service']
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['individual', 'enterprise']
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Initialize with sample data if needed
const initializeData = async () => {
  try {
    // Check if we have products already
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('No products found, initializing sample data...');
      
      // Sample products
      const sampleProducts = [
        {
          name: "Market Validation Kit",
          description: "Complete PMF analysis with AI-driven insights",
          price: 599,
          oldPrice: 999,
          badge: "AI-Powered",
          category: "digital",
          productType: "individual",
          images: [
            "https://placehold.co/600x400/94a3b8/FFFFFF?text=Market+Validation+Dashboard",
            "https://placehold.co/600x400/a1a1aa/FFFFFF?text=PMF+Analysis+Tool"
          ],
          features: ["Feature 1", "Feature 2"]
        },
        {
          name: "GTM Strategy Playbook",
          description: "Launch & pricing strategies that work",
          price: 599,
          badge: "Best Seller",
          category: "digital",
          productType: "individual",
          images: [
            "https://placehold.co/600x400/a3e635/FFFFFF?text=GTM+Strategy+Framework", 
            "https://placehold.co/600x400/bef264/FFFFFF?text=Pricing+Model+Calculator"
          ],
          features: ["Feature 1", "Feature 2"]
        },
        {
          name: "InvestorIQ Engine",
          description: "AI-powered investor matchmaking",
          price: 599,
          badge: "Premium",
          category: "digital",
          productType: "enterprise",
          images: [
            "https://placehold.co/600x400/c4b5fd/FFFFFF?text=Investor+Matching+Engine", 
            "https://placehold.co/600x400/d8b4fe/FFFFFF?text=Funding+Opportunity+Radar"
          ],
          features: ["Feature 1", "Feature 2"]
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log(`${sampleProducts.length} sample products created!`);
    } else {
      console.log(`Found ${count} existing products in the database`);
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Initialize database after connection
mongoose.connection.once('open', initializeData);

// Routes - Support both /products and /api/products paths

// Health check endpoint
app.get('/health', async (req, res) => {
  // Ensure MongoDB connection is properly checked
  let isConnected = mongoose.connection.readyState === 1;
  
  // If disconnected, try to reconnect
  if (!isConnected) {
    try {
      // Try to reconnect to MongoDB
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
      await mongoose.connect(mongoUri);
      console.log('Reconnected to MongoDB successfully');
      isConnected = true;
    } catch (error) {
      console.error('Failed to reconnect to MongoDB:', error.message);
    }
  }
  
  res.json({ 
    status: 'ok', 
    message: 'Products API is running',
    mongodb: isConnected ? 'connected' : 'disconnected'
  });
});

// GET all products with pagination and limit options
const getAllProducts = async (req, res) => {
  try {
    const { productType, category, limit = 5, page = 1, sortBy = 'createdAt', sortOrder = -1 } = req.query;
    
    // Parse numeric parameters
    const parsedLimit = parseInt(limit) || 100;
    const parsedPage = parseInt(page) || 1;
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Build filter based on query parameters
    const filter = { isActive: true };
    if (productType) filter.productType = productType;
    if (category) filter.category = category;

    // Get total count for pagination info
    const totalCount = await Product.countDocuments(filter);
    
    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder === '-1' || sortOrder === -1 ? -1 : 1;
    
    // Execute query with pagination, sorting and increased limit
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Math.min(parsedLimit, 1000)); // Maximum 1000 products per request
    
    return res.status(200).json({
      success: true,
      count: products.length,
      totalCount: totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
      hasMore: skip + products.length < totalCount,
      data: products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

app.get('/products', getAllProducts);
app.get('/api/products', getAllProducts);

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, isActive: true });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

app.get('/products/:id', getProductById);
app.get('/api/products/:id', getProductById);

// Create new product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    console.log('Product created in MongoDB:', product);
    
    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
};

app.post('/products', createProduct);
app.post('/api/products', createProduct);

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update with validation
    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log('Product updated in MongoDB:', product);
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
};

app.put('/products/:id', updateProduct);
app.put('/api/products/:id', updateProduct);

// Soft delete product (mark as inactive)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log('Product soft-deleted in MongoDB:', product);
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

app.delete('/products/:id', deleteProduct);
app.delete('/api/products/:id', deleteProduct);

// Hard delete product (permanently remove)
const hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log('Product permanently deleted from MongoDB:', product);
    
    return res.status(200).json({
      success: true,
      data: { _id: id, deleted: true }
    });
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

app.delete('/products/:id/hard', hardDeleteProduct);
app.delete('/api/products/:id/hard', hardDeleteProduct);

// Start the server
app.listen(PORT, () => {
  console.log(`MongoDB Products API Server running on http://localhost:${PORT}`);
  console.log(`Products API endpoints:`);
  console.log(`- GET /api/products`);
  console.log(`- GET /api/products/:id`);
  console.log(`- POST /api/products`);
  console.log(`- PUT /api/products/:id`);
  console.log(`- DELETE /api/products/:id`);
  console.log(`- DELETE /api/products/:id/hard`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
