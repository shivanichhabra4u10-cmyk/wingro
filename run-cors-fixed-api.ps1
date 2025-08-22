# PowerShell script to run the CORS-fixed community API server

# Color definitions
$Red = [ConsoleColor]::Red
$Green = [ConsoleColor]::Green
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan
$Magenta = [ConsoleColor]::Magenta

Write-Host "`n=========================================" -ForegroundColor $Cyan
Write-Host " 🔄 CORS-FIXED COMMUNITY API LAUNCHER" -ForegroundColor $Cyan
Write-Host "=========================================`n" -ForegroundColor $Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor $Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor $Red
    Write-Host "Please install Node.js and try again" -ForegroundColor $Yellow
    exit 1
}

# Check for existing processes on port 3001
Write-Host "`nChecking for processes using port 3001..." -ForegroundColor $Cyan
$processesUsingPort = netstat -ano | findstr :3001
if ($processesUsingPort) {
    Write-Host "Found processes using port 3001. Stopping them..." -ForegroundColor $Yellow
    $processesUsingPort | ForEach-Object {
        $line = $_ -replace '\s+', ' '
        $parts = $line.Trim().Split(' ')
        if ($parts.Length -gt 4) {
            $processId = $parts[-1]
            if ($processId -match "^\d+$") {
                Write-Host "- Stopping process ID $processId..." -ForegroundColor $Yellow
                try {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "  Process $processId terminated successfully" -ForegroundColor $Green
                } catch {
                    Write-Host "  Failed to stop process $processId. Please close it manually." -ForegroundColor $Red
                }
            }
        }
    }
    
    # Double-check
    Start-Sleep -Seconds 2
    $stillActive = netstat -ano | findstr :3001
    if ($stillActive) {
        Write-Host "❌ WARNING: Port 3001 is still in use. The API server might not start correctly." -ForegroundColor $Red
        Write-Host "Please close any applications using port 3001 and try again." -ForegroundColor $Yellow
    } else {
        Write-Host "✓ Port 3001 is now available" -ForegroundColor $Green
    }
} else {
    Write-Host "✓ Port 3001 is available" -ForegroundColor $Green
}

# Install required npm packages if needed
Write-Host "`nChecking required npm packages..." -ForegroundColor $Cyan
try {
    # Attempt to resolve the required packages
    node -e "require.resolve('express'); require.resolve('cors');" 2>$null
    Write-Host "✓ Required npm packages are installed" -ForegroundColor $Green
} catch {
    Write-Host "Installing required npm packages (express, cors)..." -ForegroundColor $Yellow
    npm install express cors --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install required packages. Please run 'npm install express cors' manually." -ForegroundColor $Red
        exit 1
    }
    Write-Host "✓ Required packages installed successfully" -ForegroundColor $Green
}

# Check if API script exists
$apiScript = "$PSScriptRoot\cors-fixed-community-api.js"
if (-not (Test-Path $apiScript)) {
    Write-Host "❌ ERROR: API script not found at $apiScript" -ForegroundColor $Red
    Write-Host "Please make sure the cors-fixed-community-api.js file exists in this directory" -ForegroundColor $Yellow
    exit 1
}

# Function to check if API is running
function Test-ApiRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

# Create a batch file to run the API
$batchFilePath = "$env:TEMP\run-cors-community-api.bat"
@"
@echo off
cd /d "$PSScriptRoot"
echo Starting CORS-fixed Community API Server...
node "$apiScript"
echo.
echo Server stopped. Press any key to exit.
pause > nul
"@ | Out-File -FilePath $batchFilePath -Encoding ascii

# Start API server
Write-Host "`n🚀 STARTING CORS-FIXED COMMUNITY API SERVER" -ForegroundColor $Magenta
Write-Host "==========================================" -ForegroundColor $Magenta

Write-Host "`nStarting server in a new window..." -ForegroundColor $Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$batchFilePath`""

# Wait for server to start
Write-Host "`nWaiting for API server to initialize..." -ForegroundColor $Yellow
$attempts = 0
$maxAttempts = 10
$apiRunning = $false

while (-not $apiRunning -and $attempts -lt $maxAttempts) {
    $attempts++
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline -ForegroundColor $Yellow
    $apiRunning = Test-ApiRunning
}

Write-Host "`n"

if ($apiRunning) {
    Write-Host "✅ API SERVER STARTED SUCCESSFULLY!" -ForegroundColor $Green
    
    # Get server info
    try {
        $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing | ConvertFrom-Json
        Write-Host "• Status: $($healthResponse.status)" -ForegroundColor $Green
        Write-Host "• Message: $($healthResponse.message)" -ForegroundColor $Green
        Write-Host "• CORS: $(if ($healthResponse.corsConfigured) { 'Configured ✓' } else { 'Not configured ✗' })" -ForegroundColor $(if ($healthResponse.corsConfigured) { $Green } else { $Red })
    } catch {
        # Ignore errors here
    }
    
    Write-Host "`n📋 AVAILABLE ENDPOINTS:" -ForegroundColor $Cyan
    Write-Host "• Homepage: http://localhost:3001/" -ForegroundColor $Green
    Write-Host "• Health check: http://localhost:3001/health" -ForegroundColor $Green
    Write-Host "• Community segments: http://localhost:3001/api/community/segments" -ForegroundColor $Green
    Write-Host "• Community posts: http://localhost:3001/api/community/posts" -ForegroundColor $Green
    
    Write-Host "`n🔒 CORS CONFIGURATION:" -ForegroundColor $Cyan
    Write-Host "This API allows requests from:" -ForegroundColor $Green
    Write-Host "• http://localhost:3000" -ForegroundColor $Green
    Write-Host "• http://127.0.0.1:3000" -ForegroundColor $Green
    Write-Host "• http://localhost:5173" -ForegroundColor $Green
    
    Write-Host "`n📱 WOULD YOU LIKE TO:" -ForegroundColor $Cyan
    Write-Host "1. Open API homepage in browser" -ForegroundColor $Yellow
    Write-Host "2. Test community segments endpoint" -ForegroundColor $Yellow
    Write-Host "3. Exit" -ForegroundColor $Yellow
    
    $choice = Read-Host "`nEnter your choice (1-3)"
    
    if ($choice -eq "1") {
        Start-Process "http://localhost:3001/"
        Write-Host "Opening API homepage in browser..." -ForegroundColor $Cyan
    } elseif ($choice -eq "2") {
        $testResult = Invoke-WebRequest -Uri "http://localhost:3001/api/community/segments" -UseBasicParsing
        $segments = $testResult.Content | ConvertFrom-Json
        
        Write-Host "`n🔍 TEST RESULTS:" -ForegroundColor $Cyan
        Write-Host "Status: $($testResult.StatusCode) $($testResult.StatusDescription)" -ForegroundColor $Green
        Write-Host "Segments found: $($segments.count)" -ForegroundColor $Green
        Write-Host "CORS headers present: $(if ($testResult.Headers['Access-Control-Allow-Origin']) { 'Yes ✓' } else { 'No ✗' })" -ForegroundColor $(if ($testResult.Headers['Access-Control-Allow-Origin']) { $Green } else { $Red })
    }
} else {
    Write-Host "❌ API server did not start properly after $maxAttempts attempts" -ForegroundColor $Red
    Write-Host "Please check the terminal window for any error messages" -ForegroundColor $Yellow
}

Write-Host "`n⚠️ The API server is running in a separate window." -ForegroundColor $Yellow
Write-Host "Close that window when you want to stop the server." -ForegroundColor $Yellow
Write-Host "`n==========================================" -ForegroundColor $Magenta
