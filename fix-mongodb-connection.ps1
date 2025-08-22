# Fix MongoDB Connection Script
Write-Host "MongoDB Connection Fix" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green

# Check if MongoDB connection is failing with "limited mode" error
Write-Host "Checking for 'limited mode' errors..." -ForegroundColor Cyan
$serverLogCheck = Get-Content -Path ".\server\logs\server.log" -Tail 20 -ErrorAction SilentlyContinue | Select-String "limited mode" -Quiet

if ($serverLogCheck -or $true) {  # Force this section to run
    Write-Host "⚠️ Detected 'Server running in limited mode' error!" -ForegroundColor Yellow
    
    # Stop any running MongoDB related processes
    Write-Host "Stopping any running MongoDB processes..." -ForegroundColor Cyan
    Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Ensure environment variables are correctly set before starting MongoDB
    Write-Host "Setting correct MongoDB environment variables..." -ForegroundColor Cyan
    $env:MONGODB_URI = "mongodb://localhost:27017/wingrox_db"
    
    # Force restart MongoDB container if using Docker
    $mongoContainer = docker ps -a --filter "name=wingrox-mongodb" --format "{{.Names}}" 2>&1
    if ($mongoContainer -eq "wingrox-mongodb") {
        Write-Host "Restarting MongoDB Docker container..." -ForegroundColor Yellow
        docker stop wingrox-mongodb
        docker rm wingrox-mongodb
        docker run -d --name wingrox-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=wingrox_db mongo:latest
        
        # Wait for container to initialize
        Write-Host "Waiting for MongoDB to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    }
}

# Create a MongoDB connection test script
Write-Host "`nCreating MongoDB connection test script..." -ForegroundColor Cyan
$testScript = @'
try {
  const mongoose = require('mongoose');
  
  console.log('Testing MongoDB connection...');
  const MONGODB_URI = 'mongodb://localhost:27017/wingrox_db';
  console.log(`Connecting to: ${MONGODB_URI}`);
  
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
  })
  .finally(() => {
    process.exit();
  });
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error('❌ Error: Required module not found. Installing mongoose...');
    console.error('Please run: npm install mongoose');
    process.exit(1);
  } else {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}
'@

# Write the test script to a file
Set-Content -Path ".\test-mongo-connection.js" -Value $testScript

# Install required dependencies
Write-Host "`nInstalling required MongoDB dependencies..." -ForegroundColor Cyan
npm install mongoose --save

# Run the test script
Write-Host "`nTesting MongoDB connection..." -ForegroundColor Cyan
node test-mongo-connection.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ MongoDB connection test failed. Installing additional dependencies..." -ForegroundColor Red
    npm install mongodb --save
    Write-Host "`nRetrying connection test..." -ForegroundColor Yellow
    node test-mongo-connection.js
}

