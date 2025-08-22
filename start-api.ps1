# Simple script to run the guaranteed API
Write-Host "Starting the Guaranteed Community API..." -ForegroundColor Green

# Kill any existing node process on port 3001
$processId = netstat -ano | findstr :3001 | ForEach-Object { ($_ -split '\s+')[5] } | Select-Object -First 1
if ($processId) {
    Write-Host "Killing existing process $processId on port 3001..." -ForegroundColor Yellow
    taskkill /F /PID $processId
}

# Install required dependencies if not already installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check for required dependencies
npm list mongodb > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing MongoDB dependencies..." -ForegroundColor Yellow
    npm install mongodb mongoose uuid
}

# Run the API server
Write-Host "Starting the API server..." -ForegroundColor Green
node guaranteed-community-api.js
