# Script to test the Guaranteed Products API
Write-Host "Testing Guaranteed Products API Endpoints..." -ForegroundColor Cyan

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

# Test 2: Get all products
Test-Endpoint -Endpoint "$baseUrl/api/products" -Method "GET" -Description "Get all products"

# Test 3: Get all individual products
Test-Endpoint -Endpoint "$baseUrl/api/products?productType=individual" -Method "GET" -Description "Get individual products"

# Test 4: Get all enterprise products
Test-Endpoint -Endpoint "$baseUrl/api/products?productType=enterprise" -Method "GET" -Description "Get enterprise products"

Write-Host "`nAPI Testing Complete!" -ForegroundColor Cyan
Write-Host "If all tests pass, the API is working correctly!" -ForegroundColor Green
