// CORS-fixed simple community API server

const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 3001;

// CORS configuration with specific allowed origins
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'], // Add your frontend URLs here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Use the configured CORS for all routes
app.use(cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.headers.origin || 'unknown origin'}`);
  next();
});

// Add pre-flight OPTIONS handling for all routes
app.options('*', cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

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
    createdAt: '2025-06-01T10:30:00Z',
    isAnswered: true,
    answer: 'Consider having a direct conversation with your manager about your career aspirations. Create a personal development plan that outlines the skills and experiences you need for the next role.',
    answeredBy: 'Maya Rodriguez',
    answererRole: 'Career Coach' 
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
    isAnswered: true
  }
];

// Root endpoint for easy debugging
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Community API with CORS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          h2 { color: #0066cc; margin-top: 30px; }
          .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .endpoint a { color: #0066cc; text-decoration: none; }
          .endpoint a:hover { text-decoration: underline; }
          .note { background: #fffde7; border-left: 4px solid #ffeb3b; padding: 10px; margin: 20px 0; }
          code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Community API with CORS Support</h1>
        <div class="note">
          <strong>CORS Configuration:</strong> This API allows requests from <code>http://localhost:3000</code>, <code>http://127.0.0.1:3000</code>, and <code>http://localhost:5173</code>.
        </div>
        
        <p>API is running successfully on port ${PORT}! Available endpoints:</p>
        
        <h2>Health Check</h2>
        <div class="endpoint">
          <a href="/health" target="_blank">/health</a> - Check API status
        </div>
        
        <h2>Community Segments</h2>
        <div class="endpoint">
          <a href="/api/community/segments" target="_blank">/api/community/segments</a> - Get all segments
        </div>
        <div class="endpoint">
          <a href="/community/segments" target="_blank">/community/segments</a> - Alternative URL
        </div>
        <div class="endpoint">
          <a href="/emergency/community/segments" target="_blank">/emergency/community/segments</a> - Emergency URL
        </div>
        
        <h2>Community Posts</h2>
        <div class="endpoint">
          <a href="/api/community/posts" target="_blank">/api/community/posts</a> - Get all posts
        </div>
        <div class="endpoint">
          <a href="/api/community/posts?segmentId=career-plateau" target="_blank">/api/community/posts?segmentId=career-plateau</a> - Filter by segment
        </div>
        <div class="endpoint">
          <a href="/emergency/community/posts" target="_blank">/emergency/community/posts</a> - Emergency URL
        </div>
        
        <div class="note">
          <strong>Note:</strong> Server started at ${new Date().toLocaleString()}.
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  // Explicitly add CORS headers here as well for redundancy
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  res.json({ 
    status: 'ok', 
    message: 'CORS-fixed Community API is running',
    timestamp: new Date().toISOString(),
    corsConfigured: true
  });
});

// Helper function to ensure CORS headers
const ensureCorsHeaders = (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
};

// Segments endpoints - define each route separately with CORS headers
app.get('/api/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (api/community/segments)');
  ensureCorsHeaders(req, res);
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

app.get('/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (community/segments)');
  ensureCorsHeaders(req, res);
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

app.get('/emergency/community/segments', (req, res) => {
  console.log('[ENDPOINT] Serving community segments (emergency/community/segments)');
  ensureCorsHeaders(req, res);
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

// Posts endpoints with CORS headers
app.get('/api/community/posts', (req, res) => {
  console.log('[ENDPOINT] Serving community posts (api/community/posts)');
  ensureCorsHeaders(req, res);
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
  ensureCorsHeaders(req, res);
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
  ensureCorsHeaders(req, res);
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

// Handle 404 errors with CORS headers
app.use('*', (req, res) => {
  console.log(`[404] Not found: ${req.originalUrl}`);
  ensureCorsHeaders(req, res);
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
      '/emergency/community/posts'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n=======================================================');
  console.log(`🚀 CORS-ENABLED COMMUNITY API RUNNING ON PORT ${PORT}`);
  console.log('=======================================================\n');
  console.log('📝 CORS is configured to allow requests from:');
  console.log('   - http://localhost:3000');
  console.log('   - http://127.0.0.1:3000'); 
  console.log('   - http://localhost:5173');
  console.log('\n📋 Available endpoints:');
  console.log('   - Community segments: http://localhost:3001/api/community/segments');
  console.log('   - Community posts: http://localhost:3001/api/community/posts');
  console.log('   - Health check: http://localhost:3001/health');
  console.log('\n🔍 API homepage: http://localhost:3001/');
  console.log('=======================================================');
});
