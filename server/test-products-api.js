// Test script specifically for products API endpoints
const axios = require('axios');

// API base URL
const API_BASE = 'http://localhost:3001/api';

// Test product data
const testProduct = {
  name: 'Test Product from API',
  description: 'This product was created through the API test script',
  price: 123.45,
  oldPrice: 199.99,
  badge: 'New',
  category: 'digital',
  productType: 'individual',
  images: [
    'https://placehold.co/600x400/6b7280/FFFFFF?text=Test+Product',
    'https://placehold.co/600x400/8c9eff/FFFFFF?text=API+Test'
  ],
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3'
  ]
};

// Test all product endpoints
async function testProductEndpoints() {
  try {
    console.log('🔍 TESTING PRODUCT API ENDPOINTS');
    console.log('--------------------------------');
    
    // Test GET /products
    console.log('\n📋 Testing GET /products');
    const getResponse = await axios.get(`${API_BASE}/products`);
    console.log(`✅ Status: ${getResponse.status}`);
    console.log(`✅ Products found: ${getResponse.data.count || 0}`);
    
    // Test POST /products
    console.log('\n➕ Testing POST /products (create)');
    const createResponse = await axios.post(`${API_BASE}/products`, testProduct);
    console.log(`✅ Status: ${createResponse.status}`);
    console.log(`✅ Created product: ${createResponse.data.data.name}`);
    
    // Save the created product ID for next operations
    const createdProductId = createResponse.data.data._id;
    console.log(`✅ Product ID: ${createdProductId}`);
    
    // Test GET /products/:id
    console.log(`\n🔍 Testing GET /products/${createdProductId}`);
    const getSingleResponse = await axios.get(`${API_BASE}/products/${createdProductId}`);
    console.log(`✅ Status: ${getSingleResponse.status}`);
    console.log(`✅ Product retrieved: ${getSingleResponse.data.data.name}`);
    
    // Test PUT /products/:id
    console.log(`\n📝 Testing PUT /products/${createdProductId} (update)`);
    const updateResponse = await axios.put(`${API_BASE}/products/${createdProductId}`, {
      ...testProduct,
      name: 'Updated Test Product',
      price: 149.99
    });
    console.log(`✅ Status: ${updateResponse.status}`);
    console.log(`✅ Updated product: ${updateResponse.data.data.name}`);
    
    // Test DELETE /products/:id
    console.log(`\n❌ Testing DELETE /products/${createdProductId}`);
    const deleteResponse = await axios.delete(`${API_BASE}/products/${createdProductId}`);
    console.log(`✅ Status: ${deleteResponse.status}`);
    console.log(`✅ Product deleted: ${deleteResponse.data.success}`);
    
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
    
  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);
    console.log('\nAPI TEST FAILED!');
    console.log('Response details:', error.response?.data);
  }
}

// Run the tests
testProductEndpoints();
