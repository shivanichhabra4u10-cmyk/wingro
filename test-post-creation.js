// test-post-creation.js - Test script to verify that post creation works

const axios = require('axios');

async function testPostCreation() {
  console.log('Testing community post creation...\n');
  
  const newPost = {
    author: 'Test User',
    role: 'Developer',
    question: 'Is the POST request working now?',
    details: 'Testing if we can create posts through the API',
    segmentId: 'career-plateau',
    isAnonymous: false,
    isAnswered: false
  };
  
  // Test all three endpoint variations
  const endpoints = [
    '/emergency/community/posts',
    '/api/community/posts',
    '/community/posts'
  ];
  
  for (const endpoint of endpoints) {
    const url = `http://localhost:3001${endpoint}`;
    
    try {
      console.log(`Testing POST to ${url}...`);
      const response = await axios.post(url, newPost);
      
      console.log(`✅ SUCCESS! Status: ${response.status}`);
      console.log(`Created post with ID: ${response.data.data._id}\n`);
    } catch (error) {
      console.log(`❌ FAILED! ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Response: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log('No response received\n');
      }
    }
  }
  
  console.log('Test complete!');
}

testPostCreation();
