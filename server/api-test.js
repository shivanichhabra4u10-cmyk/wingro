/**
 * Contact Form API Test Script
 * ---------------------------
 * This script tests the contact form submission API endpoint 
 * without requiring the frontend client to be running.
 */

const axios = require('axios');

// API endpoint
const API_URL = 'http://localhost:3001/api/contact';

// Test contact data
const contactData = {
  name: 'API Test User',
  email: 'apitest@example.com',
  phoneNumber: '555-123-4567',
  subject: 'API Test Contact Form',
  message: 'This is a test message sent directly to the API endpoint.'
};

async function testContactFormAPI() {
  console.log('Testing Contact Form API Submission');
  console.log('-----------------------------------');
  console.log('Endpoint:', API_URL);
  console.log('Sending data:', contactData);
  
  try {
    console.log('\nSending POST request...');
    const response = await axios.post(API_URL, contactData);
    
    console.log('\n✅ API request successful!');
    console.log('Status:', response.status, response.statusText);
    console.log('Response data:', response.data);
    
    return true;
  } catch (error) {
    console.error('\n❌ API request failed!');
    
    if (error.response) {
      // Server responded with non-2xx status
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received. Is the server running?');
    } else {
      // Error in setting up the request
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

// Execute the test
testContactFormAPI()
  .then(success => {
    console.log('\nTest completed!');
    if (!success) {
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure the server is running (npm start in server directory)');
      console.log('2. Check that MongoDB is running (docker-compose up -d mongodb)');
      console.log('3. Verify that the API endpoint is correct');
      console.log('4. Check server logs for any errors');
    }
  });