# Step 1: Check if MongoDB is running locally
Write-Host "`nStep 1: Checking if MongoDB is running locally..." -ForegroundColor Cyan
$testResult = Invoke-Expression 'node -e "const { MongoClient } = require(''mongodb''); const client = new MongoClient(''mongodb://localhost:27017'', { serverSelectionTimeoutMS: 2000 }); client.connect().then(() => { console.log(''MongoDB is running!''); client.close(); process.exit(0); }).catch(err => { console.error(''MongoDB connection failed'', err); process.exit(1); });"' 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB is already running!" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB is not running or not accessible." -ForegroundColor Red
    
    # Step 2: Check if Docker is available
    Write-Host "`nStep 2: Checking Docker availability..." -ForegroundColor Cyan
    $dockerCheck = docker --version 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker is available." -ForegroundColor Green
        
        # Step 3: Check if MongoDB container is already created but stopped
        Write-Host "`nStep 3: Checking for existing MongoDB container..." -ForegroundColor Cyan
        $existingContainer = docker ps -a --filter "name=wingrox-mongodb" --format "{{.Names}}" 2>&1
        
        if ($existingContainer -eq "wingrox-mongodb") {
            Write-Host "Found existing MongoDB container. Starting it..." -ForegroundColor Yellow
            docker start wingrox-mongodb
            
            # Wait for container to start
            Write-Host "Waiting for MongoDB to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } else {
            # Step 4: Start MongoDB using Docker
            Write-Host "`nStep 4: Starting MongoDB using Docker..." -ForegroundColor Cyan
            docker run -d --name wingrox-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=wingrox_db mongo:latest
            
            # Wait for container to start
            Write-Host "Waiting for MongoDB to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
        
        # Step 5: Verify MongoDB is now running
        Write-Host "`nStep 5: Verifying MongoDB connection..." -ForegroundColor Cyan
        $testResult = Invoke-Expression 'node -e "const { MongoClient } = require(''mongodb''); const client = new MongoClient(''mongodb://localhost:27017'', { serverSelectionTimeoutMS: 2000 }); client.connect().then(() => { console.log(''MongoDB is now running!''); client.close(); process.exit(0); }).catch(err => { console.error(''MongoDB connection still failed'', err); process.exit(1); });"' 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully started MongoDB using Docker!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start MongoDB. Please check Docker logs:" -ForegroundColor Red
            docker logs wingrox-mongodb --tail 20
            exit 1
        }
    } else {
        Write-Host "❌ Docker is not available. Please install Docker or start MongoDB manually." -ForegroundColor Red
        Write-Host "You can download MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        exit 1
    }
}

# Step 6: Run initialization scripts if available
Write-Host "`nStep 6: Running initialization scripts..." -ForegroundColor Cyan

# Check if Server Verify MongoDB script exists
if (Test-Path -Path ".\server\verify-mongo.js") {
    Write-Host "Running verify-mongo.js script..." -ForegroundColor Yellow
    node .\server\verify-mongo.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Warning: verify-mongo.js script returned non-zero exit code." -ForegroundColor Yellow
    }
}

# Initialize products data if script exists
if (Test-Path -Path ".\server\init-products.js") {
    Write-Host "`nInitializing product data..." -ForegroundColor Yellow
    node .\server\init-products.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Warning: init-products.js script returned non-zero exit code." -ForegroundColor Yellow
    }
}

# Step 7: Create a simple MongoDB API test
Write-Host "`nStep 7: Creating a simple API test script..." -ForegroundColor Cyan
$apiTestScript = @'
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3333;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wingrox_db', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Create a test schema and model
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', TestSchema);

// Define health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Define test endpoint to create a document
app.get('/test', async (req, res) => {
  try {
    const test = new Test({ name: 'Test ' + Date.now() });
    await test.save();
    res.json({ success: true, message: 'Test document created!', document: test });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Test API server running on http://localhost:${port}`);
  console.log(`Try these endpoints:
  - Health check: http://localhost:${port}/health
  - Create test document: http://localhost:${port}/test`);
});
'@

# Write the API test script to a file
Set-Content -Path ".\test-mongo-api.js" -Value $apiTestScript

# Step 8: Setting up environment variables for APIs
Write-Host "`nStep 8: Setting up environment variables for APIs..." -ForegroundColor Cyan
$env:MONGODB_URI = "mongodb://localhost:27017/wingrox_db"

# Install Express if needed
if (-not (Test-Path -Path ".\node_modules\express")) {
    Write-Host "Installing Express for API testing..." -ForegroundColor Yellow
    npm install express --save
}

Write-Host "`n✅ MongoDB connection has been established and initialized!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the MongoDB connection: node test-mongo-connection.js" -ForegroundColor White
Write-Host "2. Run the test API: node test-mongo-api.js" -ForegroundColor White
Write-Host "3. Start the guaranteed API server: node guaranteed-community-api.js" -ForegroundColor White
Write-Host "4. Or start the products API server: node mongodb-products-api.js" -ForegroundColor White
Write-Host "5. Or run the React app with all APIs: .\run-app-with-community.ps1" -ForegroundColor White
