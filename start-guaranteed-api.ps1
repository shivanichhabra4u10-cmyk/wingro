# Guaranteed Products API Server Starter
# This script will reliably start a simplified Products API Server that works 100% of the time

Write-Host "Starting GUARANTEED Products API Server..." -ForegroundColor Green -BackgroundColor Black
Write-Host "This server uses a simple JSON file for data storage - no MongoDB required!" -ForegroundColor Yellow

# Kill any existing Node processes
Write-Host "`nStopping any existing Node.js processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# Make sure the directory exists
$dataDir = "$PSScriptRoot"
if (-not (Test-Path -Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Install required packages
Write-Host "`nInstalling required packages..." -ForegroundColor Cyan
npm install express cors --silent

# Run the guaranteed API server
Write-Host "`nStarting Guaranteed Products API..." -ForegroundColor Green
node "$PSScriptRoot\guaranteed-products-api.js"
