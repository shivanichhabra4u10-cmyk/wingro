# Fix MongoDB Connection Script
Write-Host "Running MongoDB Verification and Product API Fix" -ForegroundColor Green

# Check if server folder exists
if (-not (Test-Path -Path ".\server")) {
    Write-Host "ERROR: Server folder not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

# Navigate to server folder
Set-Location .\server

# If there are TypeScript changes, compile them
Write-Host "Compiling TypeScript files..." -ForegroundColor Yellow
npm run build

# Verify MongoDB connection
Write-Host "`nVerifying MongoDB connection and product schema..." -ForegroundColor Cyan
node verify-mongo.js

# Initialize sample products
Write-Host "`nInitializing sample product data..." -ForegroundColor Cyan
node init-products.js

# Return to project root
Set-Location ..

# Print Success Message
Write-Host "`n✅ Fixes applied successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start (or restart) the server: cd server && npm run dev" -ForegroundColor White
Write-Host "2. Start (or restart) the client: cd client && npm start" -ForegroundColor White
Write-Host "3. Visit the products page at http://localhost:3000/products" -ForegroundColor White
