# Fix Products API 404 Issues
# This script will resolve the 404 errors for the product API

Write-Host "Starting Products API 404 Fix..." -ForegroundColor Green -BackgroundColor Black

# 1. Kill any existing Node processes
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# 2. Check if guaranteed-products-api.js exists
$apiFile = "$PSScriptRoot\guaranteed-products-api.js"
if (-not (Test-Path -Path $apiFile)) {
    Write-Host "`nERROR: Could not find guaranteed-products-api.js file!" -ForegroundColor Red
    exit 1
}

# 3. Install required dependencies
Write-Host "`nInstalling required dependencies..." -ForegroundColor Cyan
npm install express cors --silent

# 4. Start the guaranteed products API server
Write-Host "`nStarting guaranteed products API server..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "$PSScriptRoot\guaranteed-products-api.js" -WindowStyle Hidden

Write-Host "`nProducts API server started successfully!" -ForegroundColor Green
Write-Host "The API endpoints should now be available at: http://localhost:3001/api/products" -ForegroundColor Yellow

# 5. Test the API endpoint
Write-Host "`nTesting API endpoint..." -ForegroundColor Cyan
Start-Sleep -Seconds 2 # Give the server time to start

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/products" -UseBasicParsing
    Write-Host "API TEST SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Status code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response length: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "API TEST FAILED: $_" -ForegroundColor Red
    Write-Host "`nRecommendations:" -ForegroundColor Yellow
    Write-Host "1. Try running the API server directly: node $PSScriptRoot\guaranteed-products-api.js" -ForegroundColor Yellow
    Write-Host "2. Check if port 3001 is already in use with: netstat -ano | findstr :3001" -ForegroundColor Yellow
    Write-Host "3. Ensure you have the required npm packages with: npm install express cors" -ForegroundColor Yellow
}

Write-Host "`nDone! The frontend application should now be able to connect to the products API." -ForegroundColor Green
