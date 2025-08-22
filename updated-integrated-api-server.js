// UPDATED Integrated API Server with Community Posts Fix
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3005; // Using one port for all APIs

// Enable CORS for all requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

//=============================================================================
// COACH APPLICATIONS ENDPOINT
//=============================================================================

// Sample coach applications data
const coachApplications = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    specialization: 'Career Growth',
    experience: '8 years',
    status: 'Pending',
    appliedDate: '2025-07-10'
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    specialization: 'Leadership',
    experience: '12 years',
    status: 'Approved',
    appliedDate: '2025-07-08'
  }
];

// GET /api/applications/coach - return all coach applications
app.get(['/api/applications/coach', '/applications/coach'], (req, res) => {
  res.json({
    success: true,
    count: coachApplications.length,
    data: coachApplications
  });
});
// PRODUCTS API
//=============================================================================

// Sample products data
const products = [
  {
    id: 1,
    name: 'Career Assessment',
    description: 'Comprehensive career path analysis and recommendations',
    price: 149.99,
    features: ['Personality assessment', 'Skills analysis', 'Career recommendations', 'One coaching session'],
    image: '/assets/products/career-assessment.jpg',
    category: 'assessment'
  },
  {
    id: 2,
    name: 'Resume Review',
    description: 'Expert review and optimization of your professional resume',
    price: 79.99,
    features: ['ATS optimization', 'Content review', 'Format enhancement', 'Keyword optimization'],
    image: '/assets/products/resume-review.jpg',
    category: 'document'
  },
  {
    id: 3,
    name: 'Interview Preparation',
    description: 'Mock interviews and personalized feedback',
    price: 129.99,
    features: ['Industry-specific questions', 'Two mock interviews', 'Detailed feedback', 'Follow-up strategy'],
    image: '/assets/products/interview-prep.jpg',
    category: 'coaching'
  },
  {
    id: 4,
    name: 'Career Transition Package',
    description: 'Complete support package for changing career paths',
    price: 299.99,
    features: ['Skills transferability analysis', 'Target industry insights', 'Transition strategy', 'Four coaching sessions'],
    image: '/assets/products/career-transition.jpg',
    category: 'package'
  },
  {
    id: 5,
    name: 'Leadership Development',
    description: 'Personalized leadership skills assessment and development plan',
    price: 199.99,
    features: ['Leadership style assessment', 'Strengths & weaknesses analysis', 'Development roadmap', 'Two coaching sessions'],
    image: '/assets/products/leadership.jpg',
    category: 'coaching'
  }
];

