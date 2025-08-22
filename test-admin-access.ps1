<# 
.SYNOPSIS
Tests the admin-only access to master data pages in WinGrox AI

.DESCRIPTION
This script tests the admin-only access to Products and Marketplace pages in the WinGrox AI application.
#>

Write-Host "WinGrox AI - Admin Access Test Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Set admin token for testing
$adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA"

# Check if the application is running
$isRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $isRunning = $true
    }
} catch {
    $isRunning = $false
}

if (-not $isRunning) {
    Write-Host "The WinGrox AI application is not running. Starting it now..." -ForegroundColor Yellow
    
    # Start the application in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File .\start-app.ps1"
    
    # Wait for the application to start
    Write-Host "Waiting for the application to start..." -ForegroundColor Gray
    $startTime = Get-Date
    $timeout = 60 # Seconds
    $isRunning = $false
    
    while (-not $isRunning -and ((Get-Date) - $startTime).TotalSeconds -lt $timeout) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $isRunning = $true
                Write-Host "Application started successfully!" -ForegroundColor Green
            }
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $isRunning) {
        Write-Host "Failed to start the application within the timeout period." -ForegroundColor Red
        exit 1
    }
}

# Test the admin access protection
Write-Host "`nTesting Admin Access Protection..." -ForegroundColor Cyan

Write-Host "`nScenario 1: Non-admin user attempts to access Products page" -ForegroundColor Yellow
Write-Host "1. Clear any existing auth tokens from localStorage" -ForegroundColor Gray
Write-Host "2. Try to navigate to /products" -ForegroundColor Gray
Write-Host "3. Verify you get redirected to the access-denied page" -ForegroundColor Gray

Write-Host "`nScenario 2: Non-admin user attempts to access Marketplace page" -ForegroundColor Yellow
Write-Host "1. Clear any existing auth tokens from localStorage" -ForegroundColor Gray
Write-Host "2. Try to navigate to /marketplace" -ForegroundColor Gray
Write-Host "3. Verify you get redirected to the access-denied page" -ForegroundColor Gray

Write-Host "`nScenario 3: Admin user accesses Products page" -ForegroundColor Yellow
Write-Host "1. Login with admin credentials" -ForegroundColor Gray
Write-Host "2. Navigate to /products" -ForegroundColor Gray
Write-Host "3. Verify you can access and see the admin panel" -ForegroundColor Gray

Write-Host "`nScenario 4: Admin user accesses Marketplace page" -ForegroundColor Yellow
Write-Host "1. Login with admin credentials" -ForegroundColor Gray
Write-Host "2. Navigate to /marketplace" -ForegroundColor Gray
Write-Host "3. Verify you can access and see the coach admin panel" -ForegroundColor Gray

# Open the browser for manual testing
Start-Process "http://localhost:3000/products"

Write-Host "`nTest script completed. Browser opened for manual testing." -ForegroundColor Green
Write-Host "Note: For development purposes, the admin check might be set to true by default." -ForegroundColor Yellow
Write-Host "      In production, make sure the AdminProtected component is properly enforcing access control." -ForegroundColor Yellow
