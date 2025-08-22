# Run Full Application End-to-End
# This script starts all needed services for a complete end-to-end test:
# 1. MongoDB database
# 2. Main server with fixed community routes
# 3. Client application
# 4. Guaranteed Community API as backup

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "WINGROX-AI FULL APPLICATION LAUNCHER" -ForegroundColor Cyan -BackgroundColor White
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "This script will start all components of the application"
Write-Host "for a complete end-to-end test of the community functionality."
Write-Host

# Kill any existing node processes to avoid port conflicts
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Check if MongoDB is installed and running
Write-Host "Ensuring MongoDB is running..." -ForegroundColor Yellow
try {
    # Simple MongoDB connection test
    $testResult = Invoke-Expression 'node -e "const { MongoClient } = require(''mongodb''); const client = new MongoClient(''mongodb://localhost:27017'', { serverSelectionTimeoutMS: 2000 }); client.connect().then(() => { console.log(''MongoDB is running!''); client.close(); process.exit(0); }).catch(err => { console.error(''MongoDB connection failed'', err); process.exit(1); });"'
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Starting MongoDB with Docker..." -ForegroundColor Yellow
        docker-compose up -d mongodb
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "Unable to check MongoDB status automatically. Assuming it needs to be started..." -ForegroundColor Yellow
    docker-compose up -d mongodb
    Start-Sleep -Seconds 5
}

# Create .env file if it doesn't exist
$envPath = "$PSScriptRoot\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating default .env file..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wingrox_db
JWT_SECRET=your-secret-key-for-development-only
BYPASS_AUTH=true
"@ | Set-Content $envPath
}

# Create .env file in server directory if it doesn't exist
$serverEnvPath = "$PSScriptRoot\server\.env"
if (-not (Test-Path $serverEnvPath)) {
    Write-Host "Creating default server/.env file..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wingrox_db
JWT_SECRET=your-secret-key-for-development-only
BYPASS_AUTH=true
"@ | Set-Content $serverEnvPath
}

# Install dependencies if needed
Write-Host "Checking for missing dependencies..." -ForegroundColor Yellow
$deps = @("express", "mongoose", "cors", "mongodb", "uuid", "jsonwebtoken")
foreach ($dep in $deps) {
    npm list $dep --depth=0 > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing $dep..." -ForegroundColor Cyan
        npm install $dep
    }
}

# Start the guaranteed Community API (which persists to MongoDB)
Write-Host "`n[1/3] Starting Guaranteed Community API..." -ForegroundColor Green

# Kill any existing process on port 3001
try {
    $processesUsingPort = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processesUsingPort) {
        foreach ($processId in $processesUsingPort) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.Name) (PID: $processId) that is using port 3001" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
} catch {
    Write-Host "Error checking for processes on port 3001: $_" -ForegroundColor Yellow
}

# Make sure required dependencies are installed for the emergency API
$apiDeps = @("express", "mongoose", "cors", "mongodb", "uuid")
foreach ($dep in $apiDeps) {
    npm list $dep --depth=0 > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing $dep for API server..." -ForegroundColor Cyan
        npm install $dep --no-save
    }
}

# We'll use the emergency-community-api.js file which has dedicated emergency endpoints
Write-Host "Starting Emergency Community API server..." -ForegroundColor Cyan

# Verify the emergency API file exists
if (-not (Test-Path "$PSScriptRoot\emergency-community-api.js")) {
    Write-Host "ERROR: emergency-community-api.js file not found!" -ForegroundColor Red
    exit 1
}

