// Standalone Products API Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Enhanced request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  badge: { type: String },
  category: { type: String, required: true },
  productType: { type: String, required: true, enum: ['individual', 'enterprise'] },
  images: [String],
  features: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Coach schema
const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialty: { type: String, required: true },
  bio: { type: String, required: false },
  rate: { type: Number, required: false },
  profileImage: { type: String, required: false },
  availability: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Community Segment schema
const CommunitySegmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isMatched: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Community Post schema
const CommunityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String },
  question: { type: String, required: true },
  answer: { type: String },
  reflection: { type: String },
  answeredBy: { type: String },
  answererRole: { type: String },
  answererCoachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  segmentId: { type: String, required: true },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  isAnswered: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Comment schema
const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Create product model
const Product = mongoose.model('Product', ProductSchema);

// Create coach model
const Coach = mongoose.model('Coach', CoachSchema);

// Create community models
const CommunitySegment = mongoose.model('CommunitySegment', CommunitySegmentSchema);
const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Standalone Products API Server' });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const [productCount, coachCount, segmentCount, postCount] = await Promise.all([
      Product.countDocuments(),
      Coach.countDocuments(),
      CommunitySegment.countDocuments(),
      CommunityPost.countDocuments()
    ]);
    
    res.json({ 
      status: 'ok', 
      products: productCount,
      coaches: coachCount,
      segments: segmentCount,
      posts: postCount,
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  } catch (error) {
    console.error('Error in health check:', error);
    res.status(500).json({
      status: 'error',
      error: 'Error checking database status',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  }
});

// IMPORTANT: Direct products routes without /api prefix
// GET all products
app.get('/products', async (req, res) => {
  try {
    const { productType, category } = req.query;
    const filter = { isActive: true };
    
    if (productType) filter.productType = productType;
    if (category) filter.category = category;
    
    const products = await Product.find(filter);
    console.log(`Found ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// IMPORTANT: Also support /api/products path
app.get('/api/products', async (req, res) => {
  try {
    const { productType, category } = req.query;
    const filter = { isActive: true };
    
    if (productType) filter.productType = productType;
    if (category) filter.category = category;
    
    const products = await Product.find(filter);
    console.log(`Found ${products.length} products via /api/products`);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// POST create new product - direct route
app.post('/products', async (req, res) => {
  try {
    console.log('Creating product with data (direct route):', req.body);
    
    const product = new Product(req.body);
    await product.save();
    
    console.log('Product created successfully:', product._id);
    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// POST create new product - with /api prefix
app.post('/api/products', async (req, res) => {
  try {
    console.log('Creating product with data (/api route):', req.body);
    
    const product = new Product(req.body);
    await product.save();
    
    console.log('Product created successfully via /api/products:', product._id);
    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Support both direct and /api routes for remaining endpoints
// GET product by id
app.get('/products/:id', getProductById);
app.get('/api/products/:id', getProductById);

// PUT update product
app.put('/products/:id', updateProduct);
app.put('/api/products/:id', updateProduct);

// DELETE product (soft delete)
app.delete('/products/:id', deleteProduct);
app.delete('/api/products/:id', deleteProduct);

// COACH API ENDPOINTS
// GET all coaches
app.get('/coaches', async (req, res) => {
  try {
    console.log('Fetching all coaches');
    
    const coaches = await Coach.find({ isActive: { $ne: false } });
    
    return res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// GET all coaches with /api prefix
app.get('/api/coaches', async (req, res) => {
  try {
    console.log('Fetching all coaches via /api route');
    
    const coaches = await Coach.find({ isActive: { $ne: false } });
    
    return res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// POST create new coach - direct route
app.post('/coaches', async (req, res) => {
  try {
    console.log('Creating coach with data (direct route):', req.body);
    
    const coach = new Coach(req.body);
    await coach.save();
    
    console.log('Coach created successfully:', coach._id);
    return res.status(201).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error creating coach:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// POST create new coach - with /api prefix
app.post('/api/coaches', async (req, res) => {
  try {
    console.log('Creating coach with data (/api route):', req.body);
    
    const coach = new Coach(req.body);
    await coach.save();
    
    console.log('Coach created successfully via /api/coaches:', coach._id);
    return res.status(201).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error creating coach:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// GET coach by id
app.get('/coaches/:id', getCoachById);
app.get('/api/coaches/:id', getCoachById);

// PUT update coach
app.put('/coaches/:id', updateCoach);
app.put('/api/coaches/:id', updateCoach);

// DELETE coach (soft delete)
app.delete('/coaches/:id', deleteCoach);
app.delete('/api/coaches/:id', deleteCoach);

// COMMUNITY API ENDPOINTS

// Get all community segments
app.get('/community/segments', async (req, res) => {
  console.log('[GET] /community/segments request received');
  try {
    const segments = await CommunitySegment.find({ isActive: true });
    console.log(`[GET] /community/segments returning ${segments.length} segments`);
    return res.status(200).json({
      success: true,
      count: segments.length,
      data: segments
    });
  } catch (error) {
    console.error('Error fetching community segments:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.get('/api/community/segments', async (req, res) => {
  console.log('[GET] /api/community/segments request received');
  try {
    const segments = await CommunitySegment.find({ isActive: true });
    console.log(`[GET] /api/community/segments returning ${segments.length} segments`);
    return res.status(200).json({
      success: true,
      count: segments.length,
      data: segments
    });
  } catch (error) {
    console.error('Error fetching community segments:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get a specific community segment
app.get('/api/community/segments/:id', async (req, res) => {
  try {
    const segment = await CommunitySegment.findOne({ id: req.params.id, isActive: true });
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        error: 'Community segment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: segment
    });
  } catch (error) {
    console.error('Error fetching community segment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create a new community segment
app.post('/api/community/segments', async (req, res) => {
  try {
    const segment = await CommunitySegment.create(req.body);
    return res.status(201).json({
      success: true,
      data: segment
    });
  } catch (error) {
    console.error('Error creating community segment:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update a community segment
app.put('/api/community/segments/:id', async (req, res) => {
  try {
    const segment = await CommunitySegment.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        error: 'Community segment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: segment
    });
  } catch (error) {
    console.error('Error updating community segment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Delete a community segment (soft delete)
app.delete('/api/community/segments/:id', async (req, res) => {
  try {
    const segment = await CommunitySegment.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        error: 'Community segment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: segment
    });
  } catch (error) {
    console.error('Error deleting community segment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get all community posts
app.get('/api/community/posts', async (req, res) => {
  console.log('[GET] /api/community/posts request received', req.query);
  try {
    const filter = { isActive: true };
    
    // Filter by segment if provided
    if (req.query.segmentId) {
      filter.segmentId = req.query.segmentId;
    }
    
    // Filter by answered/unanswered if provided
    if (req.query.answered !== undefined) {
      filter.isAnswered = req.query.answered === 'true';
    }
    
    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (req.query.sort === 'most-viewed') {
      sortOption = { bookmarks: -1, likes: -1 };
    } else if (req.query.sort === 'trending') {
      sortOption = { likes: -1, comments: -1 };
    } else if (req.query.sort === 'coach-pick') {
      sortOption = { isAnswered: -1, createdAt: -1 };
    }
    
    const posts = await CommunityPost.find(filter)
      .sort(sortOption)
      .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Duplicate route for client compatibility (no /api/ prefix)
app.get('/community/posts', async (req, res) => {
  console.log('[GET] /community/posts request received', req.query);
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
    
    // Apply limit if provided
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }
    
    const posts = await query.exec();
    
    console.log(`[GET] /community/posts returning ${posts.length} posts`);
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get a specific community post
app.get('/api/community/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findOne({ _id: req.params.id, isActive: true });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching community post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create a new community post/question
app.post('/api/community/posts', async (req, res) => {
  try {
    const post = await CommunityPost.create(req.body);
    return res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update a community post (including answering a question)
app.put('/api/community/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating community post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Like a post
app.post('/api/community/posts/:id/like', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Bookmark a post
app.post('/api/community/posts/:id/bookmark', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookmarks: 1 } },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error bookmarking post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Delete a community post (soft delete)
app.delete('/api/community/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error deleting community post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get comments for a post
app.get('/api/community/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      postId: req.params.id,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Add a comment to a post
app.post('/api/community/posts/:id/comments', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    const comment = await Comment.create({
      ...req.body,
      postId: req.params.id
    });
    
    // Increment the comment count on the post
    await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { comments: 1 } }
    );
    
    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});


// Coach handler functions
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    
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
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
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
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

async function getCoachById(req, res) {
  try {
    const coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

async function updateCoach(req, res) {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

async function deleteCoach(req, res) {
  try {
    // Soft delete by setting isActive to false
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// Connect to MongoDB and start the server

// Include community routes
// Setup community routes
const setupCommunityRoutes = require('./community-routes');
setupCommunityRoutes(app);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB:', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`\n🚀 STANDALONE ADMIN API running on port ${PORT}`);
      console.log(`\n📮 PRODUCTS API ENDPOINTS:`);
      console.log(`  GET    http://localhost:${PORT}/products`);
      console.log(`  GET    http://localhost:${PORT}/products/:id`);
      console.log(`  POST   http://localhost:${PORT}/products`);
      console.log(`  PUT    http://localhost:${PORT}/products/:id`);
      console.log(`  DELETE http://localhost:${PORT}/products/:id`);
      
      console.log(`\n📮 COACHES API ENDPOINTS:`);
      console.log(`  GET    http://localhost:${PORT}/coaches`);
      console.log(`  GET    http://localhost:${PORT}/coaches/:id`);
      console.log(`  POST   http://localhost:${PORT}/coaches`);
      console.log(`  PUT    http://localhost:${PORT}/coaches/:id`);
      console.log(`  DELETE http://localhost:${PORT}/coaches/:id`);
      
      console.log(`\n📮 COMMUNITY API ENDPOINTS:`);
      console.log(`  GET    http://localhost:${PORT}/community/segments`);
      console.log(`  GET    http://localhost:${PORT}/community/posts`);
      console.log(`  GET    http://localhost:${PORT}/community/posts/:id`);
      console.log(`  POST   http://localhost:${PORT}/community/posts`);
      console.log(`  PUT    http://localhost:${PORT}/community/posts/:id`);
      console.log(`  DELETE http://localhost:${PORT}/community/posts/:id`);
      
      console.log(`\nDUPLICATE ROUTES WITH /api/ PREFIX ALSO SUPPORTED`);
      console.log(`  POST   http://localhost:${PORT}/api/products`);
      console.log(`  POST   http://localhost:${PORT}/api/coaches`);
      console.log(`  POST   http://localhost:${PORT}/api/community/posts`);
      
      console.log(`\n🔍 HEALTH CHECK: http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
