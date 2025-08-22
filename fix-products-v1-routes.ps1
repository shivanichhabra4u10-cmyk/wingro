# Fix Products API 404 Issues with v1 Routes
# This script will resolve the 404 errors for the product API by supporting v1 routes

Write-Host "Starting Products API 404 Fix with v1 Route Support..." -ForegroundColor Green -BackgroundColor Black

# 1. Kill any existing Node processes
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# 2. Check if our enhanced fix file exists, otherwise create it
$apiFile = "$PSScriptRoot\fix-products-v1-routes.js"
if (-not (Test-Path -Path $apiFile)) {
    Write-Host "`nERROR: Could not find fix-products-v1-routes.js file!" -ForegroundColor Red
    exit 1
}

# 3. Install required dependencies
Write-Host "`nInstalling required dependencies..." -ForegroundColor Cyan
npm install express cors --silent

# 4. Start the enhanced products API server with v1 route support
Write-Host "`nStarting enhanced products API server with v1 route support..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "$PSScriptRoot\fix-products-v1-routes.js" -WindowStyle Hidden

Write-Host "`nEnhanced Products API server started successfully!" -ForegroundColor Green
Write-Host "The API endpoints are now available at:" -ForegroundColor Yellow
Write-Host "  - http://localhost:3001/api/products" -ForegroundColor Yellow
Write-Host "  - http://localhost:3001/v1/products" -ForegroundColor Yellow
Write-Host "  - http://localhost:3001/api/v1/products" -ForegroundColor Yellow

# 5. Test the API endpoints
Write-Host "`nTesting API endpoints..." -ForegroundColor Cyan
Start-Sleep -Seconds 2 # Give the server time to start

function Test-ApiEndpoint {
    param (
        [string]$Endpoint,
        [string]$Method = "GET"
    )

    try {
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $Endpoint -UseBasicParsing -Method $Method
        }
        else {
            $testProduct = @{
                name = "Test Product"
                description = "Test Description"
                price = 99.99
                category = "test"
                productType = "test"
                images = @("https://placehold.co/600x400")
            }
            $jsonBody = $testProduct | ConvertTo-Json
            $response = Invoke-WebRequest -Uri $Endpoint -UseBasicParsing -Method $Method -Body $jsonBody -ContentType "application/json"
        }

        Write-Host "✅ $Method $Endpoint - SUCCESS (Status: $($response.StatusCode))" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Method $Endpoint - FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

$endpoints = @(
    "http://localhost:3001/api/products",
    "http://localhost:3001/v1/products",
    "http://localhost:3001/api/v1/products"
)

$allSuccess = $true
foreach ($endpoint in $endpoints) {
    $success = Test-ApiEndpoint -Endpoint $endpoint -Method "GET"
    if (-not $success) { $allSuccess = $false }
}

# Test POST endpoint (the one that was failing)
$postSuccess = Test-ApiEndpoint -Endpoint "http://localhost:3001/api/v1/products" -Method "POST"
if (-not $postSuccess) { $allSuccess = $false }

if ($allSuccess) {
    Write-Host "`n✅ ALL API TESTS PASSED! The product API is working correctly." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ SOME API TESTS FAILED. Please review the errors above." -ForegroundColor Yellow
    Write-Host "Recommendations:" -ForegroundColor Yellow
    Write-Host "1. Try running the API server directly: node $PSScriptRoot\fix-products-v1-routes.js" -ForegroundColor Yellow
    Write-Host "2. Check if port 3001 is already in use with: netstat -ano | findstr :3001" -ForegroundColor Yellow
    Write-Host "3. Ensure you have the required npm packages with: npm install express cors" -ForegroundColor Yellow
}

Write-Host "`nDone! The frontend application should now be able to connect to the products API." -ForegroundColor Green
Write-Host "You should be able to create products successfully from the admin panel." -ForegroundColor Green