# Check for critical emergency routes in the API file
try {
    $apiContent = Get-Content -Path "$PSScriptRoot\emergency-community-api.js" -Raw -ErrorAction Stop
    if (-not ($apiContent.Contains('/emergency/community/segments') -and $apiContent.Contains('/emergency/community/posts'))) {
        Write-Host "WARNING: emergency-community-api.js is missing required emergency routes!" -ForegroundColor Red
        Write-Host "Please check the file content." -ForegroundColor Red
        
        # Ask user if they want to continue
        Write-Host "`nThe emergency-community-api.js file appears to be missing required routes." -ForegroundColor Red
        Write-Host "Do you want to continue anyway? (Y/N)" -ForegroundColor Cyan -NoNewline
        $continueAnyway = Read-Host " "
        
        if ($continueAnyway -ne "Y" -and $continueAnyway -ne "y") {
            Write-Host "Aborting startup process. Please fix the emergency-community-api.js file." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Verified: Emergency routes found in emergency-community-api.js" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking API file: $_" -ForegroundColor Red
}

# Start the emergency community API
$communityApiProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot' ; node emergency-community-api.js" -WindowStyle Normal -PassThru
Write-Host "Emergency Community API started (Process ID: $($communityApiProcess.Id))" -ForegroundColor Green
Write-Host "Emergency API endpoints available at:"
Write-Host "  - http://localhost:3001/health" -ForegroundColor White
Write-Host "  - http://localhost:3001/emergency/community/segments" -ForegroundColor White
Write-Host "  - http://localhost:3001/emergency/community/posts" -ForegroundColor White
Write-Host "Waiting for Emergency API to initialize..."

# Wait longer for the API to fully initialize
Start-Sleep -Seconds 5

# Wait and verify the API is actually running
$apiRunning = $false
$attempts = 0
$maxAttempts = 8

while (-not $apiRunning -and $attempts -lt $maxAttempts) {
    $attempts++
    Start-Sleep -Seconds 3
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $apiRunning = $true
            Write-Host "✅ API is running and responding to health checks!" -ForegroundColor Green
            
            # Also verify emergency endpoints
            try {
                $emergencyResponse = Invoke-WebRequest -Uri "http://localhost:3001/emergency/community/segments" -UseBasicParsing -TimeoutSec 5
                if ($emergencyResponse.StatusCode -eq 200) {
                    Write-Host "✅ Emergency segments endpoint is working properly!" -ForegroundColor Green
                }
            } catch {
                Write-Host "❌ Emergency segments endpoint is NOT working! Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
                Write-Host "   This will cause 404 errors in the client!" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "Attempt $attempts: Community API not yet ready... ($($_.Exception.Message))" -ForegroundColor Yellow
    }
}

if (-not $apiRunning) {
    Write-Host "❌ WARNING: Could not confirm Community API is running. The client will likely have errors!" -ForegroundColor Red
    Write-Host "Continuing anyway, but expect 404 errors in the browser console..." -ForegroundColor Yellow
    
    # Ask user if they want to continue
    Write-Host "`nThe Community API does not appear to be running correctly." -ForegroundColor Red
    Write-Host "Do you want to continue with the startup process anyway? (Y/N)" -ForegroundColor Cyan -NoNewline
    $continueAnyway = Read-Host " "
    
    if ($continueAnyway -ne "Y" -and $continueAnyway -ne "y") {
        Write-Host "Aborting startup process. Please check the Community API server logs." -ForegroundColor Red
        exit
    }
    
    Write-Host "Continuing with startup process despite API issues..." -ForegroundColor Yellow
}

# Kill any existing process on port 5000
try {
    $processesUsingPort = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processesUsingPort) {
        foreach ($processId in $processesUsingPort) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.Name) (PID: $processId) that is using port 5000" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
} catch {
    Write-Host "Error checking for processes on port 5000: $_" -ForegroundColor Yellow
}

# Start the main server
Write-Host "`n[2/3] Starting Main Server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\server' ; npm run dev" -WindowStyle Normal -PassThru
Write-Host "Main Server started (Process ID: $($serverProcess.Id))"
Write-Host "Server available at: http://localhost:5000"
Write-Host "Waiting for server to initialize..."
Start-Sleep -Seconds 8

# Kill any existing process on port 3000
try {
    $processesUsingPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processesUsingPort) {
        foreach ($processId in $processesUsingPort) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.Name) (PID: $processId) that is using port 3000" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
} catch {
    Write-Host "Error checking for processes on port 3000: $_" -ForegroundColor Yellow
}

