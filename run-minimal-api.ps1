# Most basic script to run the minimal community API
# This should resolve any terminal errors

Write-Host "Starting Minimal Community API" -ForegroundColor Green

# Check if nodejs is installed
try {
    $nodeVersion = node -v
    Write-Host "Found Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if express is installed
try {
    $expressVersion = npm list express --json
    Write-Host "Express module is available" -ForegroundColor Green
} catch {
    Write-Host "Installing express module..." -ForegroundColor Yellow
    npm install express --no-fund
}

# Kill any process using port 3001
$processesUsingPort = netstat -ano | Select-String -Pattern ":3001"
if ($processesUsingPort) {
    $processesUsingPort | ForEach-Object {
        $line = $_ -replace '\s+', ' '
        $parts = $line -split ' '
        $processId = $parts[-1]
        if ($processId -match "^\d+$") {
            Write-Host "Killing process $processId using port 3001" -ForegroundColor Yellow
            taskkill /PID $processId /F
        }
    }
}

# Run the API server
Write-Host "Starting API server..." -ForegroundColor Green
node minimal-community-api.js
