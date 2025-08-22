// Minimal Community API - Error-free version
// This script provides the most basic implementation for the community API endpoints

// Import only the essentials
const express = require('express');

// Create Express app
const app = express();
const PORT = 3001;

// Simplified middleware setup
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

// Root endpoint for basic testing
app.get('/', (req, res) => {
  res.send('Community API is running');
});

// Segments endpoint - standard path
app.get('/api/community/segments', (req, res) => {
  console.log('Serving community segments');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

// Segments endpoint - emergency path
app.get('/emergency/community/segments', (req, res) => {
  console.log('Serving emergency community segments');
  res.json({ 
    success: true, 
    count: communitySegments.length, 
    data: communitySegments 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Community API running on port ${PORT}`);
  console.log(`Access segments at: http://localhost:${PORT}/api/community/segments`);
  console.log(`Access emergency segments at: http://localhost:${PORT}/emergency/community/segments`);
});
