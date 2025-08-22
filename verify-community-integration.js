// Verify that all community API endpoints are properly integrated
// Run this after starting the server with run-permanent-community-api.ps1

const axios = require('axios');

// Base URL for the main server
const BASE_URL = 'http://localhost:3000';

// Paths to test
const PATHS = [
  '/api/community/segments',
  '/community/segments',
  '/emergency/community/segments',
  '/api/community/posts',
  '/community/posts',
  '/emergency/community/posts'
];

// Terminal colors for better readability
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

// Function to test an endpoint
async function testEndpoint(path) {
  console.log(`${colors.cyan}Testing endpoint: ${path}${colors.reset}`);
  
  try {
    const response = await axios.get(`${BASE_URL}${path}`);
    const success = response.status === 200 && 
                   response.data && 
                   response.data.success === true &&
                   Array.isArray(response.data.data);
    
    if (success) {
      console.log(`${colors.green}✓ SUCCESS: ${path} returned ${response.data.data.length} items${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}✗ FAILED: ${path} returned unexpected response format${colors.reset}`);
      console.log(response.data);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log(`${colors.red}✗ ERROR ${error.response.status}: ${path}${colors.reset}`);
      console.log(error.response.data);
    } else {
      console.log(`${colors.red}✗ CONNECTION ERROR: ${path}${colors.reset}`);
      console.log(error.message);
    }
    return false;
  }
}

// Main function to run tests
async function runVerification() {
  console.log('\n==================================');
  console.log('COMMUNITY API INTEGRATION VERIFICATION');
  console.log('==================================\n');
  
  console.log('Testing all community API endpoint paths...\n');
  
  let passCount = 0;
  let failCount = 0;
  
  // Test all paths
  for (const path of PATHS) {
    const success = await testEndpoint(path);
    if (success) {
      passCount++;
    } else {
      failCount++;
    }
    console.log(''); // Add spacing between tests
  }
  
  // Print summary
  console.log('\n==================================');
  console.log('VERIFICATION SUMMARY');
  console.log('==================================');
  console.log(`${colors.green}PASSED: ${passCount} endpoints${colors.reset}`);
  console.log(`${colors.red}FAILED: ${failCount} endpoints${colors.reset}`);
  
  if (failCount === 0) {
    console.log(`\n${colors.green}✓ SUCCESS: All community API endpoints are properly integrated!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ FAILED: Some community API endpoints are not working correctly.${colors.reset}`);
    console.log(`${colors.yellow}Please check the server logs for more details.${colors.reset}`);
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Verification script error:', error);
});
