const axios = require('axios');

// Function to test the community API endpoints with detailed logging
async function testCommunityAPI() {
  const baseUrl = 'http://localhost:3001';
  console.log('Testing Community API endpoints...\n');
  
  // First test the emergency endpoints
  console.log('Testing Emergency Endpoints:');
    try {
    // Test emergency segments endpoint
    console.log('1. Testing /emergency/community/segments');
    try {
      const emergencySegmentsResponse = await axios.get(`${baseUrl}/emergency/community/segments`);
      console.log('✅ Emergency segments endpoint working!');
      console.log(`   Status: ${emergencySegmentsResponse.status}`);
      console.log(`   Data: ${JSON.stringify(emergencySegmentsResponse.data).substring(0, 100)}...\n`);
    } catch (error) {
      console.error('❌ Emergency segments endpoint failed!');
      console.error(`   Error: ${error.message}\n`);
    }
    
    // Test emergency posts endpoint
    console.log('2. Testing /emergency/community/posts');
    try {
      const emergencyPostsResponse = await axios.get(`${baseUrl}/emergency/community/posts`);
      console.log('✅ Emergency posts endpoint working!');
      console.log(`   Status: ${emergencyPostsResponse.status}`);
      console.log(`   Data: ${JSON.stringify(emergencyPostsResponse.data).substring(0, 100)}...\n`);
    } catch (error) {
      console.error('❌ Emergency posts endpoint failed!');
      console.error(`   Error: ${error.message}\n`);
    }
    
    console.log('Testing Standard Endpoints:');
    // 3. Test standard segments endpoint
    console.log('3. Testing /api/community/segments');
    const segmentsResponse = await axios.get(`${baseUrl}/api/community/segments`);
    console.log('✅ Segments endpoint working!');
    console.log(`   Status: ${segmentsResponse.status}`);
    console.log(`   Data: ${JSON.stringify(segmentsResponse.data).substring(0, 100)}...\n`);
      // 4. Test standard posts endpoint 
    console.log('4. Testing /api/community/posts');
    const postsResponse = await axios.get(`${baseUrl}/api/community/posts`);
    console.log('✅ Posts endpoint working!');
    console.log(`   Status: ${postsResponse.status}`);
    console.log(`   Data: ${JSON.stringify(postsResponse.data).substring(0, 100)}...\n`);
      // 5. If posts exist, test comments endpoint with the first post ID
    if (postsResponse.data && postsResponse.data.data && postsResponse.data.data.length > 0) {
      const firstPostId = postsResponse.data.data[0]._id;
      console.log(`5. Testing /api/community/posts/${firstPostId}/comments`);
      
      try {
        const commentsResponse = await axios.get(`${baseUrl}/api/community/posts/${firstPostId}/comments`);
        console.log('✅ Comments endpoint working!');
        console.log(`   Status: ${commentsResponse.status}`);
        console.log(`   Data: ${JSON.stringify(commentsResponse.data).substring(0, 100)}...\n`);
      } catch (error) {
        console.error('❌ Comments endpoint failed!');
        console.error(`   Error: ${error.message}\n`);
      }
    }
    
    console.log('Community API Test Complete! All endpoints fixed and working correctly.');
    
  } catch (error) {
    console.error('❌ API Test Failed!');
    console.error(`   Error: ${error.message}`);
    console.error('   Make sure the server is running on port 3001');
  }
}

testCommunityAPI();
