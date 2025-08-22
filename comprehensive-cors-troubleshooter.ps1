# comprehensive-cors-troubleshooter.ps1
# Complete CORS and API troubleshooter for the wingrox community API

Write-Host "=== Community API CORS Comprehensive Troubleshooter ===" -ForegroundColor Magenta
Write-Host "This script will help diagnose and fix CORS issues with the community API" -ForegroundColor Cyan

# Check for running processes on port 3001
$portCheck = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($portCheck) {
    $processId = (Get-NetTCPConnection -LocalPort 3001).OwningProcess
    $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    Write-Host "PORT 3001 IS IN USE" -ForegroundColor Yellow -BackgroundColor DarkGray
    Write-Host "Process: $($processInfo.ProcessName) (PID: $processId)" -ForegroundColor Yellow
    
    $terminateProcess = Read-Host "Do you want to terminate this process to free up port 3001? (y/n)"
    if ($terminateProcess -eq 'y') {
        Stop-Process -Id $processId -Force
        Write-Host "Process terminated" -ForegroundColor Green
    } else {
        Write-Host "Process left running. Port conflict will need to be resolved manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Port 3001 is available" -ForegroundColor Green
}

# Check for Node.js installation
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✕ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# List all potential API server files
Write-Host "`nAvailable API server implementations:" -ForegroundColor Cyan
$apiFiles = Get-ChildItem -Path . -Filter "*.js" | Where-Object {
    $_.Name -like "*api*.js" -or $_.Name -like "*community*.js" -or $_.Name -like "*server*.js"
}

foreach ($file in $apiFiles) {
    # Check if the file contains CORS-related code
    $fileContent = Get-Content $file.FullName -Raw
    $hasCors = $fileContent -match "cors|Access-Control-Allow-Origin"
    
    if ($hasCors) {
        Write-Host "  [CORS] $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [NO CORS] $($file.Name)" -ForegroundColor Red
    }
}

# Recommended API server
$recommendedApi = "direct-emergency-cors-api.js"
if (Test-Path $recommendedApi) {
    Write-Host "`nRecommended API server: $recommendedApi" -ForegroundColor Green
} else {
    Write-Host "`nRecommended API server not found: $recommendedApi" -ForegroundColor Red
    exit 1
}

# Check if the React app is running
$reactPortCheck = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($reactPortCheck) {
    $processId = (Get-NetTCPConnection -LocalPort 3000).OwningProcess
    $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    Write-Host "`nReact App Status: RUNNING" -ForegroundColor Green
    Write-Host "Process: $($processInfo.ProcessName) (PID: $processId)" -ForegroundColor Green
} else {
    Write-Host "`nReact App Status: NOT RUNNING" -ForegroundColor Yellow
    Write-Host "The React app should be running on port 3000" -ForegroundColor Yellow
    
    $startReactApp = Read-Host "Do you want to start the React app? (y/n)"
    if ($startReactApp -eq 'y') {
        Write-Host "Starting React app..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit -Command cd ../ ; npm start"
    }
}

# Start the recommended API server
Write-Host "`nStarting the CORS-enabled API server..." -ForegroundColor Cyan

$startServer = Read-Host "Start the recommended API server ($recommendedApi)? (y/n)"
if ($startServer -eq 'y') {
    # If there's already a process on port 3001, try to stop it
    if ($portCheck) {
        try {
            Stop-Process -Id $processId -Force
            Write-Host "Stopped existing process on port 3001" -ForegroundColor Green
        } catch {
            Write-Host "Failed to stop existing process on port 3001" -ForegroundColor Red
            exit 1
        }
    }
    
    # Start the API server in a new window
    Start-Process powershell -ArgumentList "-NoExit -Command node $recommendedApi"
    Write-Host "API server started in a new window" -ForegroundColor Green
    
    # Wait a moment for the server to start
    Write-Host "Waiting for server to initialize..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3
    
    # Verify the server is running
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        Write-Host "API server health check: $($response.status)" -ForegroundColor Green
        Write-Host "CORS enabled: $($response.corsEnabled)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to connect to API server" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Open the browser-based test tool
$openTestTool = Read-Host "`nOpen the browser-based API test tool? (y/n)"
if ($openTestTool -eq 'y') {
    $testToolPath = "cors-test-tool.html"
    if (Test-Path $testToolPath) {
        Write-Host "Opening browser test tool..." -ForegroundColor Cyan
        Invoke-Item $testToolPath
    } else {
        Write-Host "Test tool not found: $testToolPath" -ForegroundColor Red
    }
}

# Show instructions
Write-Host "`n=== CORS TROUBLESHOOTING GUIDE ===" -ForegroundColor Magenta
Write-Host "If you're still experiencing CORS issues, follow these steps:" -ForegroundColor Cyan

Write-Host "`n1. Verify the API server is running" -ForegroundColor White
Write-Host "   Check that http://localhost:3001/health returns a valid response" -ForegroundColor Gray

Write-Host "`n2. Verify CORS headers in API responses" -ForegroundColor White
Write-Host "   Use the browser test tool or check network tab for:" -ForegroundColor Gray
Write-Host "   - Access-Control-Allow-Origin: * or http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Access-Control-Allow-Methods: GET, POST, OPTIONS, etc." -ForegroundColor Gray
Write-Host "   - Access-Control-Allow-Headers: Content-Type, Authorization, etc." -ForegroundColor Gray

Write-Host "`n3. Test the API directly in browser console" -ForegroundColor White
Write-Host "   Open your browser console and run:" -ForegroundColor Gray
Write-Host "   fetch('http://localhost:3001/api/community/segments').then(r => r.json()).then(console.log)" -ForegroundColor DarkCyan

Write-Host "`n4. Check browser network tab for CORS errors" -ForegroundColor White
Write-Host "   Look for failed requests with status 'blocked by CORS policy'" -ForegroundColor Gray
Write-Host "   If OPTIONS requests are failing, the preflight check isn't working" -ForegroundColor Gray

Write-Host "`n5. Try an alternative API path" -ForegroundColor White
Write-Host "   If /api/community/segments fails, try /emergency/community/segments" -ForegroundColor Gray

Write-Host "`nGood luck fixing your CORS issues!" -ForegroundColor Green
