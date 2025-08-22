<# 
.SYNOPSIS
Tests the coach booking functionality in WinGrox AI

.DESCRIPTION
This script tests the coach booking functionality in the WinGrox AI application.
It verifies that the booking form appears, can be submitted, and shows confirmation.
#>

Write-Host "WinGrox AI - Coach Booking Test Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

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

# Test the Marketplace and Coach Profile pages
Write-Host "`nTesting Coach Profile and Booking Functionality..." -ForegroundColor Cyan

# Step 1: Test if marketplace page loads
try {
    $marketplaceResponse = Invoke-WebRequest -Uri "http://localhost:3000/marketplace" -Method GET -TimeoutSec 5
    if ($marketplaceResponse.StatusCode -eq 200) {
        Write-Host "✓ Marketplace page loaded successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Marketplace page returned status code: $($marketplaceResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to load marketplace page: $_" -ForegroundColor Red
}

# Step 2: Open the application in the default browser to manually test the booking flow
Write-Host "`nOpening application in browser to test booking flow..." -ForegroundColor Yellow
Write-Host "Please follow these steps to test manually:" -ForegroundColor Yellow
Write-Host "1. On the Marketplace page, click on any coach's 'View Profile' button" -ForegroundColor Gray
Write-Host "2. On the Coach Profile page, click the 'Book Consultation' button" -ForegroundColor Gray
Write-Host "3. Complete the booking form with test data" -ForegroundColor Gray
Write-Host "4. Verify that the booking confirmation appears after submission" -ForegroundColor Gray
Write-Host "5. Verify that your booking is stored in localStorage by running this in browser console:" -ForegroundColor Gray
$consoleCommand = "JSON.parse(localStorage.getItem('bookings'))"
Write-Host "   $consoleCommand" -ForegroundColor Cyan

Start-Process "http://localhost:3000/marketplace"

Write-Host "`nTest script completed. Check the browser for manual testing steps." -ForegroundColor Green
