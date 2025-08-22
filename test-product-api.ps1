# Script to test the Products API
Write-Host "Testing Products API Endpoints..." -ForegroundColor Cyan

# Define the base URL
$baseUrl = "http://localhost:3001"

function Test-Endpoint {
    param (
        [string]$Endpoint,
        [string]$Method = "GET",
        [string]$Description
    )
    
    Write-Host "`nTesting: $Description" -ForegroundColor Yellow
    Write-Host "Endpoint: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Endpoint -Method $Method -TimeoutSec 5 -ErrorAction Stop
        $statusCode = $response.StatusCode
        Write-Host "✓ Success! Status: $statusCode" -ForegroundColor Green
        
        # Try to parse response content
        try {
            $content = $response.Content | ConvertFrom-Json
            Write-Host "Response: $($content | ConvertTo-Json -Depth 1 -Compress)" -ForegroundColor Gray
        } catch {
            Write-Host "Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "✗ Failed! Status: $statusCode" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 1: Server health check
Test-Endpoint -Endpoint "$baseUrl/health" -Method "GET" -Description "Server health check"

# Test 2: Products API via main server
Test-Endpoint -Endpoint "$baseUrl/api/products" -Method "GET" -Description "Main Products API"

# Test 3: Products API direct endpoint
Test-Endpoint -Endpoint "$baseUrl/products" -Method "GET" -Description "Direct Products endpoint"

# Test 4: Products API via emergency server
Test-Endpoint -Endpoint "$baseUrl/api/emergency/products" -Method "GET" -Description "Emergency Products API"

Write-Host "`nAPI Testing Complete!" -ForegroundColor Cyan

Write-Host "`nReminder: To start the standalone Products API server, run:" -ForegroundColor Magenta
Write-Host ".\start-products-api.ps1" -ForegroundColor Yellow

Write-Host "`nTo start the emergency Products API server, run:" -ForegroundColor Magenta
Write-Host ".\start-emergency-api.ps1" -ForegroundColor Yellow

Write-Host "`nTo start the main application, run:" -ForegroundColor Magenta
Write-Host ".\start-app.ps1" -ForegroundColor Yellow
