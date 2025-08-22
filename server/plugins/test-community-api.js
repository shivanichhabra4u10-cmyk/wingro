/**
 * Test script to verify Community API endpoints are working after integration
 */

const axios = require('axios');
const chalk = require('chalk') || { green: (s) => `✅ ${s}`, red: (s) => `❌ ${s}`, cyan: (s) => `ℹ️  ${s}`, yellow: (s) => `⚠️  ${s}` };

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Endpoints to test
const endpoints = [
  '/api/community/segments',
  '/community/segments',
  '/emergency/community/segments',
  '/api/community/posts',
  '/community/posts',
  '/emergency/community/posts',
  '/api/community/posts?segmentId=career-plateau',
  '/api/community/posts?answered=true'
];

// Test a single endpoint
async function testEndpoint(endpoint) {
  try {
    console.log(chalk.cyan(`Testing endpoint: ${endpoint}`));
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    
    if (response.status === 200 && response.data && response.data.success) {
      console.log(chalk.green(`✓ Success - ${endpoint}`));
      console.log(chalk.cyan(`  Found ${response.data.count || (response.data.data && response.data.data.length) || 0} items`));
      return true;
    } else {
      console.log(chalk.red(`✗ Failed - ${endpoint}`));
      console.log(chalk.red(`  Status: ${response.status}, Data: ${JSON.stringify(response.data)}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`✗ Error testing ${endpoint}`));
    console.log(chalk.red(`  ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`  Status: ${error.response.status}`));
      console.log(chalk.red(`  Response: ${JSON.stringify(error.response.data)}`));
    }
    return false;
  }
}

// Test POST request
async function testPostEndpoint() {
  try {
    console.log(chalk.cyan('\nTesting POST to /api/community/posts'));
    const newPost = {
      question: 'Test Question from Integration Test',
      details: 'This is a test post to verify the API integration is working correctly.',
      author: 'Integration Test',
      role: 'Tester',
      segmentId: 'career-plateau',
      isAnonymous: false
    };
    
    const response = await axios.post(`${BASE_URL}/api/community/posts`, newPost);
    
    if (response.status === 201 && response.data && response.data.success) {
      console.log(chalk.green(`✓ Success - POST /api/community/posts`));
      console.log(chalk.cyan(`  Created post with ID: ${response.data.data._id}`));
      return response.data.data._id;
    } else {
      console.log(chalk.red(`✗ Failed - POST /api/community/posts`));
      console.log(chalk.red(`  Status: ${response.status}, Data: ${JSON.stringify(response.data)}`));
      return null;
    }
  } catch (error) {
    console.log(chalk.red(`✗ Error testing POST /api/community/posts`));
    console.log(chalk.red(`  ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`  Status: ${error.response.status}`));
      console.log(chalk.red(`  Response: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log(chalk.yellow('=== Community API Integration Tests ==='));
  console.log(chalk.cyan(`Testing against server at: ${BASE_URL}`));
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  // Test GET endpoints
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Test POST endpoint
  const newPostId = await testPostEndpoint();
  if (newPostId) {
    successCount++;
    
    // Test getting the new post
    console.log(chalk.cyan(`\nTesting GET for newly created post: ${newPostId}`));
    const getSuccess = await testEndpoint(`/api/community/posts/${newPostId}`);
    if (getSuccess) {
      successCount++;
    } else {
      failCount++;
    }
  } else {
    failCount++;
  }
  
  // Summary
  console.log('\n' + chalk.yellow('=== Test Summary ==='));
  console.log(chalk.cyan(`Total tests: ${successCount + failCount}`));
  console.log(chalk.green(`Passed: ${successCount}`));
  console.log(chalk.red(`Failed: ${failCount}`));
  
  if (failCount === 0) {
    console.log(chalk.green('\n✓ All tests passed! The Community API is working correctly.'));
  } else {
    console.log(chalk.red(`\n✗ Some tests failed. Please check the server logs for more information.`));
  }
}

// Check if server is running before starting tests
axios.get(`${BASE_URL}/api/health`)
  .then(() => {
    runTests();
  })
  .catch((error) => {
    console.log(chalk.red('Server does not appear to be running at ' + BASE_URL));
    console.log(chalk.yellow('Please start the server before running this test script.'));
    process.exit(1);
  });
