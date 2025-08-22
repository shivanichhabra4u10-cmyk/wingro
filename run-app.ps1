# PowerShell script to start both client and server for WinGroX application
# Created by GitHub Copilot on June 10, 2025
Write-Host "Starting WinGroX Application..." -ForegroundColor Cyan

# Define the paths
$rootPath = $PSScriptRoot
$serverPath = Join-Path -Path $rootPath -ChildPath "server"
$clientPath = Join-Path -Path $rootPath -ChildPath "client"

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $inUse = $false
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $inUse = $true
        $tcpClient.Close()
    } catch {}
    
    return $inUse
}

# Kill any processes using our ports
Write-Host "Checking for processes using ports 3000 and 3001..." -ForegroundColor Yellow
if (Test-PortInUse -Port 3000) {
    Write-Host "Port 3000 is in use. Attempting to free..." -ForegroundColor Yellow
    # Find and kill process using port 3000
    $process3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process3000) {
        $processName = (Get-Process -Id $process3000).ProcessName
        Write-Host "Killing process: $processName (PID: $process3000)" -ForegroundColor Red
        Stop-Process -Id $process3000 -Force
        Start-Sleep -Seconds 2
    }
}

if (Test-PortInUse -Port 3001) {
    Write-Host "Port 3001 is in use. Attempting to free..." -ForegroundColor Yellow
    # Find and kill process using port 3001
    $process3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process3001) {
        $processName = (Get-Process -Id $process3001).ProcessName
        Write-Host "Killing process: $processName (PID: $process3001)" -ForegroundColor Red
        Stop-Process -Id $process3001 -Force
        Start-Sleep -Seconds 2
    }
}

# Create a new job to start the server
Write-Host "Starting server on http://localhost:3001..." -ForegroundColor Green
Start-Job -Name "WinGroXServer" -ScriptBlock {
    param($path)
    Set-Location $path
    npm install
    npm start
} -ArgumentList $serverPath

# Create a new job to start the client
Write-Host "Starting client on http://localhost:3000..." -ForegroundColor Green
Start-Job -Name "WinGroXClient" -ScriptBlock {
    param($path)
    Set-Location $path
    npm install
    npm start
} -ArgumentList $clientPath

# Wait a few seconds to let processes start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Monitor logs from both jobs
Write-Host "`nServer logs:" -ForegroundColor Cyan
Receive-Job -Name "WinGroXServer" -Keep

Write-Host "`nClient logs:" -ForegroundColor Cyan
Receive-Job -Name "WinGroXClient" -Keep

Write-Host "`n----------------------------------------" -ForegroundColor Magenta
Write-Host "Both server and client should be starting now." -ForegroundColor Green
Write-Host "- Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "- Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host "----------------------------------------`n" -ForegroundColor Magenta

Write-Host "Monitoring logs (press Ctrl+C to exit)..." -ForegroundColor Yellow
try {
    while ($true) {
        Write-Host "`nServer logs:" -ForegroundColor Cyan
        Receive-Job -Name "WinGroXServer" -Keep
        
        Write-Host "`nClient logs:" -ForegroundColor Cyan  
        Receive-Job -Name "WinGroXClient" -Keep
        
        Start-Sleep -Seconds 5
    }
} finally {
    # Clean up jobs when script is terminated
    Stop-Job -Name "WinGroXServer" -ErrorAction SilentlyContinue
    Stop-Job -Name "WinGroXClient" -ErrorAction SilentlyContinue
    Remove-Job -Name "WinGroXServer" -Force -ErrorAction SilentlyContinue
    Remove-Job -Name "WinGroXClient" -Force -ErrorAction SilentlyContinue
}
