# Test MongoDB Products API
# This script will test connectivity to all product API endpoints

Write-Host "Testing MongoDB Products API Endpoints..." -ForegroundColor Green -BackgroundColor Black

$baseUrl = "http://localhost:3001"

function Test-Endpoint {
    param(
        [string]$Method, 
        [string]$Endpoint, 
        [string]$Description,
        [object]$Body = $null
    )
    
    $url = "$baseUrl$Endpoint"
    Write-Host "`n[$Method] $url - $Description" -ForegroundColor Cyan
    
    $params = @{
        Method = $Method
        Uri = $url
        ContentType = 'application/json'
    }
    
    if ($Body) {
        $params.Add('Body', (ConvertTo-Json -InputObject $Body -Depth 10))
    }
    
    try {
        $response = Invoke-RestMethod @params
        Write-Host "✅ Success!" -ForegroundColor Green
        
        if ($PSVersionTable.PSVersion.Major -ge 6) {
            # PowerShell 6+ has good JSON formatting
            $responseJson = ConvertTo-Json -InputObject $response -Depth 3
            Write-Host $responseJson -ForegroundColor Gray
        }
        else {
            # PowerShell 5 and below - just return success message
            Write-Host "Success response received" -ForegroundColor Gray 
        }
        
        return $response
    }
    catch {
        Write-Host "❌ Failed!" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# Test health endpoint
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "Health Check"

# Test get all products
$allProducts = Test-Endpoint -Method "GET" -Endpoint "/api/products" -Description "Get All Products"

# Create new test product
$newProduct = @{
    name = "Test Product $(Get-Random)"
    description = "A test product created by the API test script"
    price = 999
    badge = "New"
    category = "digital"
    productType = "individual"
    images = @("https://placehold.co/600x400/eee/ccc?text=Test+Product")
    features = @("Test Feature 1", "Test Feature 2")
}

$createdProduct = Test-Endpoint -Method "POST" -Endpoint "/api/products" -Description "Create New Product" -Body $newProduct

if ($createdProduct) {
    $productId = $createdProduct.data._id
    
    # Test get product by ID
    Test-Endpoint -Method "GET" -Endpoint "/api/products/$productId" -Description "Get Product by ID"
    
    # Test updating product
    $updateProduct = @{
        name = "Updated Test Product"
        price = 1299
    }
    
    Test-Endpoint -Method "PUT" -Endpoint "/api/products/$productId" -Description "Update Product" -Body $updateProduct
    
    # Test deleting product
    Test-Endpoint -Method "DELETE" -Endpoint "/api/products/$productId" -Description "Delete Product (Soft Delete)"
}

Write-Host "`nAPI Testing Complete!" -ForegroundColor Green
