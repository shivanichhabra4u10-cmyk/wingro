# Run the community API integration verification

Write-Host "🔍 Verifying Community API Integration..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check if axios is installed
try {
    node -e "require('axios')" 2>$null
    Write-Host "✓ Axios module is installed" -ForegroundColor Green
} catch {
    Write-Host "Installing axios module..." -ForegroundColor Yellow
    npm install axios --no-fund --no-audit
    Write-Host "✓ Axios module installed" -ForegroundColor Green
}

# Run the verification script
Write-Host "`nRunning community API integration verification..." -ForegroundColor Cyan
Write-Host "This will test all community API endpoints to ensure they're properly integrated." -ForegroundColor Cyan
Write-Host "Make sure the server is running with .\run-permanent-community-api.ps1 first." -ForegroundColor Yellow
Write-Host "`nPress any key to continue or Ctrl+C to cancel..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`nStarting verification..." -ForegroundColor Green
node verify-community-integration.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Verification script completed." -ForegroundColor Green
} else {
    Write-Host "`n❌ Verification script encountered errors." -ForegroundColor Red
    Write-Host "Check the output above for details." -ForegroundColor Yellow
}
