# Start MongoDB container if it's not already running
Write-Host "Starting MongoDB container..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
Write-Host "Waiting for MongoDB to be ready..."
Start-Sleep -Seconds 5

# Start server (background)
Write-Host "Starting server in one window..."
Start-Process powershell -ArgumentList "-Command cd '$PSScriptRoot\server' && npm run dev"

# Wait for server to start
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 8

# Start client (background)
Write-Host "Starting client in another window..."
Start-Process powershell -ArgumentList "-Command cd '$PSScriptRoot\client' && npm start"

Write-Host "Both client and server should be starting now."
Write-Host "Client: http://localhost:3000"
Write-Host "Server: http://localhost:3001"
Write-Host "MongoDB: mongodb://localhost:27017/wingrox_db"

# Keep this window open
Write-Host "Press Ctrl+C to stop all services."
while ($true) { Start-Sleep -Seconds 1 }
