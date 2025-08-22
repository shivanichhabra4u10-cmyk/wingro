# Fix Products API Runtime Errors
# This script will fix "products.map is not a function" runtime errors in the admin interface

Write-Host "Starting Products API Runtime Error Fix..." -ForegroundColor Green -BackgroundColor Black

$frontEndFolder = "$PSScriptRoot\client\src"

# 1. Check if all required files exist
Write-Host "`nChecking for required files..." -ForegroundColor Cyan
$adminProductsFile = "$frontEndFolder\pages\admin\AdminProducts.tsx"
$adminApiFile = "$frontEndFolder\services\adminApi.ts"

if (-not (Test-Path -Path $adminProductsFile)) {
    Write-Host "`nERROR: Could not find AdminProducts.tsx file!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -Path $adminApiFile)) {
    Write-Host "`nERROR: Could not find adminApi.ts file!" -ForegroundColor Red
    exit 1
}

# 2. Create backup files
Write-Host "`nCreating backup files..." -ForegroundColor Cyan
Copy-Item -Path $adminProductsFile -Destination "$adminProductsFile.bak" -Force
Copy-Item -Path $adminApiFile -Destination "$adminApiFile.bak" -Force
Write-Host "Backups created successfully." -ForegroundColor Gray

# 3. Fix fetching function in AdminProducts.tsx
Write-Host "`nFixing fetch products function in AdminProducts.tsx..." -ForegroundColor Cyan
$adminProductsContent = Get-Content -Path $adminProductsFile -Raw
$fixedAdminProductsContent = $adminProductsContent -replace "const data = await productsAdmin\.getAll\(\);[\r\n\s]+setProducts\(data\);", "const response = await productsAdmin.getAll();`n      // Check if the data is wrapped in a 'data' property (API structure)`n      setProducts(response.data || response);"
Set-Content -Path $adminProductsFile -Value $fixedAdminProductsContent -Force

# 4. Create a diagnostic file to check the API response
Write-Host "`nCreating diagnostic script to check the API response format..." -ForegroundColor Cyan
$diagnosticScript = @"
// Check the structure of the products API response
const axios = require('axios');

async function checkProductsAPI() {
  try {
    console.log('Testing API endpoint: http://localhost:3001/api/products');
    const response = await axios.get('http://localhost:3001/api/products');
    
    console.log('\\nAPI Response Status:', response.status);
    console.log('Response Data Type:', typeof response.data);
    console.log('Response Data Keys:', Object.keys(response.data));
    
    if (response.data.data) {
      console.log('\\nProducts are in the "data" property');
      console.log('Products array type:', Array.isArray(response.data.data) ? 'Array' : typeof response.data.data);
      console.log('Number of products:', response.data.data.length);
    } else {
      console.log('\\nProducts are not in a "data" property');
    }
    
    console.log('\\nSample of response:', JSON.stringify(response.data).substring(0, 200) + '...');
  } catch (error) {
    console.error('Error checking API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkProductsAPI();
"@
Set-Content -Path "$PSScriptRoot\check-products-api-format.js" -Value $diagnosticScript -Force

# 5. Restart the frontend application
Write-Host "`nRestarting the frontend application..." -ForegroundColor Green
$npmProcesses = Get-Process npm -ErrorAction SilentlyContinue
if ($npmProcesses) {
    $npmProcesses | ForEach-Object {
        Write-Host "Stopping npm process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
}

# Start the frontend application
Write-Host "`nStarting the React frontend..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "$PSScriptRoot\client" -WindowStyle Hidden

Write-Host "`nProducts API Runtime Error Fix Complete!" -ForegroundColor Green
Write-Host "The frontend application should now be able to display products without errors." -ForegroundColor Yellow
Write-Host "`nIf you still encounter issues, run the diagnostic script with:" -ForegroundColor Cyan
Write-Host "  node check-products-api-format.js" -ForegroundColor White
Write-Host "`nYou can also revert to the backup files if needed." -ForegroundColor Yellow
