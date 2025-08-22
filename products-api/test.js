// Test script for standalone products API
const axios = require('axios');

// Test all available endpoints to see which ones work
async function testMultipleEndpoints() {
  const endpoints = [
    'http://localhost:3001/api/products',
    'http://localhost:3001/products',
    'http://localhost:3001'
  ];
  
  const testProduct = {
    name: 'Test Product via Standalone API',
    description: 'This is a test product for the standalone API',
    price: 99.99,
    category: 'digital',
    productType: 'individual',
    images: ['https://placehold.co/600x400/f87171/FFFFFF?text=Standalone+API+Test'],
    features: ['Test feature']
  };
  
  console.log('TESTING STANDALONE PRODUCTS API');
  console.log('-------------------------------');
  
  // Test each endpoint
  for (const baseEndpoint of endpoints) {
    try {
      const endpoint = baseEndpoint === 'http://localhost:3001' ? `${baseEndpoint}/products` : baseEndpoint;
      console.log(`\n🧪 Testing endpoint: ${endpoint}`);
      
      // Try to create a product
      console.log(`Attempting POST to ${endpoint}...`);
      const response = await axios.post(endpoint, testProduct);
      
      console.log(`✅ SUCCESS with ${endpoint}!`);
      console.log(`Status code: ${response.status}`);
      console.log(`Product ID: ${response.data.data._id}`);
      console.log(`\nTHIS ENDPOINT WORKS: ${endpoint}\nUse this in your application.\n`);
      
    } catch (error) {
      console.log(`❌ FAILED with ${baseEndpoint}:`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }
  }
}

// Run the tests
testMultipleEndpoints();
