# MongoDB Startup Script
# This script will ensure MongoDB is running and properly connected

Write-Host "Starting MongoDB..." -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green

# Check if MongoDB is already running
Write-Host "`nStep 1: Checking if MongoDB service is running..." -ForegroundColor Yellow

# Check if MongoDB is installed as a Windows service
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService -ne $null) {
    # MongoDB is installed as a service
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ MongoDB service is already running!" -ForegroundColor Green
    } else {
        # Try to start MongoDB service
        Write-Host "MongoDB service is not running. Attempting to start service..." -ForegroundColor Cyan
        Start-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        
        if ((Get-Service -Name "MongoDB").Status -eq "Running") {
            Write-Host "✅ Successfully started MongoDB service!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start MongoDB as a service." -ForegroundColor Red
            Write-Host "Trying alternative methods..." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "MongoDB is not installed as a Windows service." -ForegroundColor Yellow
    Write-Host "Trying to start MongoDB using Docker..." -ForegroundColor Cyan
    
    # Try to use Docker to start MongoDB
    $dockerCheck = docker --version 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker is available. Checking for MongoDB container..." -ForegroundColor Cyan
        
        # Check if MongoDB container exists
        $mongoContainer = docker ps -a --filter "name=mongodb" --format "{{.Names}}" 2>&1
        
        if ($mongoContainer -eq "mongodb") {
            # Container exists, check if it's running
            $isRunning = docker ps --filter "name=mongodb" --format "{{.Names}}" 2>&1
            
            if ($isRunning -eq "mongodb") {
                Write-Host "✅ MongoDB Docker container is already running!" -ForegroundColor Green
            } else {
                # Start the existing container
                Write-Host "Starting existing MongoDB Docker container..." -ForegroundColor Cyan
                docker start mongodb
                Write-Host "✅ MongoDB Docker container started!" -ForegroundColor Green
            }
        } else {
            # Create and start a new container
            Write-Host "Creating and starting MongoDB Docker container..." -ForegroundColor Cyan
            docker run --name mongodb -d -p 27017:27017 mongo:latest
            Write-Host "✅ MongoDB Docker container created and started!" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Docker is not available." -ForegroundColor Red
        
        # Try using the MongoDB Memory Server as a fallback
        Write-Host "Trying to use MongoDB Memory Server as a fallback..." -ForegroundColor Cyan
        
        # Check if the package is installed
        $npmListResult = npm list mongodb-memory-server 2>&1
        
        if ($npmListResult -match "mongodb-memory-server") {
            Write-Host "MongoDB Memory Server is installed. Starting it..." -ForegroundColor Cyan
            
            if (Test-Path -Path "run-mongodb-memory.js") {
                # Run the MongoDB Memory Server script
                Write-Host "Starting MongoDB Memory Server..." -ForegroundColor Cyan
                Write-Host "After this script completes, run 'node run-mongodb-memory.js' to start the MongoDB Memory Server" -ForegroundColor Yellow
                Write-Host "-------------------------------------------------------------------" -ForegroundColor Yellow
                Write-Host "Keep the MongoDB Memory Server terminal window open while working with the app." -ForegroundColor Yellow
                Write-Host "Leave the MongoDB Memory Server running in a separate terminal." -ForegroundColor Yellow
                
                Exit 0
            } else {
                # Create the MongoDB Memory Server script
                Write-Host "Creating MongoDB Memory Server script..." -ForegroundColor Cyan
                
                $script = @'
// MongoDB Memory Server Script
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

console.log('Starting MongoDB Memory Server...');

async function startServer() {
  // Create MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'wingrox_db',
      port: 27017
    }
  });
  
  const uri = mongoServer.getUri();
  console.log(`MongoDB Memory Server running at: ${uri}`);
  console.log('Keep this terminal window open while using the app!');
  
  // Connect to the MongoDB instance
  await mongoose.connect(uri);
  console.log('Successfully connected to MongoDB Memory Server');
  
  // Keep the process running
  console.log('MongoDB is now ready to use!');
  console.log('Press Ctrl+C to stop the MongoDB Memory Server');
  
  // Handle process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
    process.exit(0);
  });
}

startServer().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});
'@
                
                Set-Content -Path "run-mongodb-memory.js" -Value $script
                
                Write-Host "✅ MongoDB Memory Server script created!" -ForegroundColor Green
                Write-Host "Run 'node run-mongodb-memory.js' to start the MongoDB Memory Server" -ForegroundColor Yellow
                
                # Install MongoDB Memory Server if not already installed
                npm install --save-dev mongodb-memory-server
                
                Exit 0
            }
        } else {
            Write-Host "Installing MongoDB Memory Server..." -ForegroundColor Cyan
            npm install --save-dev mongodb-memory-server
            
            Write-Host "✅ MongoDB Memory Server installed!" -ForegroundColor Green
            Write-Host "Run this script again to set up the MongoDB Memory Server" -ForegroundColor Yellow
            
            Exit 0
        }
    }
}

# Verify MongoDB connection
Write-Host "`nStep 2: Verifying MongoDB connection..." -ForegroundColor Yellow

$verificationScript = @'
const mongoose = require('mongoose');

async function checkConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wingrox_db', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

checkConnection();
'@

Set-Content -Path "check-mongodb.js" -Value $verificationScript

$result = node check-mongodb.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB is running and accessible!" -ForegroundColor Green
    Write-Host "`nMongoDB is ready to use with your application." -ForegroundColor Green
    Write-Host "Connection URL: mongodb://localhost:27017/wingrox_db" -ForegroundColor Cyan
} else {
    Write-Host "❌ Could not connect to MongoDB. Please check your MongoDB installation." -ForegroundColor Red
    Write-Host "Try running 'node run-mongodb-memory.js' in a separate terminal window." -ForegroundColor Yellow
}

# Clean up the verification script
Remove-Item -Path "check-mongodb.js" -Force
