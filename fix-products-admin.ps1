# Comprehensive Fix for Products API and Admin Panel
Write-Host "Starting comprehensive fix for Products API and Admin Panel..." -ForegroundColor Green

# Set directories
$rootDir = $PSScriptRoot
$serverDir = Join-Path -Path $rootDir -ChildPath "server"
$clientDir = Join-Path -Path $rootDir -ChildPath "client"

# Function to check if a process is running on a port
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $connections = netstat -ano | findstr ":$Port"
    return ($connections -ne $null)
}

# Function to stop processes using specific ports
function Stop-ProcessOnPort {
    param (
        [int]$Port
    )
    
    $connections = netstat -ano | findstr ":$Port"
    if ($connections) {
        $connections | ForEach-Object {
            $parts = $_ -split ' +'
            $pid = $parts[-1]
            
            Write-Host "Stopping process with PID $pid on port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# 1. Stop any processes using relevant ports
Write-Host "`nStep 1: Stopping any processes using ports 3000 and 3001..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3000
Stop-ProcessOnPort -Port 3001

# 2. Start MongoDB
Write-Host "`nStep 2: Starting MongoDB..." -ForegroundColor Cyan
docker-compose up -d mongodb
Start-Sleep -Seconds 3  # Give MongoDB time to start

# 3. Fix server-side code
Write-Host "`nStep 3: Building server-side code..." -ForegroundColor Cyan
Set-Location -Path $serverDir
npm run build

# 4. Initialize products in MongoDB
Write-Host "`nStep 4: Initializing product data..." -ForegroundColor Cyan
node init-products.js

# 5. Test the API endpoints
Write-Host "`nStep 5: Testing product API endpoints..." -ForegroundColor Cyan
# Start the server in the background
Start-Job -ScriptBlock {
    Set-Location -Path $using:serverDir
    npm run dev
} | Out-Null

# Wait for server to start
Write-Host "Waiting for server to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run API tests
node test-products-api.js

# 6. Start the client application
Write-Host "`nStep 6: Starting client application..." -ForegroundColor Cyan
Set-Location -Path $clientDir
npm start
