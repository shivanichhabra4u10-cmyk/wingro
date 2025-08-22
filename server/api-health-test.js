const { exec } = require('child_process');

console.log('Starting API test...');
console.log('Testing server health...');

// Function to run a curl command and return a promise
function runCurl(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      try {
        const jsonOutput = JSON.parse(stdout);
        resolve(jsonOutput);
      } catch (e) {
        console.log(`Raw output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

async function testAPI() {
  try {
    // Test health endpoint
    console.log('\nTesting server health endpoint...');
    const healthCheck = await runCurl('curl -s http://localhost:3001/health');
    console.log('Health response:', healthCheck);
    
    // Test product endpoints
    console.log('\nTesting /api/products endpoint...');
    const products = await runCurl('curl -s http://localhost:3001/api/products');
    console.log('Products response:', products);

    // Test product endpoint with filter
    console.log('\nTesting /api/products with productType=individual filter...');
    const individualProducts = await runCurl('curl -s "http://localhost:3001/api/products?productType=individual"');
    console.log('Individual products response:', individualProducts);
    
    console.log('\nAPI test completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
