// Script to test important API endpoints
const axios = require('axios');

// Base URL for the API server
const BASE_URL = 'http://localhost:3001';

// Test endpoints
const endpoints = [
  { 
    url: '/', 
    method: 'get',
    description: 'Root endpoint' 
  },
  { 
    url: '/health', 
    method: 'get',
    description: 'Health check endpoint' 
  },
  { 
    url: '/api/contact', 
    method: 'post',
    description: 'Contact submission endpoint',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '123-456-7890',
      subject: 'Test from API tester',
      message: 'This is a test message from the API tester script'
    }
  }
];

async function testEndpoint(endpoint) {
  console.log(`\nTesting ${endpoint.description}: ${endpoint.method.toUpperCase()} ${BASE_URL}${endpoint.url}`);
  
  try {
    const response = await axios({
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.url}`,
      data: endpoint.data
    });
    
    console.log('Status:', response.status);
    console.log('Response data:', typeof response.data === 'object' ? 
                              JSON.stringify(response.data, null, 2) : 
                              response.data.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log('=== API Endpoint Tester ===');
  console.log(`Base URL: ${BASE_URL}`);
  
  let successes = 0;
  let failures = 0;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      successes++;
    } else {
      failures++;
    }
  }
  
  console.log('\n=== Test Summary ===');
  console.log(`Endpoints tested: ${endpoints.length}`);
  console.log(`Successful: ${successes}`);
  console.log(`Failed: ${failures}`);
}

runTests();
