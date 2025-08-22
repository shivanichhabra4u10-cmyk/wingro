# Start MongoDB and Server
Write-Host "Starting MongoDB container..." -ForegroundColor Cyan
docker-compose up -d mongodb

# Wait for MongoDB to start up
Write-Host "Waiting for MongoDB to initialize (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Move to server directory and start the server
Write-Host "Starting the server..." -ForegroundColor Green
cd $PSScriptRoot
npm run dev
