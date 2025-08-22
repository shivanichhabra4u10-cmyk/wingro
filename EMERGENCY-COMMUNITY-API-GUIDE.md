# Emergency Community API Implementation Guide

## Problem Summary
The Community API endpoints have been experiencing persistent 404 errors, including:
- `/api/community/segments`
- `/community/segments`
- `/emergency/community/segments`
- `/api/community/posts`
- `/community/posts`
- `/emergency/community/posts`

## Solution Approach
We created multiple iterations of an emergency API server that provides guaranteed access to community data through fallback endpoints. This server can run independently from the main application server.

## Implementation Steps

### 1. Install Required Packages
```bash
npm install express cors
```

### 2. Create the Emergency API Server
Create a file named `emergency-community-api.js` with the following content:

```javascript
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

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
  },
  {
    _id: "skill-development",
    name: "Skill Development",
    description: "Resources and discussions on acquiring new skills and competencies.",
    icon: "school",
    color: "#81c784",
    postCount: 30
  },
  {
    _id: "work-life-balance",
    name: "Work-Life Balance",
    description: "Strategies for maintaining a healthy balance between professional and personal life.",
    icon: "balance-scale",
    color: "#ffb74d",
    postCount: 22
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
    isAnswered: true,
    answer: "Consider having a direct conversation with your manager about your career aspirations. Create a personal development plan that outlines the skills and experiences you need for the next role. Also, look for opportunities to take on stretching assignments that showcase your abilities beyond your current role.",
    answeredBy: "Maya Rodriguez",
    answererRole: "Career Coach",
    answererCoachId: "coach1"
  },
  {
    _id: "post2",
    segmentId: "career-plateau",
    question: "Should I change companies to advance my career?",
    details: "I'm considering moving to another company to get a promotion and salary increase. Is this a good strategy?",
    author: "Taylor Smith",
    role: "Marketing Specialist",
    isAnonymous: true,
    tags: ["job-change", "promotion", "salary-negotiation"],
    views: 95,
    likes: 12,
    bookmarks: 6,
    commentCount: 5,
    createdAt: "2025-06-05T14:20:00Z",
    isAnswered: false
  },
  {
    _id: "post3",
    segmentId: "career-change",
    question: "How to transition from finance to tech?",
    details: "I have 8 years of experience in financial analysis but want to move into data science. Where should I start?",
    author: "Jordan Lee",
    role: "Financial Analyst",
    isAnonymous: false,
    tags: ["career-transition", "tech", "data-science"],
    views: 150,
    likes: 22,
    bookmarks: 18,
    commentCount: 12,
    createdAt: "2025-06-02T09:15:00Z",
    isAnswered: true,
    answer: "Start by building a foundation in programming (Python is recommended for data science) and statistics. There are many online courses that can help you learn these skills while still working your current job. Create projects that demonstrate your ability to apply data science to financial problems - this creates a natural bridge between your existing expertise and your target field.",
    answeredBy: "Chris Wong",
    answererRole: "Career Coach",
    answererCoachId: "coach3"
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Emergency Community API is running',
    timestamp: new Date().toISOString()
  });
});

// Community health check
app.get('/community-health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Emergency Community API is running',
    routes: {
      communityMounted: true,
      availableEndpoints: [
        '/api/community/segments',
        '/community/segments',
        '/emergency/community/segments',
        '/api/community/posts',
        '/community/posts',
        '/emergency/community/posts'
      ]
    }
  });
});

// Segments endpoints
app.get(['/api/community/segments', '/community/segments', '/emergency/community/segments'], (req, res) => {
  res.json({ 
    success: true, 
    count: segments.length, 
    data: segments 
  });
});

// Posts endpoints
app.get(['/api/community/posts', '/community/posts', '/emergency/community/posts'], (req, res) => {
  let filteredPosts = [...posts];
  
  // Apply filters if present
  if (req.query.segmentId) {
    filteredPosts = filteredPosts.filter(post => post.segmentId === req.query.segmentId);
  }
  
  if (req.query.answered !== undefined) {
    const isAnswered = req.query.answered === 'true';
    filteredPosts = filteredPosts.filter(post => post.isAnswered === isAnswered);
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
  
  // Apply limit
  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    filteredPosts = filteredPosts.slice(0, limit);
  }
  
  res.json({ 
    success: true, 
    count: filteredPosts.length, 
    data: filteredPosts 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`[404] Not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
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
app.listen(PORT, () => {
  console.log(`Emergency Community API running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  /health');
  console.log('  /community-health');
  console.log('  /api/community/segments');
  console.log('  /community/segments');  
  console.log('  /emergency/community/segments');
  console.log('  /api/community/posts');
  console.log('  /community/posts');
  console.log('  /emergency/community/posts');
});
```

### 3. Create a PowerShell Script to Run the Server
Create a file named `start-emergency-community-api.ps1`:

```powershell
Write-Host "Starting Emergency Community API Server..." -ForegroundColor Yellow
Write-Host "This server provides community data for the WinGrox application" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan

# Run the server
node "$PSScriptRoot\emergency-community-api.js"
```

### 4. Create a Testing Script
Create a file named `test-community-endpoints.js`:

```javascript
const axios = require('axios');

async function testEndpoint(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ SUCCESS (${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED (${error.response?.status || 'Unknown'}): ${error.message}`);
    return false;
  }
}

