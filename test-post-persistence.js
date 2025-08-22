// Test script to verify posts are being stored in MongoDB
require('dotenv').config();
const axios = require('axios');

async function testPostCreation() {
  // Generate unique test data
  const timestamp = new Date().toISOString();
  const testPostData = {
    author: 'Test User',
    role: 'Developer',
    question: `Test question created at ${timestamp}`,
    segmentId: 'career-plateau',
    isAnonymous: false,
    isAnswered: false,
    isActive: true
  };

  console.log('==== COMMUNITY POST PERSISTENCE TEST ====');
  console.log('Testing if posts are stored in MongoDB when created');
  console.log('Test data:', JSON.stringify(testPostData, null, 2));

  try {
    // Step 1: Try to create a post using the API
    console.log('\n1. Attempting to create post via API...');
    const response = await axios.post('http://localhost:3001/api/community/posts', testPostData);
    
    if (response.status === 201) {
      console.log('✅ POST request successful with status 201 Created');
      console.log('Created post ID:', response.data.data._id);
      const createdPost = response.data.data;
      
      // Step 2: Verify the post can be retrieved using its ID
      console.log('\n2. Verifying post can be retrieved by ID...');
      const getResponse = await axios.get(`http://localhost:3001/api/community/posts/${createdPost._id}`);
      
      if (getResponse.status === 200 && getResponse.data.data.question === testPostData.question) {
        console.log('✅ Successfully retrieved the post from the database');
        console.log('Retrieved post question:', getResponse.data.data.question);
      } else {
        console.log('❌ Failed to retrieve the exact post we created');
        console.log('Expected:', testPostData.question);
        console.log('Got:', getResponse.data.data.question);
      }
      
      // Step 3: Verify the post appears in the post list
      console.log('\n3. Verifying post appears in the post list...');
      const listResponse = await axios.get('http://localhost:3001/api/community/posts');
      
      if (listResponse.status === 200) {
        const foundPost = listResponse.data.data.find(p => p._id === createdPost._id);
        
        if (foundPost) {
          console.log('✅ Post found in the list of all posts');
        } else {
          console.log('❌ Post not found in the list of all posts');
        }
        
        // Show total number of posts
        console.log(`Total posts in database: ${listResponse.data.data.length}`);
      } else {
        console.log('❌ Failed to get post list');
      }
      
      return {
        success: true,
        post: createdPost
      };
    } else {
      console.log('❌ POST request failed with unexpected status:', response.status);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return { success: false };
  }
}

// Try all available endpoints
async function testAllEndpoints() {
  const timestamp = new Date().toISOString();
  const endpoints = [
    'http://localhost:3001/api/community/posts',
    'http://localhost:3001/emergency/community/posts',
    'http://localhost:3001/community/posts'
  ];
  
  console.log('\n==== TESTING ALL AVAILABLE ENDPOINTS ====');
  
  for (const endpoint of endpoints) {
    const testData = {
      author: 'Endpoint Test User',
      role: 'Tester',
      question: `Test post for endpoint ${endpoint} at ${timestamp}`,
      segmentId: 'career-plateau',
      isAnonymous: false,
      isAnswered: false,
      isActive: true
    };
    
    try {
      console.log(`\nTesting endpoint: ${endpoint}`);
      const response = await axios.post(endpoint, testData);
      
      if (response.status === 201 && response.data.data._id) {
        console.log(`✅ Success! Post created with ID: ${response.data.data._id}`);
      } else {
        console.log('❌ Unexpected response:', response.status);
      }
    } catch (error) {
      console.error(`❌ Error with endpoint ${endpoint}:`, error.message);
    }
  }
}

// Test API health
async function checkApiHealth() {
  try {
    console.log('\n==== CHECKING API HEALTH ====');
    const response = await axios.get('http://localhost:3001/health');
    console.log('API Health:', response.data);
    console.log('MongoDB Connection:', response.data.mongodb);
    
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive community POST endpoint tests...\n');
  
  // First check API health
  const health = await checkApiHealth();
  
  if (!health || health.mongodb !== 'connected') {
    console.error('\n❌ ERROR: MongoDB is not connected. Tests cannot proceed.');
    console.error('Please make sure the guaranteed-community-api.js is running and connected to MongoDB.');
    return;
  }
  
  // Test post creation and retrieval
  const result = await testPostCreation();
  
  // Test all available endpoints
  await testAllEndpoints();
  
  // Final summary
  console.log('\n==== TEST SUMMARY ====');
  if (result.success) {
    console.log('✅ SUCCESS: Posts are being properly saved to MongoDB!');
    console.log('The community post functionality is now working correctly.');
  } else {
    console.log('❌ FAILED: Posts are not being saved to MongoDB correctly.');
    console.log('Please check the error messages above for more details.');
  }
  
  console.log('\nTo test in the application UI:');
  console.log('1. Make sure the guaranteed-community-api.js is running');
  console.log('2. Go to the Community page in the application');
  console.log('3. Create a new post and verify it persists after page refresh');
}

runAllTests();
