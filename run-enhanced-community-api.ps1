# Enhanced Emergency Community API script
# This script starts the enhanced emergency community API server to fix 404 errors

# Text formatting
$RootPath = $PSScriptRoot
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarnColor = "Yellow"

function Write-Header {
    param (
        [string]$Title
    )
    
    Write-Host "`n===================================================" -ForegroundColor $InfoColor
    Write-Host $Title -ForegroundColor $InfoColor
    Write-Host "===================================================" -ForegroundColor $InfoColor
}

Write-Header "🚨 ENHANCED EMERGENCY COMMUNITY API"

# Check if Node.js is installed
Write-Host "`nChecking prerequisites..." -ForegroundColor $InfoColor
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor $SuccessColor
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js first." -ForegroundColor $ErrorColor
    exit 1
}

# Check for express and cors packages
Write-Host "Checking required npm packages..." -ForegroundColor $InfoColor
try {
    node -e "require.resolve('express'); require.resolve('cors')" 2>$null
    Write-Host "✓ Required npm packages are installed" -ForegroundColor $SuccessColor
} catch {
    Write-Host "Installing required packages (express, cors)..." -ForegroundColor $WarnColor
    npm install express cors --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install required packages" -ForegroundColor $ErrorColor
        Write-Host "Try running 'npm install express cors' manually" -ForegroundColor $WarnColor
        exit 1
    }
    Write-Host "✓ Required packages installed successfully" -ForegroundColor $SuccessColor
}

# Kill any process that might be using port 3001
Write-Host "`nChecking for existing processes on port 3001..." -ForegroundColor $InfoColor
$processesUsingPort = netstat -ano | findstr :3001
if ($processesUsingPort) {
    Write-Host "Found active processes on port 3001. Attempting to stop them..." -ForegroundColor $WarnColor
    $processesUsingPort | ForEach-Object {
        $processId = $_.Split(" ")[-1]
        if ($processId -match "^\d+$") {
            Write-Host "Killing process $processId using port 3001..." -ForegroundColor $WarnColor
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Process $processId terminated" -ForegroundColor $SuccessColor
            } catch {
                Write-Host "❌ Failed to kill process $processId. Try closing it manually." -ForegroundColor $ErrorColor
            }
        }
    }
    
    # Double-check if port is now available
    Start-Sleep -Seconds 2
    $stillActive = netstat -ano | findstr :3001
    if ($stillActive) {
        Write-Host "⚠️ Warning: Port 3001 is still in use. The API server might fail to start." -ForegroundColor $WarnColor
    } else {
        Write-Host "✓ Port 3001 is now available" -ForegroundColor $SuccessColor
    }
} else {
    Write-Host "✓ Port 3001 is available" -ForegroundColor $SuccessColor
}

# Check if API script exists
$scriptPath = "$PSScriptRoot\enhanced-emergency-community-api.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ API script not found at: $scriptPath" -ForegroundColor $ErrorColor
    Write-Host "Please make sure the enhanced-emergency-community-api.js file exists in the workspace" -ForegroundColor $WarnColor
    exit 1
}

# Create batch file to run the Node.js server
$batchFilePath = "$env:TEMP\run-emergency-api.bat"
@"
@echo off
cd /d "$PSScriptRoot"
echo Starting Enhanced Emergency Community API...
node "$scriptPath"
pause
"@ | Out-File -FilePath $batchFilePath -Encoding ascii

# Display a success message with endpoints
Write-Header "🚀 STARTING ENHANCED EMERGENCY COMMUNITY API"

Write-Host "`nAPI server script found at:" -ForegroundColor $InfoColor
Write-Host $scriptPath -ForegroundColor $SuccessColor

Write-Host "`n📝 Available endpoints (after server starts):" -ForegroundColor $InfoColor
Write-Host "• API Home: http://localhost:3001/" -ForegroundColor $SuccessColor
Write-Host "• Health check: http://localhost:3001/health" -ForegroundColor $SuccessColor
Write-Host "• Community segments: http://localhost:3001/api/community/segments" -ForegroundColor $SuccessColor
Write-Host "• Community posts: http://localhost:3001/api/community/posts" -ForegroundColor $SuccessColor

Write-Host "`n⚠️ The server will start in a new window." -ForegroundColor $WarnColor
Write-Host "Close that window to stop the server when you're done." -ForegroundColor $WarnColor

Write-Host "`nWould you like to open the API homepage in your browser after starting? (y/n)" -ForegroundColor $InfoColor
$openBrowser = Read-Host
$openBrowserAfter = $openBrowser -eq "y"

# Start the batch file in a new window
Write-Host "`nStarting the API server..." -ForegroundColor $InfoColor
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$batchFilePath`""

# Wait a moment for the server to start
Write-Host "Waiting for server to initialize..." -ForegroundColor $WarnColor
Start-Sleep -Seconds 5

# Check if server is running
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        $healthCheck = $response.Content | ConvertFrom-Json
        
        Write-Header "✅ SERVER STARTED SUCCESSFULLY!"
        Write-Host "• Status: $($healthCheck.status)" -ForegroundColor $SuccessColor
        Write-Host "• Message: $($healthCheck.message)" -ForegroundColor $SuccessColor
        Write-Host "• Timestamp: $($healthCheck.timestamp)" -ForegroundColor $SuccessColor
        if ($healthCheck.uptime) {
            Write-Host "• Uptime: $($healthCheck.uptime) seconds" -ForegroundColor $SuccessColor
        }
    }
} catch {
    Write-Host "`n⚠️ Could not verify if the server started. It might take a moment longer..." -ForegroundColor $WarnColor
    Write-Host "Try accessing http://localhost:3001/ manually in your browser" -ForegroundColor $WarnColor
}

# Open browser if requested
if ($openBrowserAfter) {
    Write-Host "`nOpening API homepage in default browser..." -ForegroundColor $InfoColor
    Start-Process "http://localhost:3001/"
}

Write-Header "API SERVER LAUNCHED"