# Start the client application
Write-Host "`n[3/3] Starting Client Application..." -ForegroundColor Green
$clientProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\client' ; npm start" -WindowStyle Normal -PassThru
Write-Host "Client Application started (Process ID: $($clientProcess.Id))"
Write-Host "Client will be available at: http://localhost:3000"

Write-Host "`n=====================================================" -ForegroundColor Green
Write-Host "✅ ALL COMPONENTS STARTED SUCCESSFULLY" -ForegroundColor Green -BackgroundColor White
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "📱 Client Application: http://localhost:3000"
Write-Host "🖥️ Main Server API: http://localhost:5000"
Write-Host "🛡️ Backup Community API: http://localhost:3001"

# Add verification section
Write-Host "`n=====================================================" -ForegroundColor Cyan
Write-Host "VERIFICATION STEPS" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser"
Write-Host "2. Navigate to the Community section"
Write-Host "3. Create a post and verify it persists after refresh"
Write-Host "4. To manually verify API endpoints, try these URLs:"
Write-Host "   - http://localhost:3001/health (should return status)"
Write-Host "   - http://localhost:3001/emergency/community/segments (should return segments)"
Write-Host "   - http://localhost:3001/emergency/community/posts (should return posts)"
Write-Host "5. Run the health check script to verify API endpoints:"
Write-Host "   > node check-community-api-health.js"

Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
Write-Host "- If you see 404 errors in the console, run the health check script:"
Write-Host "  > node check-community-api-health.js"
Write-Host "- Ensure MongoDB is running: docker ps | findstr mongo"
Write-Host "- Check if all services started successfully in their respective terminal windows"
Write-Host "- See the COMPLETE-COMMUNITY-API-FIX.md or END-TO-END-COMMUNITY-TESTING.md files for more details"

Write-Host "`nRun the health check script now? (Y/N)" -ForegroundColor Cyan -NoNewline
$runHealthCheck = Read-Host " "

if ($runHealthCheck -eq "Y" -or $runHealthCheck -eq "y") {
    Write-Host "`nRunning health check script..." -ForegroundColor Cyan
    node check-community-api-health.js
}
Write-Host "🗄️ MongoDB: mongodb://localhost:27017/wingrox_db"
Write-Host
Write-Host "To test community functionality:"
Write-Host "1. Go to http://localhost:3000"
Write-Host "2. Navigate to the Community page"
Write-Host "3. Create posts and verify they persist in MongoDB"
Write-Host
Write-Host "Press Ctrl+C to stop all processes when finished"

# Keep the script running
try {
    Write-Host "Monitoring processes. Press Ctrl+C to exit..." -ForegroundColor Yellow
    # Check process status every 5 seconds
    while ($true) {
        if ($communityApiProcess.HasExited) {
            Write-Host "WARNING: Community API process has stopped!" -ForegroundColor Red
        }
        if ($serverProcess.HasExited) {
            Write-Host "WARNING: Server process has stopped!" -ForegroundColor Red
        }
        if ($clientProcess.HasExited) {
            Write-Host "WARNING: Client process has stopped!" -ForegroundColor Red
        }
        Start-Sleep -Seconds 5
    }
} finally {
    # Cleanup when the script is interrupted
    Write-Host "`nShutting down all processes..." -ForegroundColor Yellow
    if (!$communityApiProcess.HasExited) { Stop-Process -Id $communityApiProcess.Id -Force -ErrorAction SilentlyContinue }
    if (!$serverProcess.HasExited) { Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue }
    if (!$clientProcess.HasExited) { Stop-Process -Id $clientProcess.Id -Force -ErrorAction SilentlyContinue }
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}
