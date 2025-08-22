# Fix script to run client and server together
# This script resolves the 404 error issue and ensures contact form submission works properly

# Kill any existing node processes to avoid port conflicts
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Make sure MongoDB container is running
Write-Host "Ensuring MongoDB container is running..." -ForegroundColor Yellow
docker-compose up -d mongodb

# Wait for MongoDB to be ready
Write-Host "Waiting for MongoDB to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Start the server first (using npm run dev for better error logging)
Write-Host "`n[1/2] Starting server in development mode..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\server' && npm run dev" -WindowStyle Normal -PassThru

# Wait for server to start up
Write-Host "Waiting for server to initialize (8 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

# Check server is running properly
Write-Host "`nVerifying server is running..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5
    Write-Host "✓ Server health check successful" -ForegroundColor Green
    Write-Host "MongoDB status: $($healthCheck.mongodb)" -ForegroundColor Green
} catch {
    Write-Host "✗ Server health check failed: $_" -ForegroundColor Red
    Write-Host "Try running the server manually with 'cd server && npm run dev'" -ForegroundColor Yellow
}

# Start the client in a new window
Write-Host "`n[2/2] Starting client development server..." -ForegroundColor Blue
$clientProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\client' && npm start" -WindowStyle Normal -PassThru

# Final instructions
Write-Host "`n✓ Services Started:" -ForegroundColor Green
Write-Host "Client URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Server URL: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Contact form endpoints:" -ForegroundColor Yellow
Write-Host "  - Client-side: http://localhost:3000/contact" -ForegroundColor Yellow
Write-Host "  - API endpoint: http://localhost:3001/api/contact" -ForegroundColor Yellow

Write-Host "`nTo test the API directly, run:" -ForegroundColor Magenta
Write-Host "cd server && node test-api-endpoints.js" -ForegroundColor Magenta

Write-Host "`nTo check contacts in MongoDB, run:" -ForegroundColor Magenta
Write-Host "cd server && node check-contacts.js" -ForegroundColor Magenta

Write-Host "`nPress Ctrl+C to stop this script (services will continue running)"
# Wait indefinitely to keep the script running
while ($true) { Start-Sleep -Seconds 1 }
