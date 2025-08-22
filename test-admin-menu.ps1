# Script to test the Admin Menu functionality

Write-Host "=== WinGroX AI Admin Menu Test ===" -ForegroundColor Green

# Set admin token in localStorage for easy testing
$adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQHdpbmdyb3guYWkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTY3MTcwNzE4MjJ9.eyJ1c2VVyZSI6MSwiZXhwIjoxNjcxcDE4MjJ9"

Write-Host "Starting Admin Menu test..." -ForegroundColor Yellow
Write-Host "1. When the app starts, login as admin (admin@wingrox.ai / admin123)" -ForegroundColor Yellow
Write-Host "2. Verify that the Admin menu appears in the navigation" -ForegroundColor Yellow
Write-Host "3. Test all admin pages (/admin, /admin/products, /admin/coaches, /admin/users)" -ForegroundColor Yellow

# Navigate to client directory
Set-Location -Path "$PSScriptRoot\client"

# Start the app in development mode
Write-Host "`nStarting the React app..." -ForegroundColor Cyan
npm start
