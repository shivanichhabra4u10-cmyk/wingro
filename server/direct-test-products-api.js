// Direct test for the products API endpoint
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/products';

// Test product data
const testProduct = {
  name: 'Emergency Test Product',
  description: 'This is a test product created with a direct API call',
  price: 99.99,
  category: 'digital',
  productType: 'individual',
  images: ['https://placehold.co/600x400/f87171/FFFFFF?text=Emergency+Test'],
  features: ['Test feature']
};

// Function to test the products API
async function testProductsAPI() {
  try {
    console.log('Attempting to create a product via API...');
    console.log('API URL:', API_URL);
    console.log('Product data:', testProduct);
    
    const response = await axios.post(API_URL, testProduct);
    
    console.log('\n✅ SUCCESS! Product created successfully');
    console.log('Status code:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('\n❌ ERROR creating product:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Server might be down.');
      console.error('Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    // Log connection details
    console.log('\nDEBUG INFO:');
    console.log('→ Base URL:', error.config?.baseURL);
    console.log('→ URL:', error.config?.url);
    console.log('→ Method:', error.config?.method);
    console.log('→ Headers:', error.config?.headers);
    
    throw error;
  }
}

// Run the test
testProductsAPI()
  .then(() => {
    console.log('\nNext steps:');
    console.log('1. Verify the product appears in MongoDB');
    console.log('2. Try using the Add Product feature in the UI now');
  })
  .catch(() => {
    console.log('\nPossible issues:');
    console.log('1. Server is not running on port 3001');
    console.log('2. The /api/products route is not properly registered');
    console.log('3. MongoDB is not connected or has issues');
    console.log('\nTry running the debug server: node run-debug-server.js');
  });
