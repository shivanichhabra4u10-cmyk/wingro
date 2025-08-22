const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Sample data
const segments = [
  {
    _id: "career-plateau",
    name: "Career Plateau",
    description: "Discussions and advice for professionals feeling stuck in their career growth.",
    icon: "chart-line-stagnant",
    color: "#e57373",
    postCount: 25
  },
  {
    _id: "career-change",
    name: "Career Change",
    description: "Support and guidance for those looking to pivot to a new career path.",
    icon: "refresh-circle", 
    color: "#64b5f6",
    postCount: 18
  }
];

const posts = [
  {
    _id: "post1",
    segmentId: "career-plateau",
    question: "How do I overcome feeling stuck in my current role?",
    details: "I've been in the same position for 3 years with no promotion in sight. What strategies can help me progress?",
    author: "Alex Johnson",
    role: "Software Developer",
    isAnonymous: false,
    tags: ["promotion", "growth", "career-development"],
    views: 120,
    likes: 15,
    bookmarks: 8,
    commentCount: 7,
    createdAt: "2025-06-01T10:30:00Z",
    isAnswered: true
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  console.log('[GET] /health');
  res.json({ status: 'ok', message: 'Emergency API running' });
});

// GET endpoints
app.get('/api/community/segments', (req, res) => {
  console.log('[GET] /api/community/segments');
  res.json({ success: true, count: segments.length, data: segments });
});

app.get('/community/segments', (req, res) => {
  console.log('[GET] /community/segments');
  res.json({ success: true, count: segments.length, data: segments });
});

app.get('/emergency/community/segments', (req, res) => {
  console.log('[GET] /emergency/community/segments');
  res.json({ success: true, count: segments.length, data: segments });
});

app.get('/api/community/posts', (req, res) => {
  console.log('[GET] /api/community/posts');
  res.json({ success: true, count: posts.length, data: posts });
});

app.get('/community/posts', (req, res) => {
  console.log('[GET] /community/posts');
  res.json({ success: true, count: posts.length, data: posts });
});

app.get('/emergency/community/posts', (req, res) => {
  console.log('[GET] /emergency/community/posts');
  res.json({ success: true, count: posts.length, data: posts });
});

// POST endpoints
app.post('/api/community/posts', (req, res) => {
  console.log('[POST] /api/community/posts', req.body);
  const newPost = {
    _id: 'post' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    bookmarks: 0,
    commentCount: 0
  };
  posts.unshift(newPost);
  res.status(201).json({ success: true, data: newPost });
});

app.post('/community/posts', (req, res) => {
  console.log('[POST] /community/posts', req.body);
  const newPost = {
    _id: 'post' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    bookmarks: 0,
    commentCount: 0
  };
  posts.unshift(newPost);
  res.status(201).json({ success: true, data: newPost });
});

app.post('/emergency/community/posts', (req, res) => {
  console.log('[POST] /emergency/community/posts', req.body);
  const newPost = {
    _id: 'post' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    bookmarks: 0,
    commentCount: 0
  };
  posts.unshift(newPost);
  res.status(201).json({ success: true, data: newPost });
});

// PUT endpoints for liking posts
app.put('/api/community/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  console.log(`[PUT] /api/community/posts/${postId}/like`);
  const post = posts.find(p => p._id === postId);
  if (post) {
    post.likes++;
    res.json({ success: true, data: post });
  } else {
    res.status(404).json({ success: false, error: 'Post not found' });
  }
});

app.put('/community/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  console.log(`[PUT] /community/posts/${postId}/like`);
  const post = posts.find(p => p._id === postId);
  if (post) {
    post.likes++;
    res.json({ success: true, data: post });
  } else {
    res.status(404).json({ success: false, error: 'Post not found' });
  }
});

app.put('/emergency/community/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  console.log(`[PUT] /emergency/community/posts/${postId}/like`);
  const post = posts.find(p => p._id === postId);
  if (post) {
    post.likes++;
    res.json({ success: true, data: post });
  } else {
    res.status(404).json({ success: false, error: 'Post not found' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple Emergency API running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/community/segments');
  console.log('  GET /community/segments');  
  console.log('  GET /emergency/community/segments');
  console.log('  GET /api/community/posts');
  console.log('  GET /community/posts');
  console.log('  GET /emergency/community/posts');
  console.log('  POST /api/community/posts');
  console.log('  POST /community/posts');
  console.log('  POST /emergency/community/posts');
});
