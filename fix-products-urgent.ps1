# Emergency Fix for Products API - Builds and restarts the server
Write-Host "Starting emergency fix for Products API..." -ForegroundColor Red

# Kill any running Node.js processes
Write-Host "Stopping any existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Ensure MongoDB is running
Write-Host "Ensuring MongoDB is running..." -ForegroundColor Yellow
docker-compose up -d mongodb

# Wait for MongoDB to initialize
Write-Host "Waiting for MongoDB to start up..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Build server code
Write-Host "Building server code..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\server"
npm run build

# Start the server
Write-Host "`nStarting server with emergency fixes..." -ForegroundColor Green
Write-Host "The server will start in this terminal window. To exit, press Ctrl+C." -ForegroundColor Yellow
npm run dev
