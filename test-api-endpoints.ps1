# Test API endpoints for both products and coaches
Write-Host "Starting API endpoint testing..." -ForegroundColor Cyan

$baseUrls = @(
    "http://localhost:3001/api",
    "http://localhost:3001",
    "http://localhost:3002/api",
    "http://localhost:3002"
)

$endpoints = @(
    "/products",
    "/products?limit=5&page=1",
    "/products?limit=10&page=1&productType=individual",
    "/products?limit=10&page=1&productType=enterprise",
    "/coaches",
    "/coaches?limit=6&page=1",
    "/coaches?specialization=Executive%20Leadership"
)

$totalSuccess = 0
$totalFailed = 0

foreach ($baseUrl in $baseUrls) {
    Write-Host "Testing base URL: $baseUrl" -ForegroundColor Yellow
    
    foreach ($endpoint in $endpoints) {
        $url = "$baseUrl$endpoint"
        Write-Host "  Testing: $url" -NoNewline
        
        try {
            $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200) {
                Write-Host " ✅ SUCCESS ($($response.StatusCode))" -ForegroundColor Green
                $totalSuccess++
            } else {
                Write-Host " ⚠️ UNEXPECTED STATUS ($($response.StatusCode))" -ForegroundColor Yellow
                $totalFailed++
            }
        } catch {
            Write-Host " ❌ FAILED" -ForegroundColor Red
            $totalFailed++
        }
    }
    
    Write-Host ""
}

Write-Host "Testing Summary:" -ForegroundColor Cyan
Write-Host "  Successful endpoints: $totalSuccess" -ForegroundColor Green
Write-Host "  Failed endpoints: $totalFailed" -ForegroundColor $(if ($totalFailed -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "Note: If all endpoints failed, make sure the server is running." -ForegroundColor Yellow
Write-Host "To start the server, run: ./start-services.ps1" -ForegroundColor Yellow
