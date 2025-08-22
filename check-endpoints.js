const axios = require('axios');

// Function to check if an endpoint is reachable
async function checkEndpoint(url) {
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ Endpoint ${url} is working - Status: ${response.status}`);
    console.log(`   Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
    return true;
  } catch (error) {
    console.error(`❌ Endpoint ${url} failed - ${error.message}`);
    return false;
  }
}

// Main function to check all endpoints
async function checkAllEndpoints() {
  const baseUrl = 'http://localhost:3001';
  
  // Check health endpoint
  await checkEndpoint(`${baseUrl}/health`);
  
  // Check community endpoints with and without /api/ prefix
  console.log('\n--- Community Segments Endpoints ---');
  await checkEndpoint(`${baseUrl}/community/segments`);
  await checkEndpoint(`${baseUrl}/api/community/segments`);
  
  console.log('\n--- Community Posts Endpoints ---');
  await checkEndpoint(`${baseUrl}/community/posts`);
  await checkEndpoint(`${baseUrl}/api/community/posts`);
  await checkEndpoint(`${baseUrl}/community/posts?segmentId=career-plateau&sort=most-viewed`);
  await checkEndpoint(`${baseUrl}/api/community/posts?segmentId=career-plateau&sort=most-viewed`);
  
  console.log('\n--- Community Comments Endpoints ---');
  // We need a valid post ID for this test, but we'll try with a dummy one
  await checkEndpoint(`${baseUrl}/community/posts/dummy-id/comments`);
  await checkEndpoint(`${baseUrl}/api/community/posts/dummy-id/comments`);
}

checkAllEndpoints();
