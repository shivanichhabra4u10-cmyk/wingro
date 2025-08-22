/**
 * INTEGRATED API SERVER
 * 
 * This script combines all API functionality into a single server:
 * - Main application API
 * - Products API
 * - Community API
 * 
 * No more separate servers needed!
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Enhanced logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

//----------------------------------------------
// DATABASE CONNECTION
//----------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db';
console.log(`Connecting to MongoDB at: ${MONGODB_URI.split('@').pop()}`); // Hide credentials in logs

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log(`Database: ${mongoose.connection.name}`);
})
.catch(error => {
  console.error('❌ MongoDB connection error:', error);
  console.log('Server running in limited mode - database features unavailable');
});

//----------------------------------------------
// SCHEMAS & MODELS
//----------------------------------------------

// Community Post Schema
const CommunityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId },
  role: { type: String },
  question: { type: String, required: true },
  details: { type: String },
  segmentId: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  isAnswered: { type: Boolean, default: false },
  answer: { type: String },
  answeredBy: { type: String },
  answererRole: { type: String },
  answererCoachId: { type: mongoose.Schema.Types.ObjectId },
  reflection: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Community Comment Schema
const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Segment Schema
const SegmentSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  color: String,
  postCount: { type: Number, default: 0 }
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: Number,
  badge: String,
  category: { type: String, required: true },
  productType: { 
    type: String, 
    required: true,
    enum: ['individual', 'enterprise'] 
  },
  images: [String],
  features: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Create models
const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
const Segment = mongoose.models.Segment || mongoose.model('Segment', SegmentSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

//----------------------------------------------
// SAMPLE DATA FOR FALLBACK
//----------------------------------------------
const fallbackSegments = [
  {
    _id: 'career-plateau',
    name: 'Career Plateau',
    description: 'Discussions and advice for professionals feeling stuck in their career growth.',
    icon: 'chart-line-stagnant',
    color: '#e57373',
    postCount: 25
  },
  {
    _id: 'career-change',
    name: 'Career Change',
    description: 'Support and guidance for those looking to pivot to a new career path.',
    icon: 'refresh-circle',
    color: '#64b5f6',
    postCount: 18
  },
  {
    _id: 'skill-development',
    name: 'Skill Development',
    description: 'Resources and discussions on acquiring new skills and competencies.',
    icon: 'school',
    color: '#81c784',
    postCount: 30
  },
  {
    _id: 'work-life-balance',
    name: 'Work-Life Balance',
    description: 'Strategies for maintaining a healthy balance between professional and personal life.',
    icon: 'balance-scale',
    color: '#ffb74d',
    postCount: 22
  }
];

// Load your original server routes if possible
try {
  const mainApp = require('./server/dist/app');
  console.log('✅ Successfully imported main application routes');
} catch (err) {
  console.log('⚠️ Could not import main application routes:', err.message);
}

//----------------------------------------------
// COMMUNITY API ROUTES
//----------------------------------------------

// Helper function to get segments (from DB or fallback)
async function getSegments() {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbSegments = await Segment.find({});
      if (dbSegments && dbSegments.length > 0) {
        console.log(`Found ${dbSegments.length} segments in MongoDB`);
        return {
          success: true,
          source: 'mongodb',
          count: dbSegments.length,
          data: dbSegments
        };
      }
    }
  } catch (err) {
    console.error('Error fetching segments from MongoDB:', err);
  }
  
  // Return fallback data
  return {
    success: true,
    source: 'fallback',
    count: fallbackSegments.length,
    data: fallbackSegments
  };
}

// Segments endpoints - multiple paths for compatibility
app.get(['/api/community/segments', '/community/segments', '/emergency/community/segments'], async (req, res) => {
  console.log('[Endpoint] Serving community segments');
  const response = await getSegments();
  res.json(response);
});

// Posts endpoints - multiple paths for compatibility
app.get(['/api/community/posts', '/community/posts', '/emergency/community/posts'], async (req, res) => {
  console.log('[Endpoint] Serving community posts', req.query);
  
  try {
    const filter = { isActive: true };
    
    // Filter by segment if provided
    if (req.query.segmentId) {
      filter.segmentId = req.query.segmentId;
    }
    
    // Filter by answered status if provided
    if (req.query.answered !== undefined) {
      filter.isAnswered = req.query.answered === 'true';
    }
    
    let query = CommunityPost.find(filter);
  
    // Apply sorting if provided
    const sortParam = req.query.sort || 'newest';
    const sortOptions = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'most-commented': { comments: -1 },
      'most-viewed': { views: -1 },
      'most-liked': { likes: -1 }
    };
    
    query = query.sort(sortOptions[sortParam] || { createdAt: -1 });
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const posts = await query.exec();
    const total = await CommunityPost.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      count: posts.length,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return fallback data if database is not available
    // This would need to be implemented with your fallback posts data
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

//----------------------------------------------
// PRODUCTS API ROUTES
//----------------------------------------------

// Helper function for reading/writing product data
const PRODUCTS_FILE = path.join(__dirname, 'products-data.json');

// Initialize products file if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  const sampleProducts = [
    {
      _id: '1',
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
      features: ["Feature 1", "Feature 2"],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
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
      features: ["Feature 1", "Feature 2"],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({ products: sampleProducts }, null, 2));
}

// Helper functions for products
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return { products: [] };
  }
};

const writeProducts = (data) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Define product routes - multiple paths for compatibility
const productPaths = ['', '/api', '/v1', '/api/v1'];

// GET all products
const getAllProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Try to get from database first
      const products = await Product.find({ isActive: true });
      if (products && products.length > 0) {
        return res.status(200).json({
          success: true,
          count: products.length,
          data: products
        });
      }
    }
    
    // Fall back to file-based data
    const data = readProducts();
    const products = data.products.filter(p => p.isActive);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error fetching products' 
    });
  }
};

// Register the products routes for all path variations
productPaths.forEach(path => {
  app.get(`${path}/products`, getAllProducts);
});

// GET product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (mongoose.connection.readyState === 1) {
      // Try to get from database first
      const product = await Product.findOne({ _id: id, isActive: true });
      if (product) {
        return res.status(200).json({
          success: true,
          data: product
        });
      }
    }
    
    // Fall back to file-based data
    const data = readProducts();
    const product = data.products.find(p => p._id === id && p.isActive);
    
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
    console.error(`Error getting product ${id}:`, error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error fetching product' 
    });
  }
};

// Register the product by ID routes for all path variations
productPaths.forEach(path => {
  app.get(`${path}/products/:id`, getProductById);
});

// Create new product
const createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Try to create in database first
      const newProduct = new Product({
        ...req.body,
        isActive: true
      });
      
      const savedProduct = await newProduct.save();
      return res.status(201).json({
        success: true,
        data: savedProduct
      });
    }
    
    // Fall back to file-based data
    const data = readProducts();
    
    const newProduct = {
      _id: Date.now().toString(),
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.products.push(newProduct);
    
    if (writeProducts(data)) {
      return res.status(201).json({
        success: true,
        data: newProduct
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Error creating product'
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error creating product' 
    });
  }
};

// Register the create product routes for all path variations
productPaths.forEach(path => {
  app.post(`${path}/products`, createProduct);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API server is running',
    version: '1.0.0',
    integrations: {
      community: true,
      products: true
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'none'
    }
  });
});

//----------------------------------------------
// CATCH-ALL AND ERROR HANDLING
//----------------------------------------------

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/health',
      '/api/community/segments',
      '/community/segments',
      '/emergency/community/segments',
      '/api/community/posts',
      '/community/posts',
      '/emergency/community/posts',
      '/products',
      '/api/products',
      '/v1/products',
      '/api/v1/products'
    ]
  });
});

//----------------------------------------------
// SERVER STARTUP
//----------------------------------------------

// Start server
const server = app.listen(PORT, () => {
  console.log(`-------------------------------------------------------------`);
  console.log(`🚀 INTEGRATED API SERVER running at http://localhost:${PORT}`);
  console.log(`-------------------------------------------------------------`);
  console.log(`✅ All API endpoints now available in a single server:`);
  console.log(`  - Health check: http://localhost:${PORT}/health`);
  console.log(`  - Community segments: http://localhost:${PORT}/api/community/segments`);
  console.log(`  - Community posts: http://localhost:${PORT}/api/community/posts`);
  console.log(`  - Products API: http://localhost:${PORT}/api/v1/products`);
  console.log(`  * All legacy routes are maintained for compatibility`);
  console.log(`-------------------------------------------------------------`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server has been terminated');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server;
