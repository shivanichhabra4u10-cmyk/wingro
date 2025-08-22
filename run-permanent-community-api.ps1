# This script implements a permanent fix for the community API
# by properly integrating it into the main server

Write-Host "🔄 Implementing Permanent Community API Integration..." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

# Navigate to the server directory
cd "$PSScriptRoot\server"

# Check if TypeScript is installed
$tscInstalled = $null
try {
    $tscInstalled = Get-Command tsc -ErrorAction SilentlyContinue
} catch {
    $tscInstalled = $null
}

if (-not $tscInstalled) {
    Write-Host "Installing TypeScript globally..." -ForegroundColor Yellow
    npm install -g typescript
    Write-Host "TypeScript installed." -ForegroundColor Green
}

# Check that the source files exist
if (-not (Test-Path "src\app.ts")) {
    Write-Host "❌ Error: src\app.ts not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "src\routes\community.routes.ts")) {
    Write-Host "❌ Error: src\routes\community.routes.ts not found!" -ForegroundColor Red
    exit 1
}

# Compile TypeScript to JavaScript
Write-Host "Compiling TypeScript code..." -ForegroundColor Cyan
tsc

# Check if compilation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript compilation failed!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ TypeScript compilation successful." -ForegroundColor Green
}

# Verify that the dist files were created
if (-not (Test-Path "dist\app.js")) {
    Write-Host "❌ Error: dist\app.js not found after compilation!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting server with integrated community API..." -ForegroundColor Cyan

# Start the server
node dist/app.js
