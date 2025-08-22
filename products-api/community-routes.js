// Community routes module
const express = require('express');
const mongoose = require('mongoose');

// Import or define your models
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

// Create model only if it doesn't exist
let CommunityPost;
try {
  CommunityPost = mongoose.model('CommunityPost');
} catch (e) {
  CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
}

// Comment schema
const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create Comment model
let Comment;
try {
  Comment = mongoose.model('Comment');
} catch (e) {
  Comment = mongoose.model('Comment', CommentSchema);
}

// Export a function that sets up the routes on the provided app
module.exports = function(app) {
  console.log('Setting up community routes...');

  // Duplicate route for compatibility
  // Get all community posts
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

// Add other required community endpoints without the /api/ prefix
app.get('/community/posts/:id', async (req, res) => {
  console.log(`[GET] /community/posts/${req.params.id} request received`);
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(`Error fetching community post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.post('/community/posts', async (req, res) => {
  console.log('[POST] /community/posts request received', req.body);
  try {
    const post = await CommunityPost.create(req.body);
    
    return res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.put('/community/posts/:id', async (req, res) => {
  console.log(`[PUT] /community/posts/${req.params.id} request received`, req.body);
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
    console.error(`Error updating community post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.post('/community/posts/:id/like', async (req, res) => {
  console.log(`[POST] /community/posts/${req.params.id}/like request received`);
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    post.likes += 1;
    await post.save();
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(`Error liking community post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.post('/community/posts/:id/bookmark', async (req, res) => {
  console.log(`[POST] /community/posts/${req.params.id}/bookmark request received`);
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    post.bookmarks += 1;
    await post.save();
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(`Error bookmarking community post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

app.get('/community/posts/:id/comments', async (req, res) => {
  console.log(`[GET] /community/posts/${req.params.id}/comments request received`);
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
    console.error(`Error fetching comments for post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

  app.post('/community/posts/:id/comments', async (req, res) => {
  console.log(`[POST] /community/posts/${req.params.id}/comments request received`, req.body);
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Community post not found'
      });
    }
    
    const comment = await Comment.create({
      postId: req.params.id,
      ...req.body
    });
    
    // Increment comment count on post
    post.comments += 1;
    await post.save();
    
    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error(`Error adding comment to post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

  // Add a health check endpoint
  app.get('/community/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Community API routes are working',
      timestamp: new Date().toISOString(),
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  console.log('Community routes setup complete');
}; // End of module.exports function
