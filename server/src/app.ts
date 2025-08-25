// First load environment variables before importing other modules
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
const envPath = path.resolve(__dirname, '../.env');
const envExists = fs.existsSync(envPath);
dotenv.config({ path: envPath });
//dotenv.config({ path: path.resolve(__dirname, '../.env') });
//dotenv.config();

import express from 'express';
import * as cors from 'cors';
import { config } from './config';
import { databaseService } from './services/database.service';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
// Initialize Application Insights in production
if (process.env.NODE_ENV === 'production') {
  const appInsights = require('applicationinsights');
  appInsights.setup(config.azure.appInsightsKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .start();
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize database
let db: any;

// Routes - Set up all routes BEFORE starting the server
app.use('/api', routes);
// Add direct /auth route for compatibility (so /auth/login works)
// import authRoutes from './routes/auth.routes';
// app.use('/auth', authRoutes);

// PERMANENT FIX: Support multiple community API paths for backward compatibility
import communityRoutes from './routes/community.routes';
// Direct path without /api prefix
app.use('/community', communityRoutes);
// Support legacy emergency path
app.use('/emergency/community', communityRoutes);
// Double-ensure the /api/community path works (although already covered by routes index)
app.use('/api/community', communityRoutes);

// Add a health check for community routes
app.get('/community-health', (req, res) => {
  console.log('Community routes health check accessed');
  res.status(200).json({ 
    status: 'ok', 
    message: 'Community routes are loaded',
    routes: {
      communityMounted: true,
      communityRoutesCount: Object.keys(communityRoutes.stack).length
    }
  });
});

// EMERGENCY FIX: Direct community data endpoints with hardcoded mock data
// Not importing models since they might not exist

// GET all segments with hardcoded mock data
app.get('/emergency/community/segments', async (req, res) => {
  try {
    console.log('EMERGENCY route: /emergency/community/segments called');
    
    // Hardcoded mock data for emergency use
    const mockSegments = [
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
    
    return res.status(200).json({
      success: true,
      count: mockSegments.length,
      data: mockSegments
    });
  } catch (error) {
    console.error('Error in emergency segments endpoint:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET all posts with hardcoded mock data
app.get('/emergency/community/posts', async (req, res) => {
  try {
    console.log('EMERGENCY route: /emergency/community/posts called');
    const { segmentId, answered, sort = 'createdAt', limit = 50 } = req.query;
    
    // Hardcoded mock data for emergency use
    const mockPosts = [
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
        answer: 'Consider having a direct conversation with your manager about your career aspirations.',
        answeredBy: 'Maya Rodriguez',
        answererRole: 'Career Coach',
        answererCoachId: 'coach1'
      },
      {
        _id: 'post2',
        segmentId: 'career-plateau',
        question: 'Should I change companies to advance my career?',
        details: 'I\'m considering moving to another company to get a promotion and salary increase.',
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
        answer: 'Start by building a foundation in programming (Python is recommended for data science) and statistics.',
        answeredBy: 'Chris Wong',
        answererRole: 'Career Coach',
        answererCoachId: 'coach3'
      }
    ];
    
    // Filter posts
    let filteredPosts = [...mockPosts];
    
    if (segmentId) {
      filteredPosts = filteredPosts.filter(post => post.segmentId === segmentId);
    }
    
    if (answered !== undefined) {
      const isAnswered = answered === 'true';
      filteredPosts = filteredPosts.filter(post => post.isAnswered === isAnswered);
    }
    
    // Sort posts
    if (sort === 'most-viewed') {
      filteredPosts.sort((a, b) => b.views - a.views);
    } else if (sort === 'most-liked') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else {
      // Default sort by newest
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit.toString()) || 50;
      filteredPosts = filteredPosts.slice(0, limitNum);
    }
    
    return res.status(200).json({
      success: true,
      count: filteredPosts.length,
      data: filteredPosts
    });
  } catch (error) {
    console.error('Error in emergency posts endpoint:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});


// Debug route to help troubleshoot (shows all registered routes)
app.get('/debug/routes', (req, res) => {
  const routes: any[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({
            path: '/api' + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// Start the server with port fallback mechanism
// This ensures the server starts even if the default port is in use
const startServer = (retryCount = 0) => {
  const MAX_RETRIES = 3;
  const BASE_PORT = parseInt(process.env.PORT || '3001');
  const PORT = retryCount > 0 ? BASE_PORT + retryCount : BASE_PORT;
  
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Root URL: http://localhost:${PORT}/`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API routes: http://localhost:${PORT}/api/*`);
      
      // Initialize MongoDB connection after server is started
      (async () => {
        try {
          db = await databaseService.init();
          console.log('MongoDB Connected - API is fully operational');
        } catch (err) {
          console.error('Failed to connect to MongoDB:', err);
          console.log('Server running in limited mode - database features unavailable');
        }
      })();
    });
    
    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use`);
        if (retryCount < MAX_RETRIES) {
          console.log(`Trying port ${BASE_PORT + retryCount + 1}...`);
          server.close();
          startServer(retryCount + 1);
        } else {
          console.error('Maximum retry attempts reached. Please free up a port manually.');
          process.exit(1);
        }
      } else {
        console.error('Server error:', e);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

// Start the server with retry mechanism
startServer();

// Root route handler - MUST be defined before error handlers
// This is the main route that users will see when accessing the root URL
app.get('/', (_, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Root path accessed`);
  
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WinGroX API Server</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                color: #333;
                line-height: 1.6;
            }
            h1 {
                color: #0066cc;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            .status {
                background-color: #e6f7e6;
                border-left: 4px solid #28a745;
                padding: 10px 15px;
                margin: 20px 0;
            }
            .endpoints {
                background-color: #f9f9f9;
                border-left: 4px solid #0066cc;
                padding: 15px;
                margin: 20px 0;
            }
            .endpoint-url {
                font-family: monospace;
                background: #eee;
                padding: 3px 6px;
                border-radius: 3px;
            }
            .timestamp {
                color: #666;
                font-size: 0.9em;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <h1>WinGroX API Server</h1>
        
        <div class="status">
            <strong>Status:</strong> Server is running successfully
        </div>
        
        <p>This is the API server for the WinGroX application. If you're seeing this page, the server is properly configured and responding to requests.</p>
        
        <div class="endpoints">
            <h2>Available Endpoints</h2>
            <p><span class="endpoint-url">/api/auth</span> - Authentication endpoints</p>
            <p><span class="endpoint-url">/api/contact</span> - Contact form endpoints</p>
            <p><span class="endpoint-url">/health</span> - Server health check</p>
            <p><span class="endpoint-url">/debug/routes</span> - List all available routes</p>
        </div>

        <p>For API documentation, please refer to the project documentation.</p>
        
        <p class="timestamp">Page generated: ${timestamp}</p>
    </body>
    </html>
  `);
});

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  const dbStatus = databaseService.isConnected() ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok',
    database: dbStatus,
    mongodb: {
      uri: config.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials
      connected: dbStatus === 'connected'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export { app, db };