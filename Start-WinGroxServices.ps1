#!/usr/bin/env pwsh
# Start-WinGroxServices.ps1
# A comprehensive script to start all WinGrox services with proper error handling

param (
    [switch]$Debug,
    [switch]$WithMongo,
    [switch]$All
)

# Colors for output
$colors = @{
    Success = "Green"
    Error = "Red"
    Info = "Cyan"
    Warning = "Yellow"
    Highlight = "Magenta"
}

function Write-ColorOutput {
    param (
        [string]$Message,
        [string]$Color = $colors.Info
    )
    Write-Host $Message -ForegroundColor $Color
}

function Start-ProcessAsync {
    param (
        [string]$Command,
        [string]$Args,
        [string]$WorkingDirectory,
        [string]$Description
    )
    
    Write-ColorOutput "Starting $Description..." $colors.Info
    
    try {
        $process = Start-Process -FilePath $Command -ArgumentList $Args -WorkingDirectory $WorkingDirectory -PassThru
        
        if ($process) {
            Write-ColorOutput "✓ $Description started (PID: $($process.Id))" $colors.Success
            return $process
        } else {
            Write-ColorOutput "✘ Failed to start $Description" $colors.Error
            return $null
        }
    } catch {
        Write-ColorOutput "✘ Error starting $Description: $_" $colors.Error
        return $null
    }
}

function Test-ApiEndpoint {
    param (
        [string]$Url,
        [string]$Name,
        [int]$MaxRetries = 5,
        [int]$RetryIntervalSec = 3
    )
    
    Write-ColorOutput "Testing $Name endpoint: $Url" $colors.Info
    
    $retry = 0
    $success = $false
    
    while ($retry -lt $MaxRetries -and -not $success) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput "✓ $Name endpoint is available" $colors.Success
                $success = $true
            } else {
                $retry++
                Write-ColorOutput "Attempt $retry/$MaxRetries: $Name endpoint returned status $($response.StatusCode), retrying in ${RetryIntervalSec}s..." $colors.Warning
                Start-Sleep -Seconds $RetryIntervalSec
            }
        } catch {
            $retry++
            Write-ColorOutput "Attempt $retry/$MaxRetries: $Name endpoint not yet available, retrying in ${RetryIntervalSec}s..." $colors.Warning
            Start-Sleep -Seconds $RetryIntervalSec
        }
    }
    
    if (-not $success) {
        Write-ColorOutput "✘ $Name endpoint could not be verified after $MaxRetries attempts" $colors.Error
    }
    
    return $success
}

# ======== Main Script ========
Write-ColorOutput "=== WinGrox Services Startup ===" $colors.Highlight

# Store process references
$processes = @{}

# 1. MongoDB (optional)
if ($WithMongo -or $All) {
    Write-ColorOutput "Starting MongoDB services..." $colors.Info
    # Using Docker for MongoDB
    $processes.mongo = Start-ProcessAsync -Command "docker" -Args "compose up mongodb -d" -WorkingDirectory "." -Description "MongoDB (Docker)"
    
    # Wait for MongoDB to start
    Start-Sleep -Seconds 5
}

# 2. Main Backend Server
Write-ColorOutput "Starting main backend server..." $colors.Info
$serverArgs = "start"
if ($Debug) {
    $serverArgs = "run start-debug"
}

$processes.server = Start-ProcessAsync -Command "npm" -Args $serverArgs -WorkingDirectory "./server" -Description "Main Backend Server"
Start-Sleep -Seconds 2

# 3. Products API (standalone)
$processes.productsApi = Start-ProcessAsync -Command "node" -Args "./products-api/index.js" -WorkingDirectory "." -Description "Products API"
Start-Sleep -Seconds 2

# 4. If All is specified, start the frontend client too
if ($All) {
    $processes.client = Start-ProcessAsync -Command "npm" -Args "start" -WorkingDirectory "./client" -Description "React Frontend"
}

# 5. Test API endpoints
Write-ColorOutput "`nTesting API endpoints..." $colors.Info
$mainApiSuccess = Test-ApiEndpoint -Url "http://localhost:3001/api/health" -Name "Main API"
$productsApiSuccess = Test-ApiEndpoint -Url "http://localhost:3001/api/products" -Name "Products API"
$coachesApiSuccess = Test-ApiEndpoint -Url "http://localhost:3001/api/coaches" -Name "Coaches API"

# Summary
Write-ColorOutput "`n=== WinGrox Services Summary ===" $colors.Highlight

$processes.Keys | ForEach-Object {
    if ($processes[$_]) {
        $status = if ($processes[$_].HasExited) { "Stopped (Exit Code: $($processes[$_].ExitCode))" } else { "Running (PID: $($processes[$_].Id))" }
        Write-ColorOutput "$_: $status" $(if ($processes[$_].HasExited) { $colors.Error } else { $colors.Success })
    } else {
        Write-ColorOutput "$_: Failed to start" $colors.Error
    }
}

Write-ColorOutput "`nAPI Endpoints:" $colors.Info
Write-ColorOutput "Main API: $(if ($mainApiSuccess) { 'Available ✓' } else { 'Unavailable ✗' })" $(if ($mainApiSuccess) { $colors.Success } else { $colors.Error })
Write-ColorOutput "Products API: $(if ($productsApiSuccess) { 'Available ✓' } else { 'Unavailable ✗' })" $(if ($productsApiSuccess) { $colors.Success } else { $colors.Error })
Write-ColorOutput "Coaches API: $(if ($coachesApiSuccess) { 'Available ✓' } else { 'Unavailable ✗' })" $(if ($coachesApiSuccess) { $colors.Success } else { $colors.Error })

# Final notes
Write-ColorOutput "`nTo stop these services, you can:" $colors.Info
Write-ColorOutput " - Use the Stop-Process command with the PIDs listed above" $colors.Info
Write-ColorOutput " - Close this PowerShell window (services will terminate)" $colors.Info
if ($WithMongo -or $All) {
    Write-ColorOutput " - For MongoDB: Run 'docker compose down'" $colors.Info
}

Write-ColorOutput "`nFor testing:" $colors.Highlight
Write-ColorOutput " - API endpoints: ./test-api-endpoints.ps1" $colors.Info
Write-ColorOutput " - Coach profiles: ./test-coach-profile.ps1" $colors.Info
Write-ColorOutput " - Coach booking: ./test-coach-booking.ps1" $colors.Info
Write-ColorOutput " - Admin access: ./test-admin-access.ps1" $colors.Info
