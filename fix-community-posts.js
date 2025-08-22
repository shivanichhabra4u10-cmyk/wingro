// Direct server-side implementation to guarantee post creation works
// Save this as fix-community-posts.js

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-memory storage for community data
const communityData = {
  segments: [
    {
      _id: "career-plateau",
      name: "Career Plateau",
      description: "Discussions for professionals feeling stuck in their career growth",
      icon: "chart-line", 
      color: "#e57373",
      postCount: 25
    },
    {
      _id: "career-change",
      name: "Career Change", 
      description: "Support for those looking to pivot careers",
      icon: "refresh",
      color: "#64b5f6",
      postCount: 18
    }
  ],
  posts: []
};

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Community API server is running' });
});

// GET community segments
app.get(['/api/community/segments', '/community/segments', '/emergency/community/segments'], (req, res) => {
  console.log('Serving community segments');
  res.status(200).json({
    success: true,
    data: communityData.segments
  });
});

// GET community posts
app.get(['/api/community/posts', '/community/posts', '/emergency/community/posts'], (req, res) => {
  console.log('Serving community posts');
  res.status(200).json({
    success: true,
    data: communityData.posts
  });
});

// POST - create a new post
app.post(['/api/community/posts', '/community/posts', '/emergency/community/posts'], (req, res) => {
  console.log('Creating new community post:', req.body);
  
  // Generate new post with ID
  const newPost = {
    _id: `post_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    likes: 0,
    bookmarks: 0,
    commentCount: 0,
    views: 0
  };
  
  // Add to in-memory store
  communityData.posts.unshift(newPost);
  
  console.log(`Created post with ID: ${newPost._id}`);
  
  // Return success
  res.status(201).json({
    success: true,
    data: newPost
  });
});

// Like a post
app.post(['/api/community/posts/:id/like', '/community/posts/:id/like', '/emergency/community/posts/:id/like'], (req, res) => {
  const postId = req.params.id;
  console.log(`Liking post: ${postId}`);
  
  const post = communityData.posts.find(p => p._id === postId);
  if (post) {
    post.likes += 1;
    res.status(200).json({
      success: true,
      data: post
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
});

// Bookmark a post
app.post(['/api/community/posts/:id/bookmark', '/community/posts/:id/bookmark', '/emergency/community/posts/:id/bookmark'], (req, res) => {
  const postId = req.params.id;
  console.log(`Bookmarking post: ${postId}`);
  
  const post = communityData.posts.find(p => p._id === postId);
  if (post) {
    post.bookmarks += 1;
    res.status(200).json({
      success: true,
      data: post
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
});

// 404 handler for all other routes
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Community API fix server running on http://localhost:${PORT}`);
  console.log('This server guarantees that post creation will work');
  console.log('\nAvailable endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/community/segments');
  console.log('  GET  /community/segments');
  console.log('  GET  /emergency/community/segments');
  console.log('  GET  /api/community/posts');
  console.log('  GET  /community/posts');
  console.log('  GET  /emergency/community/posts');
  console.log('  POST /api/community/posts');
  console.log('  POST /community/posts');
  console.log('  POST /emergency/community/posts');
  console.log('\nAll paths are active and working!');
});
