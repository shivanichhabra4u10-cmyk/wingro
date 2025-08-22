const axios = require('axios');

async function checkEndpoint(url) {
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ Endpoint ${url} is working - Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`❌ Endpoint ${url} failed - ${error.message}`);
    return false;
  }
}

async function checkAllApiEndpoints() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('\n=== CHECKING API ENDPOINTS ===\n');
  
  // Health endpoint
  await checkEndpoint(`${baseUrl}/health`);
  
  // Community segments endpoint with /api/ prefix (should work)
  console.log('\n--- Community API Endpoints ---');
  await checkEndpoint(`${baseUrl}/api/community/segments`);
  await checkEndpoint(`${baseUrl}/api/community/posts`);
  
  // Products endpoint
  console.log('\n--- Products API Endpoints ---');
  await checkEndpoint(`${baseUrl}/api/products`);
  
  // Coaches endpoint
  console.log('\n--- Coaches API Endpoints ---');
  await checkEndpoint(`${baseUrl}/api/coaches`);
}

checkAllApiEndpoints();
