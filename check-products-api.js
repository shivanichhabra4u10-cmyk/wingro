// check-products-api.js
const axios = require('axios');

async function checkProductsAPI() {
  try {
    console.log('Testing API endpoint: http://localhost:3001/api/products');
    const response = await axios.get('http://localhost:3001/api/products');
    
    console.log('\nAPI Response Status:', response.status);
    console.log('Response Data Type:', typeof response.data);
    
    if (typeof response.data === 'object') {
      console.log('Response Data Keys:', Object.keys(response.data));
      
      if (response.data.data) {
        console.log('\nData is wrapped in "data" property');
        console.log('Products array type:', Array.isArray(response.data.data) ? 'Array' : typeof response.data.data);
        console.log('Number of products:', Array.isArray(response.data.data) ? response.data.data.length : 'Not an array');
      } else {
        console.log('\nNo "data" property found');
      }
      
      console.log('\nSample of response:', JSON.stringify(response.data).substring(0, 300) + '...');
    }
  } catch (error) {
    console.error('Error checking API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkProductsAPI();
