const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Added better request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const PORT = 3001;

// Sample data
const communitySegments = [
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

const communityPosts = [
  {
    _id: 'post1',
    segmentId: 'career-plateau',
    question: 'How do I overcome feeling stuck in my current role?',
    details: 'I\'ve been in the same position for 3 years with no promotion in sight. What strategies can help me progress?',
    author: 'Alex Johnson',
    role: 'Software Developer',
    isAnonymous: false,
    tags: ['promotion', 'growth', 'career-development'],
    views: 120,
    likes: 15,
    bookmarks: 8,
    commentCount: 7,
    createdAt: '2025-06-01T10:30:00Z',
    isAnswered: true,
    answer: 'Consider having a direct conversation with your manager about your career aspirations. Create a personal development plan that outlines the skills and experiences you need for the next role. Also, look for opportunities to take on stretching assignments that showcase your abilities beyond your current role.',
    answeredBy: 'Maya Rodriguez',
    answererRole: 'Career Coach',
    answererCoachId: 'coach1'
  },
  {
    _id: 'post2',
    segmentId: 'career-plateau',
    question: 'Should I change companies to advance my career?',
    details: 'I\'m considering moving to another company to get a promotion and salary increase. Is this a good strategy?',
    author: 'Taylor Smith',
    role: 'Marketing Specialist',
    isAnonymous: true,
    tags: ['job-change', 'promotion', 'salary-negotiation'],
    views: 95,
    likes: 12,
    bookmarks: 6,
    commentCount: 5,
    createdAt: '2025-06-05T14:20:00Z',
    isAnswered: false
  },
  {
    _id: 'post3',
    segmentId: 'career-change',
    question: 'How to transition from finance to tech?',
    details: 'I have 8 years of experience in financial analysis but want to move into data science. Where should I start?',
    author: 'Jordan Lee',
    role: 'Financial Analyst',
    isAnonymous: false,
    tags: ['career-transition', 'tech', 'data-science'],
    views: 150,
    likes: 22,
    bookmarks: 18,
    commentCount: 12,
    createdAt: '2025-06-02T09:15:00Z',
    isAnswered: true,
    answer: 'Start by building a foundation in programming (Python is recommended for data science) and statistics. There are many online courses that can help you learn these skills while still working your current job. Create projects that demonstrate your ability to apply data science to financial problems - this creates a natural bridge between your existing expertise and your target field.',
    answeredBy: 'Chris Wong',
    answererRole: 'Career Coach',
    answererCoachId: 'coach3'
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Emergency Community API is running',
    timestamp: new Date().toISOString()
  });
});

// Community health check
app.get('/community-health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Emergency Community API is running',
    routes: {
      communityMounted: true,
      availableEndpoints: [
        '/api/community/segments',
        '/community/segments',
        '/api/community/posts',
        '/community/posts',
        '/emergency/community/segments',
        '/emergency/community/posts'
      ]
    }
  });
});

// --- Community Segments Endpoints ---
// GET all segments
// Define each endpoint separately for better logging
app.get('/api/community/segments', (req, res) => {
  console.log('[GET] /api/community/segments request received');
  return res.status(200).json({
    success: true,
    count: communitySegments.length,
    data: communitySegments
  });
});

app.get('/community/segments', (req, res) => {
  console.log('[GET] /community/segments request received');
  return res.status(200).json({
    success: true,
    count: communitySegments.length,
    data: communitySegments
  });
});

app.get('/emergency/community/segments', (req, res) => {
  console.log('[GET] /emergency/community/segments request received');
  return res.status(200).json({
    success: true,
    count: communitySegments.length,
    data: communitySegments
  });
});

// --- Community Posts Endpoints ---
app.get('/api/community/posts', (req, res) => {
  console.log('[GET] /api/community/posts request received', req.query);
  
  let filteredPosts = [...communityPosts];
  
  // Apply filters
  if (req.query.segmentId) {
    filteredPosts = filteredPosts.filter(post => post.segmentId === req.query.segmentId);
  }
  
  // Apply sorting
  if (req.query.sort) {
    if (req.query.sort === 'most-viewed') {
      filteredPosts.sort((a, b) => b.views - a.views);
    } else if (req.query.sort === 'most-liked') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else {
      // Default sort by newest
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
  
  return res.status(200).json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

app.get('/community/posts', (req, res) => {
  console.log('[GET] /community/posts request received', req.query);
  
  let filteredPosts = [...communityPosts];
  
  // Apply filters
  if (req.query.segmentId) {
    filteredPosts = filteredPosts.filter(post => post.segmentId === req.query.segmentId);
  }
  
  // Apply sorting
  if (req.query.sort) {
    if (req.query.sort === 'most-viewed') {
      filteredPosts.sort((a, b) => b.views - a.views);
    } else if (req.query.sort === 'most-liked') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else {
      // Default sort by newest
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
  
  return res.status(200).json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

app.get('/emergency/community/posts', (req, res) => {
  console.log('[GET] /emergency/community/posts request received', req.query);
  
  let filteredPosts = [...communityPosts];
  
  // Apply filters
  if (req.query.segmentId) {
    filteredPosts = filteredPosts.filter(post => post.segmentId === req.query.segmentId);
  }
  
  // Apply sorting
  if (req.query.sort) {
    if (req.query.sort === 'most-viewed') {
      filteredPosts.sort((a, b) => b.views - a.views);
    } else if (req.query.sort === 'most-liked') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else {
      // Default sort by newest
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
  
  return res.status(200).json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.baseUrl}`);
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    requestedPath: req.baseUrl,
    method: req.method,
    availableRoutes: [
      '/health',
      '/community-health',
      '/api/community/segments',
      '/community/segments',
      '/emergency/community/segments',
      '/api/community/posts',
      '/community/posts',
      '/emergency/community/posts'
    ]
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Emergency Community API Server running on http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`  GET  /api/community/segments`);
  console.log(`  GET  /community/segments`);
  console.log(`  GET  /emergency/community/segments`);
  console.log(`  GET  /api/community/posts`);
  console.log(`  GET  /community/posts`);
  console.log(`  GET  /emergency/community/posts`);
  console.log(`  GET  /health`);
  console.log(`  GET  /community-health`);
});
