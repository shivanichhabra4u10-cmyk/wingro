Write-Host "Testing Community API Endpoints" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"
$endpoints = @(
    "/health",
    "/api/community/segments",
    "/community/segments",
    "/emergency/community/segments",
    "/api/community/posts",
    "/community/posts",
    "/emergency/community/posts"
)

foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$endpoint"
    Write-Host "Testing: $url" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
        Write-Host "✅ SUCCESS! Status code: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ FAILED! Status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Test complete!" -ForegroundColor Cyan
