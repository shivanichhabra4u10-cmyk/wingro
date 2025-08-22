const axios = require('axios');

async function testEndpoint(url) {
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ Success! Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed! ${error.message}`);
    return false;
  }
}

async function runTests() {
  const baseUrl = 'http://localhost:3001';
  
  // Test health endpoint first
  await testEndpoint(`${baseUrl}/health`);
  console.log('\n');
  
  // Test each community endpoint
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
    console.log('\n');
  }
}

runTests();