// Products API endpoints - supporting ALL common path patterns for compatibility
app.get([
  '/api/v1/products', 
  '/v1/products', 
  '/api/products', 
  '/products'
], (req, res) => {
  console.log('[PRODUCTS API] Serving products list');
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// Product by ID endpoint - supporting ALL common path patterns for compatibility
app.get([
  '/api/v1/products/:id', 
  '/v1/products/:id',
  '/api/products/:id',
  '/products/:id'
], (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ 
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

//=============================================================================
// COMMUNITY API
//=============================================================================

// Sample community data
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
    createdAt: '2023-06-01T10:30:00Z',
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
    createdAt: '2023-06-05T14:20:00Z',
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
    createdAt: '2023-06-02T09:15:00Z',
    isAnswered: true,
    answer: 'Start by building a foundation in programming (Python is recommended for data science) and statistics. There are many online courses that can help you learn these skills while still working your current job. Create projects that demonstrate your ability to apply data science to financial problems - this creates a natural bridge between your existing expertise and your target field.',
    answeredBy: 'Chris Wong',
    answererRole: 'Career Coach',
    answererCoachId: 'coach3'
  },
  {
    _id: 'post4',
    segmentId: 'skill-development',
    question: 'What skills will be most valuable in the next 5 years?',
    details: 'With AI and automation changing the job market, what skills should I focus on developing to stay competitive?',
    author: 'Robin Chen',
    role: 'Product Manager',
    isAnonymous: false,
    tags: ['future-skills', 'AI', 'career-planning'],
    views: 210,
    likes: 35,
    bookmarks: 27,
    commentCount: 18,
    createdAt: '2023-06-03T16:45:00Z',
    isAnswered: true,
    answer: 'Focus on developing a combination of technical and human skills. Technical skills like data literacy, basic coding, and AI prompt engineering will be valuable across industries. However, uniquely human skills will be equally important: critical thinking, creative problem-solving, emotional intelligence, and adaptability. The ability to collaborate effectively with both humans and AI tools will be particularly valuable.',
    answeredBy: 'Sam Washington',
    answererRole: 'Career Coach',
    answererCoachId: 'coach2'
  },
  {
    _id: 'post5',
    segmentId: 'work-life-balance',
    question: 'How to establish boundaries when working remotely?',
    details: 'Since transitioning to remote work, I find myself working longer hours and being available 24/7. How can I create better boundaries?',
    author: 'Morgan Taylor',
    role: 'Project Coordinator',
    isAnonymous: false,
    tags: ['remote-work', 'boundaries', 'wellbeing'],
    views: 175,
    likes: 28,
    bookmarks: 22,
    commentCount: 14,
    createdAt: '2023-06-04T11:20:00Z',
    isAnswered: true,
    answer: 'Start by creating a dedicated workspace and establishing clear working hours. Communicate these hours to your team and manager. Use status indicators in communication tools to signal your availability. Create transition rituals that help you "leave work" at the end of the day, such as shutting down your computer and taking a walk. Finally, turn off notifications on your devices outside of working hours.',
    answeredBy: 'Lee Martinez',
    answererRole: 'Career Coach',
    answererCoachId: 'coach4'
  }
];

// Segments endpoints - ALL paths for compatibility
app.get([
  '/api/community/segments', 
  '/community/segments', 
  '/emergency/community/segments'
], (req, res) => {
  console.log('[COMMUNITY API] Serving community segments');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

// Posts endpoints with filtering - ALL paths for compatibility
app.get([
  '/api/community/posts', 
  '/community/posts', 
  '/emergency/community/posts'
], (req, res) => {
  console.log('[COMMUNITY API] Serving community posts', req.query);
  
  const { segmentId, sort, limit = 10, page = 1, search = '' } = req.query;
  
  let filteredPosts = [...communityPosts];
  
  // Filter by segment if provided
  if (segmentId) {
    console.log(`Filtering by segment: ${segmentId}`);
    filteredPosts = filteredPosts.filter(post => post.segmentId === segmentId);
  }
  
  // Apply search if provided
  if (search && search.trim() !== '') {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.question.toLowerCase().includes(searchLower) || 
      post.details.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (sort) {
    console.log(`Sorting by: ${sort}`);
    if (sort === 'most-viewed') {
      filteredPosts.sort((a, b) => b.views - a.views);
    } else if (sort === 'most-liked') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'most-commented') {
      filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else if (sort === 'oldest') {
      filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default to newest
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } else {
    // Default sorting is newest first
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  // Calculate pagination
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = pageInt * limitInt;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  // Return paginated results
  res.json({
    success: true,
    count: paginatedPosts.length,
    total: filteredPosts.length,
    page: pageInt,
    totalPages: Math.ceil(filteredPosts.length / limitInt),
    hasMore: endIndex < filteredPosts.length,
    data: paginatedPosts
  });
});

// Single post endpoint - ALL paths for compatibility
app.get([
  '/api/community/posts/:id', 
  '/community/posts/:id', 
  '/emergency/community/posts/:id'
], (req, res) => {
  const postId = req.params.id;
  const post = communityPosts.find(p => p._id === postId);
  
  if (!post) {
    return res.status(404).json({ 
      success: false, 
      error: 'Post not found' 
    });
  }
  
  res.json({
    success: true,
    data: post
  });
});

//=============================================================================
// MONGODB/DATABASE STATUS API
//=============================================================================

// Database status endpoint
app.get(['/api/db/status', '/db/status'], (req, res) => {
  // We're simulating a healthy database connection
  res.json({
    status: 'connected',
    message: 'Database connection is healthy',
    uptime: Math.floor(Math.random() * 100000), // Simulated uptime in seconds
    collections: ['products', 'users', 'community', 'segments', 'posts'],
    timestamp: new Date().toISOString()
  });
});

//=============================================================================
// HEALTH CHECK & ADMIN ENDPOINTS
//=============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Integrated API server is running',
    components: {
      products: 'operational',
      community: 'operational',
      database: 'operational',
      admin: 'operational'
    },
    timestamp: new Date().toISOString()
  });
});

// Admin health endpoint
app.get('/admin/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Admin API is operational',
    timestamp: new Date().toISOString()
  });
});

// Admin endpoints
app.get('/admin/products', (req, res) => {
  console.log('[ADMIN API] Serving admin products list');
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// 404 handler - MUST BE LAST ROUTE
app.use('*', (req, res) => {
  console.log(`[404] Not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    message: 'The requested API endpoint was not found. Check the URL and try again.',
    availableEndpoints: {
      products: [
        '/api/v1/products', 
        '/v1/products', 
        '/api/products', 
        '/products'
      ],
      community: [
        '/api/community/segments', 
        '/community/segments', 
        '/emergency/community/segments',
        '/api/community/posts',
        '/community/posts',
        '/emergency/community/posts'
      ],
      admin: [
        '/admin/products',
        '/admin/health'
      ],
      health: [
        '/health',
        '/api/db/status'
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n=====================================================`);
  console.log(`🚀 INTEGRATED API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`=====================================================`);

  console.log(`\n📊 API ENDPOINTS:`);
  console.log(`--------------------`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`\n🛒 PRODUCTS:`);
  console.log(`Products List: http://localhost:${PORT}/api/v1/products`);
  console.log(`Single Product: http://localhost:${PORT}/api/v1/products/1`);
  console.log(`\n👥 COMMUNITY:`);
  console.log(`Community Segments: http://localhost:${PORT}/emergency/community/segments`);
  console.log(`Community Posts: http://localhost:${PORT}/emergency/community/posts`);
  console.log(`\n⚙️ ADMIN:`);
  console.log(`Admin Products: http://localhost:${PORT}/admin/products`);
  console.log(`Admin Health: http://localhost:${PORT}/admin/health`);
  console.log(`\n🔍 DATABASE:`);
  console.log(`Database Status: http://localhost:${PORT}/api/db/status`);
  console.log(`\n=====================================================`);
});
