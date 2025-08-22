const axios = require('axios');

async function testCreatePost() {
  const url = 'http://localhost:3001/emergency/community/posts';
  const newPost = {
    author: 'Test User',
    role: 'Developer',
    question: 'Is the POST endpoint working now?',
    segmentId: 'career-plateau',
    isAnonymous: false
  };

  try {
    console.log(`Testing POST to ${url}`);
    console.log('Sending data:', JSON.stringify(newPost, null, 2));
    
    const response = await axios.post(url, newPost);
    
    console.log('\nSUCCESS! Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('\nThe POST endpoint is working correctly! You can now submit questions in the app.');
    
    return response.data;
  } catch (error) {
    console.error('\nFAILED! Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nThe POST endpoint is still not working. Please check the server.');
  }
}

testCreatePost();
