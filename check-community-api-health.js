// API Health Check Script
// Run this script with: node check-community-api-health.js
// It will check if the community API is healthy and responding correctly

const axios = require('axios');

// API Base URL
const API_BASE_URL = 'http://localhost:3001';

// Endpoint paths to test
const endpoints = [
  '/health',
  '/api/community/segments',
  '/emergency/community/segments',
  '/community/segments',
  '/api/community/posts',
  '/emergency/community/posts',
  '/community/posts'
];

// Function to test an endpoint
async function testEndpoint(path) {
  try {
    console.log(`Testing GET ${path}...`);
    
    const response = await axios.get(`${API_BASE_URL}${path}`);
    
    console.log(`✅ SUCCESS: ${path} - ${response.status} ${response.statusText}`);
    
    // Print brief summary of the data
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log(`   Received ${response.data.data.length} items`);
      } else {
        console.log(`   Received data of type: ${typeof response.data.data}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ ERROR: ${path} - ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response: `, error.response.data);
    }
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('============================================');
  console.log('COMMUNITY API HEALTH CHECK');
  console.log('============================================');
  console.log(`Testing API at: ${API_BASE_URL}`);
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  // Test GET endpoints
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) successCount++; else failCount++;
    console.log(''); // Add space between tests
  }
  
  // Test summary
  console.log('============================================');
  console.log('HEALTH CHECK SUMMARY');
  console.log('============================================');
  console.log(`Total Endpoints Tested: ${successCount + failCount}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\nTROUBLESHOOTING TIPS:');
    console.log('1. Make sure the guaranteed-community-api.js is running on port 3001');
    console.log('2. Check for any errors in the API server console');
    console.log('3. Verify MongoDB is running and accessible');
    console.log('4. Try restarting the API server with the run-app-with-community.ps1 script');
  } else {
    console.log('\n✅ All endpoints are healthy! Your Community API is working correctly.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unexpected error during health check:', error);
});
