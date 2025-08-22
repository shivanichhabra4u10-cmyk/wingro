// Simplified script to check and fix community API connectivity
// Fix by verifying routes and starting the emergency community API

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const API_URL = 'http://localhost:3001';

// Check if the emergency community API is running
async function checkApi() {
  console.log('Checking if emergency community API is running...');
  
  try {
    // Try calling the health endpoint
    const response = await axios.get(`${API_URL}/health`);
    console.log('API health check response:', response.data);
    
    // Check if API is working but emergency endpoints are not mounted
    try {
      console.log('Checking emergency community endpoints...');
      await axios.get(`${API_URL}/emergency/community/segments`);
      console.log('✅ Emergency community segments endpoint is working!');
      return true;
    } catch (emergencyError) {
      console.log('❌ Emergency community endpoints not found');
      return false;
    }
  } catch (error) {
    console.log('❌ API health check failed or API not running');
    return false;
  }
}

// Start the emergency community API
function startEmergencyApi() {
  console.log('Starting emergency community API...');
  
  // Path to the emergency API script
  const apiPath = path.join(__dirname, 'emergency-community-api.js');
  
  // Start the API as a child process
  const apiProcess = spawn('node', [apiPath], {
    detached: true,
    stdio: 'inherit'
  });
  
  apiProcess.unref();
  console.log(`✅ Emergency community API started (PID: ${apiProcess.pid})`);
  
  return new Promise(resolve => {
    // Give API time to start up
    setTimeout(() => {
      resolve(apiProcess.pid);
    }, 2000);
  });
}

// Main function
async function fixCommunityApi() {
  console.log('Fixing community API issues...');
  
  // Check if API is already running
  const isApiRunning = await checkApi();
  
  if (!isApiRunning) {
    console.log('Emergency community API is not running. Starting it now...');
    const pid = await startEmergencyApi();
    
    // Verify API is now running
    setTimeout(async () => {
      const isFixed = await checkApi();
      if (isFixed) {
        console.log('✅ SUCCESS! Emergency community API is now running correctly!');
        console.log('The following endpoints should now work:');
        console.log('  - http://localhost:3001/emergency/community/segments');
        console.log('  - http://localhost:3001/emergency/community/posts');
      } else {
        console.log('❌ API still not working correctly. Try running node emergency-community-api.js directly');
      }
    }, 3000);
  } else {
    console.log('✅ Emergency community API is already running correctly!');
  }
}

// Execute the fix
fixCommunityApi();
