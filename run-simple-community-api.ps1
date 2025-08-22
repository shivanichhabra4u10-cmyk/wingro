# Simple script to run the final simple community API

Write-Host "Starting Simple Community API Server" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# If port 3001 is in use, stop the process
$processesUsingPort = netstat -ano | findstr :3001
if ($processesUsingPort) {
    Write-Host "Port 3001 is currently in use. Attempting to free it..." -ForegroundColor Yellow
    $processesUsingPort | ForEach-Object {
        $processId = $_.Split(" ")[-1]
        if ($processId -match "^\d+$") {
            Write-Host "Killing process $processId using port 3001..." -ForegroundColor Yellow
            taskkill /PID $processId /F | Out-Null
        }
    }
    Start-Sleep -Seconds 2
}

# Start the API server
Write-Host "Starting API server on port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; node final-simple-community-api.js"

# Wait a few seconds for the server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test if the server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API Server is running successfully!" -ForegroundColor Green
        Write-Host "Available endpoints:" -ForegroundColor Cyan
        Write-Host "- Community segments: http://localhost:3001/api/community/segments" -ForegroundColor Green
        Write-Host "- Emergency segments: http://localhost:3001/emergency/community/segments" -ForegroundColor Green
        Write-Host "- Community posts: http://localhost:3001/api/community/posts" -ForegroundColor Green
        Write-Host "- Emergency posts: http://localhost:3001/emergency/community/posts" -ForegroundColor Green
        
        # Open browser to API home page
        Write-Host "`nOpening API homepage in browser..." -ForegroundColor Cyan
        Start-Process "http://localhost:3001/"
    } else {
        Write-Host "API server returned unexpected status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "Failed to connect to API server. It might still be starting up..." -ForegroundColor Red
    Write-Host "Try accessing http://localhost:3001/ manually in your browser" -ForegroundColor Yellow
}

Write-Host "`nAPI server is running in a separate window. Close that window to stop the server." -ForegroundColor Cyan
