# This script starts the direct emergency community API server
# It specifically addresses the /emergency/community/posts 404 error

Write-Host "🚨 Starting Direct Emergency Community API Server" -ForegroundColor Yellow
Write-Host "This server will specifically fix the 404 error for the community posts endpoint" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Kill any process that might be using port 3001
Write-Host "Checking for existing processes on port 3001..." -ForegroundColor Yellow
$processesUsingPort = netstat -ano | findstr :3001
if ($processesUsingPort) {
    $processesUsingPort | ForEach-Object {
        $processId = $_.Split(" ")[-1]
        if ($processId -match "^\d+$") {
            Write-Host "Killing process $processId using port 3001..." -ForegroundColor Yellow
            try {
                taskkill /PID $processId /F | Out-Null
                Write-Host "✓ Process $processId killed" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to kill process $processId" -ForegroundColor Red
            }
        }
    }
}

# Run the emergency community API server
$scriptPath = "$PSScriptRoot\direct-emergency-community-api.js"

if (Test-Path $scriptPath) {
    Write-Host "✓ Found API script at $scriptPath" -ForegroundColor Green
    
    try {
        # Check if express module is installed
        node -e "require('express')" 2>$null
        Write-Host "✓ Express module is installed" -ForegroundColor Green
    } catch {
        Write-Host "Installing express module..." -ForegroundColor Yellow
        npm install express cors --no-fund --no-audit
    }

    Write-Host ""
    Write-Host "🚀 Starting Direct Emergency Community API Server..." -ForegroundColor Green
    Write-Host "Community posts will be available at: http://localhost:3001/emergency/community/posts" -ForegroundColor Cyan
    Write-Host ""
    
    # Start the server
    node $scriptPath
} else {
    Write-Host "❌ API script not found at $scriptPath" -ForegroundColor Red
    Write-Host "Please make sure the direct-emergency-community-api.js file exists in the workspace" -ForegroundColor Yellow
    exit 1
}
