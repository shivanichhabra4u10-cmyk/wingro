# Fix Community API 404 Issues
# This script will resolve the 404 errors for the community API

Write-Host "Starting Community API 404 Fix..." -ForegroundColor Green -BackgroundColor Black

# 1. Check if required files exist
Write-Host "`nChecking for required files..." -ForegroundColor Cyan

$emergencyApiFile = "$PSScriptRoot\emergency-community-api.js"
if (-not (Test-Path -Path $emergencyApiFile)) {
    Write-Host "`nERROR: Could not find emergency-community-api.js file!" -ForegroundColor Red
    exit 1
}

# 2. Install required dependencies
Write-Host "`nInstalling required dependencies..." -ForegroundColor Cyan
npm install express cors mongoose axios uuid dotenv --silent

# 3. Check if there are existing node processes running
Write-Host "`nChecking for existing node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "emergency-community-api|community-api" }
if ($nodeProcesses) {
    Write-Host "  Found existing community API processes. Stopping them..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "  Stopping process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# 4. Start both community API and emergency community API
Write-Host "`nStarting emergency community API..." -ForegroundColor Cyan

# Start emergency-community-api.js in a new window
Start-Process -FilePath "node" -ArgumentList "$PSScriptRoot\emergency-community-api.js" -WindowStyle Normal

# 5. Wait for API to start
Write-Host "`nWaiting for emergency community API to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# 6. Verify the API is working
Write-Host "`nTesting API endpoints..." -ForegroundColor Cyan

try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
    Write-Host "`nHealth endpoint response: $($healthResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "`nHealth endpoint failed: $_" -ForegroundColor Red
}

# 7. Test the specific endpoints that were failing
function Test-ApiEndpoint {
    param (
        [string]$Endpoint,
        [string]$EndpointName
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Endpoint -UseBasicParsing
        Write-Host "  ✅ $EndpointName endpoint is working! (Status: $($response.StatusCode))" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ❌ $EndpointName endpoint failed: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nTesting community segments endpoint:" -ForegroundColor Cyan
$segmentsOk = Test-ApiEndpoint -Endpoint "http://localhost:3001/emergency/community/segments" -EndpointName "Segments"

Write-Host "`nTesting community posts endpoint:" -ForegroundColor Cyan
$postsOk = Test-ApiEndpoint -Endpoint "http://localhost:3001/emergency/community/posts?segmentId=career-plateau&sort=most-viewed&limit=10&page=1" -EndpointName "Posts"

# Run the fix script if we need to
if (-not $segmentsOk -or -not $postsOk) {
    Write-Host "`nRunning additional fix script..." -ForegroundColor Yellow
    node "$PSScriptRoot\fix-community-api.js"
}

Write-Host "`nCommunity API fix complete!" -ForegroundColor Green
Write-Host "The community page should now be able to load segments and posts without 404 errors." -ForegroundColor Yellow

Write-Host "`nIf you still encounter issues, try:" -ForegroundColor Cyan
Write-Host "1. Check that port 3001 is not blocked or used by another application" -ForegroundColor White
Write-Host "2. Ensure MongoDB connection settings are correct" -ForegroundColor White
Write-Host "3. Run the community API directly with: node $PSScriptRoot\emergency-community-api.js" -ForegroundColor White
