# PowerShell script to test the integrated Community API endpoints

Write-Host "🧪 Testing Community API Integration..." -ForegroundColor Cyan

# Install test dependencies if needed
Write-Host "📦 Checking for required dependencies..." -ForegroundColor Cyan
$npmOutput = npm list axios chalk 2>&1
$needsInstall = $LASTEXITCODE -ne 0

if ($needsInstall) {
    Write-Host "📥 Installing required dependencies..." -ForegroundColor Yellow
    npm install --no-save axios chalk
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies. Please run 'npm install axios chalk' manually." -ForegroundColor Red
        exit 1
    }
}

# Navigate to the server plugins directory
cd "$PSScriptRoot\server\plugins"

# Check if server is running
Write-Host "🔍 Checking if server is running..." -ForegroundColor Cyan
$serverRunning = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "✅ Server is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Server does not appear to be running at http://localhost:3000" -ForegroundColor Red
    Write-Host "Please start the server before running this test script." -ForegroundColor Yellow
    
    $startServer = Read-Host "Would you like to start the server now? (y/n)"
    if ($startServer -eq "y") {
        Write-Host "🚀 Starting server..." -ForegroundColor Cyan
        
        # Starting server in a new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"
        
        Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10  # Give the server some time to start
        $serverRunning = $true
    } else {
        exit 1
    }
}

if ($serverRunning) {
    # Run the test script
    Write-Host "🧪 Running Community API tests..." -ForegroundColor Cyan
    node test-community-api.js

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tests completed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Some tests failed. Please check the output above." -ForegroundColor Red
    }
}

# Return to the original directory
cd $PSScriptRoot
