const axios = require('axios');

async function testEndpoint(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ SUCCESS (${response.status})`);
    console.log(`   Data count: ${response.data.count || 'N/A'}`);
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
