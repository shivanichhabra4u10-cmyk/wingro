# Integrated API Server Script
# This script runs a single, unified API server that includes all functionality:
# - Main application API
# - Community API
# - Products API

Write-Host "Starting Integrated API Server..." -ForegroundColor Green -BackgroundColor Black

# 1. Check if required files exist
$integratedServerFile = "$PSScriptRoot\integrated-api-server.js"
if (-not (Test-Path -Path $integratedServerFile)) {
    Write-Host "`nERROR: Could not find integrated-api-server.js file!" -ForegroundColor Red
    exit 1
}

# 2. Stop any existing Node processes that might interfere
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
    $_.MainWindowTitle -match "emergency-community-api|community-api|products-api|guaranteed" -or
    $_.CommandLine -match "emergency-community-api|community-api|products-api|guaranteed" 
}
if ($nodeProcesses) {
    Write-Host "Found existing API processes. Stopping them..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "  Stopping process $($_.Id) ($($_.MainWindowTitle))..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# 3. Install required dependencies
Write-Host "`nInstalling required dependencies..." -ForegroundColor Cyan
npm install express cors mongoose fs-extra dotenv --silent

# 4. Start the integrated API server
Write-Host "`nStarting integrated API server..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "$PSScriptRoot\integrated-api-server.js" -WindowStyle Normal

# 5. Wait for server to start
Write-Host "`nWaiting for integrated API server to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# 6. Test server health
Write-Host "`nTesting API server health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
    $healthContent = $healthResponse.Content | ConvertFrom-Json
    
    Write-Host "`n✅ API SERVER IS RUNNING!" -ForegroundColor Green
    Write-Host "  Status: $($healthContent.status)" -ForegroundColor Green
    Write-Host "  Database: $($healthContent.database.status)" -ForegroundColor $(if ($healthContent.database.status -eq "connected") { "Green" } else { "Yellow" })
    
    # Test critical endpoints
    Write-Host "`nTesting critical API endpoints..." -ForegroundColor Cyan
    
    function Test-ApiEndpoint {
        param (
            [string]$Url,
            [string]$Name
        )
        
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
            Write-Host "  ✅ $Name endpoint is working! (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "  ❌ $Name endpoint failed: $_" -ForegroundColor Red
            return $false
        }
    }
    
    # Test community segments endpoint
    Test-ApiEndpoint -Url "http://localhost:3001/api/community/segments" -Name "Community segments"
    Test-ApiEndpoint -Url "http://localhost:3001/emergency/community/segments" -Name "Emergency community segments"
    
    # Test products endpoints
    Test-ApiEndpoint -Url "http://localhost:3001/api/v1/products" -Name "Products API (v1)"
    
    Write-Host "`nIntegrated API server is now running at http://localhost:3001" -ForegroundColor Green
    Write-Host "All APIs are now consolidated in a single server!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Failed to connect to API server: $_" -ForegroundColor Red
    Write-Host "Try running the server directly: node $PSScriptRoot\integrated-api-server.js" -ForegroundColor Yellow
}

Write-Host "`nDone! You can now use the integrated API server for all your backend needs." -ForegroundColor Green
