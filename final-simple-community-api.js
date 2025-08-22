// Final simple community API fix script - LATEST VERSION

const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 3001;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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
    createdAt: '2025-06-01T10:30:00Z'
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
    createdAt: '2025-06-05T14:20:00Z'
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
    createdAt: '2025-06-02T09:15:00Z'
  }
];

// Root endpoint for basic testing
app.get('/', (req, res) => {
  res.send(`
    <h1>Simple Community API</h1>
    <p>API is running successfully! Available endpoints:</p>
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/api/community/segments">/api/community/segments</a></li>
      <li><a href="/community/segments">/community/segments</a></li>
      <li><a href="/emergency/community/segments">/emergency/community/segments</a></li>
      <li><a href="/api/community/posts">/api/community/posts</a></li>
      <li><a href="/emergency/community/posts">/emergency/community/posts</a></li>
    </ul>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Final Simple Community API is running',
    timestamp: new Date().toISOString()
  });
});

// Segments endpoints - define routes individually to avoid path-to-regexp issues
app.get('/api/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (api/community/segments)');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

app.get('/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (community/segments)');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

app.get('/emergency/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (emergency/community/segments)');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

// Posts endpoints - define routes individually
app.get('/api/community/posts', (req, res) => {
  console.log('[ENDPOINT] Serving community posts (api/community/posts)');
  const { segmentId } = req.query;
  
  let filteredPosts = [...communityPosts];
  
  // Filter by segment if provided
  if (segmentId) {
    console.log(`Filtering by segment: ${segmentId}`);
    filteredPosts = filteredPosts.filter(post => post.segmentId === segmentId);
  }
  
  res.json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

app.get('/community/posts', (req, res) => {
  console.log('[ENDPOINT] Serving community posts (community/posts)');
  const { segmentId } = req.query;
  
  let filteredPosts = [...communityPosts];
  
  // Filter by segment if provided
  if (segmentId) {
    console.log(`Filtering by segment: ${segmentId}`);
    filteredPosts = filteredPosts.filter(post => post.segmentId === segmentId);
  }
  
  res.json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

app.get('/emergency/community/posts', (req, res) => {
  console.log('[ENDPOINT] Serving community posts (emergency/community/posts)');
  const { segmentId } = req.query;
  
  let filteredPosts = [...communityPosts];
  
  // Filter by segment if provided
  if (segmentId) {
    console.log(`Filtering by segment: ${segmentId}`);
    filteredPosts = filteredPosts.filter(post => post.segmentId === segmentId);
  }
  
  res.json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚠️ FINAL SIMPLE COMMUNITY API RUNNING ON PORT ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Community segments: http://localhost:${PORT}/api/community/segments`);
  console.log(`Community posts: http://localhost:${PORT}/api/community/posts`);
});
