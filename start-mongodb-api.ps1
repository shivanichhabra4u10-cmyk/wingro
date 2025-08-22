# MongoDB Products API Server Starter
# This script will start a Products API Server with MongoDB database storage

Write-Host "Starting MongoDB Products API Server..." -ForegroundColor Green -BackgroundColor Black
Write-Host "This server uses MongoDB for data storage to ensure all product operations are persisted" -ForegroundColor Yellow

# Kill any existing Node processes
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
try {
    Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "No existing Node.js processes found or couldn't stop them" -ForegroundColor Gray
}

# Check if MongoDB is running using a simple connection check
Write-Host "`nChecking MongoDB connection..." -ForegroundColor Cyan
$mongoCheck = node -e "
try {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017', { serverSelectionTimeoutMS: 2000 });
  client.connect().then(() => {
    console.log('MongoDB connection successful');
    process.exit(0);
  }).catch(err => {
    console.error('MongoDB connection failed');
    process.exit(1);
  });
} catch (err) {
  console.error('Error testing MongoDB connection', err);
  process.exit(1);
}
" 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nMongoDB is not running. Attempting to start using Docker..." -ForegroundColor Yellow
    
    # Check if Docker is installed
    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if ($null -eq $docker) {
        Write-Host "Docker is not installed or not in PATH. Please start MongoDB manually." -ForegroundColor Red
        Write-Host "You can run: docker run -d -p 27017:27017 --name mongodb mongo" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if MongoDB container exists
    $containerExists = docker ps -a --filter "name=mongodb" --format "{{.Names}}" 2>$null
    if ($containerExists -eq "mongodb") {
        Write-Host "MongoDB container exists. Starting container..." -ForegroundColor Cyan
        docker start mongodb 2>$null
    } else {
        Write-Host "Creating and starting MongoDB container..." -ForegroundColor Cyan
        docker run -d -p 27017:27017 --name mongodb mongo 2>$null
    }
    
    # Wait for MongoDB to start
    Write-Host "Waiting for MongoDB to start..." -ForegroundColor Cyan
    $retries = 0
    $maxRetries = 10
    $connected = $false
    
    while ($retries -lt $maxRetries -and -not $connected) {
        Start-Sleep -Seconds 2
        $retries++
        
        $mongoCheck = node -e "
        try {
          const { MongoClient } = require('mongodb');
          const client = new MongoClient('mongodb://localhost:27017', { serverSelectionTimeoutMS: 2000 });
          client.connect().then(() => {
            console.log('MongoDB connection successful');
            process.exit(0);
          }).catch(err => {
            console.error('MongoDB connection failed');
            process.exit(1);
          });
        } catch (err) {
          console.error('Error testing MongoDB connection', err);
          process.exit(1);
        }
        " 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            $connected = $true
            Write-Host "MongoDB is now running!" -ForegroundColor Green
        } else {
            Write-Host "Waiting for MongoDB to start... (Attempt $retries/$maxRetries)" -ForegroundColor Yellow
        }
    }
    
    if (-not $connected) {
        Write-Host "Failed to start MongoDB. Please check Docker and start MongoDB manually." -ForegroundColor Red
        Write-Host "API will attempt to start anyway, but database operations may fail." -ForegroundColor Yellow
    }
} else {
    Write-Host "MongoDB is already running" -ForegroundColor Green
}

# Install required packages
Write-Host "`nInstalling required packages..." -ForegroundColor Cyan
npm install express cors mongoose --silent

# Run the MongoDB API server
Write-Host "`nStarting MongoDB Products API..." -ForegroundColor Green
node "$PSScriptRoot\mongodb-products-api.js"
