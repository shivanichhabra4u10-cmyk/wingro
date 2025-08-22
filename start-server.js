// Start server and initialize data
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting server and initializing data...');

// Function to run a command
function runCommand(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const process = spawn(command, args, { 
    cwd, 
    shell: true,
    stdio: 'inherit'
  });
  
  process.on('error', (error) => {
    console.error(`${name} error:`, error);
  });
  
  process.on('close', (code) => {
    if (code !== 0) {
      console.log(`${name} exited with code ${code}`);
    }
  });
  
  return process;
}

// Start the server
const serverProcess = runCommand(
  'node', 
  ['index.js'], 
  path.join(__dirname, 'products-api'),
  'Server'
);

// Wait for server to start before initializing data
setTimeout(() => {
  console.log('Initializing community data...');
  
  // Initialize community data
  const initProcess = runCommand(
    'node', 
    ['direct-initialize-community.js'], 
    path.join(__dirname, 'products-api'),
    'Data initialization'
  );
  
  // Clean up on exit
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    serverProcess.kill();
    process.exit();
  });
}, 5000);

console.log('Press Ctrl+C to stop the server.');
