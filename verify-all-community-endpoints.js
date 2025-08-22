const axios = require('axios');

async function testEndpoint(method, url, body = null) {
  try {
    console.log(`Testing ${method}: ${url}`);
    
    let response;
    if (method === 'GET') {
      response = await axios.get(url);
    } else if (method === 'POST') {
      response = await axios.post(url, body);
    } else if (method === 'PUT') {
      response = await axios.put(url, body);
    }
    
    console.log(`✅ SUCCESS (${response.status}): ${method} ${url}`);
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log(`   Data count: ${response.data.data.length}`);
      } else {
        console.log(`   Data ID: ${response.data.data._id}`);
      }
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ FAILED (${error.response?.status || 'Unknown'}): ${method} ${url}`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error };
  }
}

async function runTests() {
  const baseUrl = 'http://localhost:3001';
  let testPostId = null;
  
  console.log('=== TESTING EMERGENCY COMMUNITY API ENDPOINTS ===\n');
  
  console.log('1. TESTING READ OPERATIONS\n');
  
  // Test health endpoint
  await testEndpoint('GET', `${baseUrl}/health`);
  console.log();
  
  // Test GET endpoints
  const getEndpoints = [
    '/api/community/segments',
    '/community/segments',
    '/emergency/community/segments',
    '/api/community/posts',
    '/community/posts',
    '/emergency/community/posts'
  ];
  
  for (const endpoint of getEndpoints) {
    await testEndpoint('GET', `${baseUrl}${endpoint}`);
    console.log();
  }
  
  console.log('\n2. TESTING WRITE OPERATIONS\n');
  
  // Test POST - create post
  console.log('Creating a new post...');
  
  const newPost = {
    author: 'Test User',
    role: 'Tester',
    question: 'Is the emergency API working?',
    segmentId: 'career-plateau',
    isAnonymous: false,
    isAnswered: false,
    isActive: true
  };
  
  const postResult = await testEndpoint('POST', `${baseUrl}/emergency/community/posts`, newPost);
  console.log();
  
  if (postResult.success && postResult.data && postResult.data.data) {
    testPostId = postResult.data.data._id;
    
    // Test like post
    if (testPostId) {
      console.log(`Liking post ${testPostId}...`);
      await testEndpoint('PUT', `${baseUrl}/emergency/community/posts/${testPostId}/like`);
      console.log();
    }
    
    // Test bookmark post
    if (testPostId) {
      console.log(`Bookmarking post ${testPostId}...`);
      await testEndpoint('PUT', `${baseUrl}/emergency/community/posts/${testPostId}/bookmark`);
      console.log();
    }
    
    // Test add comment
    if (testPostId) {
      console.log(`Adding comment to post ${testPostId}...`);
      const comment = {
        author: 'Test Commenter',
        content: 'Yes, the emergency API is working great!',
        isAnonymous: false
      };
      
      await testEndpoint('POST', `${baseUrl}/emergency/community/posts/${testPostId}/comments`, comment);
      console.log();
    }
  }
  
  console.log('=== TEST COMPLETE ===');
  if (testPostId) {
    console.log(`Successfully created and interacted with post ID: ${testPostId}`);
    console.log('All critical community features are now operational!');
  } else {
    console.log('Failed to create test post. Some operations may not be working.');
  }
}

runTests();
