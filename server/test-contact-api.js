const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3001/api';

// Test data
const contactData = {
  name: 'Test User',
  email: 'test@example.com',
  phoneNumber: '123-456-7890',
  subject: 'API Test',
  message: 'This is an automated test of the contact form API.'
};

async function testContactAPI() {
  console.log('🔍 Testing Contact Form API...');
  console.log('📡 API URL:', API_URL);
  console.log('📝 Test Data:', JSON.stringify(contactData, null, 2));
  
  try {
    console.log('\n🚀 Sending POST request to /api/contact...');
    
    // Test the contact endpoint
    const response = await axios.post(`${API_URL}/contact`, contactData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ SUCCESS! Contact form submission worked!');
    console.log('📊 Status Code:', response.status);
    console.log('📄 Response Data:', JSON.stringify(response.data, null, 2));
    
    // Check the structure of the response
    if (response.data.success === true && response.data.message && response.data.data) {
      console.log('✅ Response has the expected structure');
      
      const { name, email, subject } = response.data.data;
      if (name === contactData.name && email === contactData.email && subject === contactData.subject) {
        console.log('✅ Data in response matches submitted data');
      } else {
        console.log('⚠️ Data in response does not match submitted data');
      }
    } else {
      console.log('⚠️ Response does not have the expected structure');
    }
    
    return true;
  } catch (error) {
    console.log('\n❌ ERROR! Contact form submission failed:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('📊 Status Code:', error.response.status);
      console.log('📄 Response Data:', JSON.stringify(error.response.data, null, 2));
      console.log('📋 Response Headers:', JSON.stringify(error.response.headers, null, 2));
      
      if (error.response.status === 404) {
        console.log('\n🔍 DEBUGGING TIPS for 404 Error:');
        console.log('1. Make sure the server is running on port 3001');
        console.log('2. Check that the contact routes are properly set up in src/routes/index.ts');
        console.log('3. Verify that contact.routes.ts is properly defining the POST / endpoint');
        console.log('4. The URL should be exactly http://localhost:3001/api/contact');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log('📡 No response received. Server might not be running.');
      console.log('🔄 Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('⚙️ Error setting up request:', error.message);
    }
    
    console.log('\n🔧 Additional debugging info:');
    console.log('- Check server logs for errors');
    console.log('- Ensure MongoDB is running and connected');
    console.log('- Verify the Contact model is properly defined');
    
    return false;
  }
}

// Execute the test
testContactAPI();
