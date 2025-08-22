const axios = require('axios');

async function checkAllPaths() {
  console.log('Testing all community API paths...\n');
  
  async function testEndpoint(url) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.get(url);
      console.log(`✓ Success (${response.status}): ${url}`);
      console.log(`  Data: ${JSON.stringify(response.data).substring(0, 100)}...\n`);
      return true;
    } catch (error) {
      console.error(`✗ Failed (${error.response?.status || 'unknown'}): ${url}`);
      console.error(`  Error: ${error.message}\n`);
      return false;
    }
  }
  
  // Test health endpoint
  await testEndpoint('http://localhost:3001/health');
  await testEndpoint('http://localhost:3001/community-health');
  
  console.log('Testing standard paths:');
  // Test both path formats for segments
  await testEndpoint('http://localhost:3001/api/community/segments');
  await testEndpoint('http://localhost:3001/community/segments');
  
  // Test both path formats for posts
  await testEndpoint('http://localhost:3001/api/community/posts');
  await testEndpoint('http://localhost:3001/community/posts');
  
  console.log('Testing emergency paths:');
  // Test emergency paths
  await testEndpoint('http://localhost:3001/emergency/community/segments');
  await testEndpoint('http://localhost:3001/emergency/community/posts');
}

checkAllPaths();
