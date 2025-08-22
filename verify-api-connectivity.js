// verify-api-connectivity.js
const axios = require('axios');

const apiBase = 'http://localhost:3001';
const apiEndpoints = [
  '/community/segments',
  '/community/posts',
  '/products',
  '/coaches',
  '/goals',
  '/growth-plans'
];

async function checkEndpoints() {
  console.log('Checking API endpoints...');
  
  for (const endpoint of apiEndpoints) {
    try {
      console.log(`Testing ${apiBase}${endpoint}...`);
      const response = await axios.get(`${apiBase}${endpoint}`);
      console.log(`✅ ${endpoint} is WORKING! Status: ${response.status}`);
      console.log(`   Data sample: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ ${endpoint} ERROR: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log('---------------------------------------------------');
  }
}

checkEndpoints();
