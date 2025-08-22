# Fix Products API Issues Script
Write-Host "Fixing Products API Issues..." -ForegroundColor Green

# 1. Ensure MongoDB is running
Write-Host "Step 1: Ensuring MongoDB is running..." -ForegroundColor Cyan
docker-compose up -d mongodb

# 2. Wait for MongoDB to be ready
Write-Host "Step 2: Waiting for MongoDB to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# 3. Initialize Products data
Write-Host "Step 3: Initializing product data in MongoDB..." -ForegroundColor Yellow
node init-products.js

# 4. Test API
Write-Host "`nStep 4: Testing API endpoints..." -ForegroundColor Yellow
node api-health-test.js

Write-Host "`nFix process completed. Please verify the API now works correctly." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Magenta
Write-Host "1. Restart the server: cd server && npm run dev" -ForegroundColor White
Write-Host "2. Restart the client: cd client && npm start" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000/products to verify functionality" -ForegroundColor White