async function runTests() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('TESTING EMERGENCY COMMUNITY API ENDPOINTS\n');
  
  // Test basic health endpoint
  await testEndpoint(`${baseUrl}/health`);
  console.log();
  
  // Test all variations of community endpoints
  const endpoints = [
    '/api/community/segments',
    '/community/segments',
    '/emergency/community/segments',
    '/api/community/posts',
    '/community/posts',
    '/emergency/community/posts'
  ];
  
  for (const endpoint of endpoints) {
    await testEndpoint(`${baseUrl}${endpoint}`);
    console.log();
  }
  
  console.log('Test complete!');
}

runTests();
```

### 5. Update Client-Side API Service
Make sure your client-side API service is configured to try all endpoint variations:

```javascript
// client/src/services/api.ts

// Function to get community segments with fallback paths
export async function getSegments() {
  // Try all possible endpoint patterns
  const endpoints = [
    '/emergency/community/segments',  // Try emergency endpoint first
    '/api/community/segments',        // Then standard API endpoint
    '/community/segments'             // Then direct community endpoint
  ];
  
  let lastError = null;
  
  // Try each endpoint in sequence
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch segments from ${endpoint}:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }
  
  // All endpoints failed
  throw lastError || new Error('Could not fetch segments');
}

// Similar function for posts
export async function getPosts(params = {}) {
  const endpoints = [
    '/emergency/community/posts',
    '/api/community/posts',
    '/community/posts'
  ];
  
  let lastError = null;
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch posts from ${endpoint}:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }
  
  // All endpoints failed
  throw lastError || new Error('Could not fetch posts');
}
```

## Running the Solution

1. Start the emergency API server:
   ```
   powershell -ExecutionPolicy Bypass -File start-emergency-community-api.ps1
   ```

2. Test the endpoints:
   ```
   node test-community-endpoints.js
   ```

3. Start the main application as usual:
   ```
   npm start
   ```

The client application should now be able to fetch community data from the emergency endpoints, providing a guaranteed fallback even if the main API is experiencing 404 errors.

## Troubleshooting

If you continue to experience issues, check the following:

1. Ensure the emergency API server is running on the expected port (3001).
2. Verify that all endpoints mentioned in this guide are correctly implemented.
3. Check the client-side API service is configured to try all endpoint variants.
4. Consider checking network connections and CORS settings if cross-origin issues appear.

## Next Steps

- Consider integrating the emergency endpoints directly into the main application server.
- Add persistent storage (like MongoDB) to the emergency API instead of using hardcoded data.
- Implement proper error logging and monitoring to detect and alert on endpoint failures.
