Write-Host "Starting Guaranteed Community API Server with MongoDB Persistence..." -ForegroundColor Green
Write-Host "This server will provide all community endpoints needed by the application." -ForegroundColor Cyan
Write-Host "All posts will be saved to MongoDB for persistence." -ForegroundColor Cyan
Write-Host "Use Ctrl+C to stop the server when finished`n" -ForegroundColor Cyan

# Check if MongoDB is running
try {
    Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
    # Attempt a simple MongoDB connection test
    $testResult = Invoke-Expression 'node -e "const { MongoClient } = require(''mongodb''); const client = new MongoClient(''mongodb://localhost:27017'', { serverSelectionTimeoutMS: 2000 }); client.connect().then(() => { console.log(''MongoDB is running!''); client.close(); process.exit(0); }).catch(err => { console.error(''MongoDB connection failed'', err); process.exit(1); });"'
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "MongoDB is not running or not accessible!" -ForegroundColor Red
        Write-Host "Attempting to start MongoDB using Docker..." -ForegroundColor Yellow
        
        # Try to start MongoDB using Docker
        docker-compose up -d mongodb
        
        # Wait for MongoDB to be ready
        Start-Sleep -Seconds 5
    } else {
        Write-Host "MongoDB is running and accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking MongoDB: $_" -ForegroundColor Red
    Write-Host "Make sure MongoDB is running before proceeding." -ForegroundColor Yellow
}

# Install MongoDB dependency if not already installed
npm list mongodb > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing MongoDB dependencies..." -ForegroundColor Yellow
    npm install mongodb mongoose uuid
}

# Start the server with node
Write-Host "`nStarting guaranteed-community-api.js with MongoDB connection..." -ForegroundColor Green
node "$PSScriptRoot\guaranteed-community-api.js"
