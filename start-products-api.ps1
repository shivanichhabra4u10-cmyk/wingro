# Standalone Products API Server Starter
Write-Host "Starting Standalone Products API Server..." -ForegroundColor Magenta -BackgroundColor White
Write-Host "This is a dedicated server ONLY for product management" -ForegroundColor Yellow

# Kill any existing Node processes
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# Ensure MongoDB is running
Write-Host "`nStarting MongoDB container..." -ForegroundColor Cyan
docker-compose up -d mongodb

# Wait for MongoDB to initialize
Write-Host "Waiting for MongoDB to initialize (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Navigate to products-api directory
cd $PSScriptRoot\products-api

# Start the API with fixed community routes
Write-Host "`nStarting Products API with fixed Community routes..." -ForegroundColor Green
node index.js
Set-Location -Path "$PSScriptRoot\products-api"

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
    npm install
}

# Run the API server
Write-Host "`nStarting Standalone Products API..." -ForegroundColor Green
node index.js
