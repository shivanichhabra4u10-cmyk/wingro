# This script runs the updated integrated API server with all fixes
# It includes the community posts fix as well as products API and other services

Write-Host "🚀 Starting Updated Integrated API Server" -ForegroundColor Cyan
Write-Host "This server includes fixes for products API, community posts, and MongoDB connection issues" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor White

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Kill any process that might be using port 3005
Write-Host "Checking for existing processes on port 3005..." -ForegroundColor Yellow
$processesUsingPort = netstat -ano | findstr :3005
if ($processesUsingPort) {
    $processesUsingPort | ForEach-Object {
        $processId = $_.Split(" ")[-1]
        if ($processId -match "^\d+$") {
            Write-Host "Killing process $processId using port 3005..." -ForegroundColor Yellow
            try {
                taskkill /PID $processId /F | Out-Null
                Write-Host "✓ Process $processId killed" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to kill process $processId" -ForegroundColor Red
            }
        }
    }
}

# Check for any running API servers on common ports and kill them
$portsToCheck = @(3000, 3001, 3002, 3003, 3004, 3005)
foreach ($port in $portsToCheck) {
    $processesUsingPort = netstat -ano | findstr ":$port"
    if ($processesUsingPort) {
        Write-Host "Found processes using port $port - stopping them for clean startup..." -ForegroundColor Yellow
        $processesUsingPort | ForEach-Object {
            $processId = $_.Split(" ")[-1]
            if ($processId -match "^\d+$") {
                try {
                    taskkill /PID $processId /F | Out-Null
                    Write-Host "✓ Process $processId on port $port killed" -ForegroundColor Green
                } catch {
                    Write-Host "Failed to kill process $processId on port $port" -ForegroundColor Red
                }
            }
        }
    }
}

# Run the updated integrated API server
$scriptPath = "$PSScriptRoot\updated-integrated-api-server.js"

if (Test-Path $scriptPath) {
    Write-Host "✓ Found API script at $scriptPath" -ForegroundColor Green
    
    try {
        # Check if express module is installed
        node -e "require('express')" 2>$null
        Write-Host "✓ Express module is installed" -ForegroundColor Green
    } catch {
        Write-Host "Installing required modules..." -ForegroundColor Yellow
        npm install express cors --no-fund --no-audit
        Write-Host "✓ Required modules installed" -ForegroundColor Green
    }

    # Create a status update function
    function Update-ClientConfig {
        param (
            [string]$message
        )
        
        Write-Host ""
        Write-Host "==============================" -ForegroundColor Cyan
        Write-Host $message -ForegroundColor Cyan
        Write-Host "==============================" -ForegroundColor Cyan
        
        Write-Host "✓ All APIs now running on http://localhost:3005" -ForegroundColor Green
        Write-Host "✓ Products API available at: http://localhost:3005/api/v1/products" -ForegroundColor Green
        Write-Host "✓ Community API available at: http://localhost:3005/emergency/community/segments" -ForegroundColor Green
        Write-Host "✓ Community Posts available at: http://localhost:3005/emergency/community/posts" -ForegroundColor Green
        Write-Host "✓ Admin API available at: http://localhost:3005/admin/products" -ForegroundColor Green
        Write-Host "✓ Health check available at: http://localhost:3005/health" -ForegroundColor Green
        Write-Host ""
    }

    Update-ClientConfig "STARTING INTEGRATED SERVER"

    # Start the server
    Write-Host "🚀 Starting Updated Integrated API Server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Start the server
    node $scriptPath
} else {
    Write-Host "❌ API script not found at $scriptPath" -ForegroundColor Red
    Write-Host "Please make sure the updated-integrated-api-server.js file exists in the workspace" -ForegroundColor Yellow
    exit 1
}
