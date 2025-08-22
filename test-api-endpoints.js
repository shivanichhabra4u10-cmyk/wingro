// Script to test if the community API is working with all needed endpoints
const axios = require('axios');

// Base URL for the API
const baseUrl = 'http://localhost:3001';

// Endpoints to test
const endpoints = [
  '/health',
  '/api/community/segments',
  '/emergency/community/segments',
  '/community/segments',
  '/api/community/posts',
  '/emergency/community/posts',
  '/community/posts',
  '/api/community/posts?segmentId=career-plateau',
  '/api/community/posts?sort=most-viewed'
];

async function testEndpoints() {
  console.log('===== COMMUNITY API ENDPOINT TEST =====\n');
  
  let success = true;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${baseUrl}${endpoint}`);
      
      console.log(`  ✅ SUCCESS: ${response.status}`);
      if (endpoint === '/api/community/segments' || endpoint === '/emergency/community/segments') {
        console.log(`  Found ${response.data.data.length} segments`);
      } else if (endpoint.includes('/posts')) {
        console.log(`  Found ${response.data.data.length} posts`);
      }
    } catch (error) {
      success = false;
      console.log(`  ❌ ERROR - ${error.message}`);
      if (error.response) {
        console.log(`  Status: ${error.response.status}`);
        console.log(`  Response: ${JSON.stringify(error.response.data, null, 2).substring(0, 100)}...`);
      }
    }
    console.log();
  }
  
  // Test post creation
  try {
    console.log('Testing POST to /api/community/posts...');
    const testPost = {
      author: 'Test User',
      role: 'Developer',
      question: `Test question created at ${new Date().toISOString()}`,
      segmentId: 'career-plateau',
      isAnonymous: false,
      isAnswered: false,
      isActive: true
    };
    
    const response = await axios.post(`${baseUrl}/api/community/posts`, testPost);
    console.log(`  ✅ SUCCESS: ${response.status}`);
    console.log(`  Created post with ID: ${response.data.data._id}`);
  } catch (error) {
    success = false;
    console.log(`  ❌ ERROR - ${error.message}`);
    if (error.response) {
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  console.log('\n===== TEST SUMMARY =====');
  if (success) {
    console.log('✅ All endpoints are working correctly!');
  } else {
    console.log('❌ Some endpoints failed. See above for details.');
  }
}

// Run the tests
testEndpoints();
