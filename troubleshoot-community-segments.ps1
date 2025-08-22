# PowerShell script to test and troubleshoot community segments endpoint

# Colors for output
$Red = [ConsoleColor]::Red
$Green = [ConsoleColor]::Green
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan
$Magenta = [ConsoleColor]::Magenta

Write-Host "🔍 COMMUNITY SEGMENTS API ENDPOINT TEST" -ForegroundColor $Cyan
Write-Host "=======================================`n" -ForegroundColor $Cyan

# Function to test an endpoint
function Test-Endpoint {
    param (
        [string]$BaseUrl,
        [string]$Endpoint,
        [string]$Description
    )
    
    $url = "${BaseUrl}${Endpoint}"
    Write-Host "Testing: $Description" -ForegroundColor $Cyan
    Write-Host "URL: $url" -ForegroundColor $Magenta
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ SUCCESS! Status code: $($response.StatusCode)" -ForegroundColor $Green
            
            # Try to parse and display the response
            try {
                $content = $response.Content | ConvertFrom-Json
                $segmentCount = $content.count -or $content.data.length -or "unknown"
                Write-Host "   Found $segmentCount segments in the response" -ForegroundColor $Green
                return $true
            } catch {
                Write-Host "   Response received but couldn't parse JSON data" -ForegroundColor $Yellow
                Write-Host "   Raw content: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor $Yellow
                return $true
            }
        } else {
            Write-Host "❌ ERROR! Status code: $($response.StatusCode)" -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "❌ FAILED! Error: $($_.Exception.Message)" -ForegroundColor $Red
        return $false
    }
}

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    try {
        $connections = netstat -ano | findstr ":$Port"
        if ($connections) {
            Write-Host "✅ Port $Port is active with the following connections:" -ForegroundColor $Green
            Write-Host $connections -ForegroundColor $Yellow
            return $true
        } else {
            Write-Host "❌ No service is running on port $Port" -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "❌ Error checking port $Port: $($_.Exception.Message)" -ForegroundColor $Red
        return $false
    }
}

# Intro message
Write-Host "`nThis script tests the community segments endpoint on various possible URLs`n" -ForegroundColor $Cyan

# Check if our direct emergency API is running
Write-Host "STEP 1: Checking if emergency community API is running" -ForegroundColor $Cyan
Write-Host "--------------------------------------------------" -ForegroundColor $Cyan

$port3001Active = Test-PortInUse -Port 3001

if (-not $port3001Active) {
    Write-Host "`n🚀 Would you like to start the emergency community API server? (y/n)" -ForegroundColor $Yellow
    $response = Read-Host
    
    if ($response -eq "y") {
        # Check if the server script exists
        $apiScriptPath = "$PSScriptRoot\direct-emergency-community-api.js"
        if (Test-Path $apiScriptPath) {
            Write-Host "`n🚀 Starting emergency community API server..." -ForegroundColor $Cyan
            
            # Start the server in a separate window
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; node '$apiScriptPath'"
            
            # Wait for server to start
            Write-Host "⏳ Waiting for server to start (10 seconds)..." -ForegroundColor $Yellow
            Start-Sleep -Seconds 10
            
            # Check if server started successfully
            $port3001Active = Test-PortInUse -Port 3001
        } else {
            Write-Host "❌ Emergency API script not found at: $apiScriptPath" -ForegroundColor $Red
            Write-Host "Please make sure you've created the direct-emergency-community-api.js file" -ForegroundColor $Yellow
            exit 1
        }
    }
}

# Now test various endpoints
Write-Host "`nSTEP 2: Testing community segments endpoints" -ForegroundColor $Cyan
Write-Host "-----------------------------------------" -ForegroundColor $Cyan

# Test all possible endpoint variations
$endpoints = @(
    @{ BaseUrl = "http://localhost:3001"; Endpoint = "/api/community/segments"; Description = "Direct API - Standard Path" },
    @{ BaseUrl = "http://localhost:3001"; Endpoint = "/community/segments"; Description = "Direct API - Short Path" },
    @{ BaseUrl = "http://localhost:3001"; Endpoint = "/emergency/community/segments"; Description = "Direct API - Emergency Path" },
    @{ BaseUrl = "http://localhost:3005"; Endpoint = "/api/community/segments"; Description = "Integrated API - Standard Path" },
    @{ BaseUrl = "http://localhost:3005"; Endpoint = "/emergency/community/segments"; Description = "Integrated API - Emergency Path" },
    @{ BaseUrl = "http://localhost:3000"; Endpoint = "/api/community/segments"; Description = "Main Server - Standard Path" }
)

$successCount = 0

foreach ($endpoint in $endpoints) {
    $success = Test-Endpoint -BaseUrl $endpoint.BaseUrl -Endpoint $endpoint.Endpoint -Description $endpoint.Description
    if ($success) {
        $successCount++
    }
    Write-Host "-----------------------------------------" -ForegroundColor $Cyan
}

# Summary
Write-Host "`nTEST SUMMARY" -ForegroundColor $Cyan
Write-Host "===========" -ForegroundColor $Cyan
Write-Host "Total tests run: $($endpoints.Count)" -ForegroundColor $Cyan
Write-Host "Successful endpoints: $successCount" -ForegroundColor $(if ($successCount -gt 0) { $Green } else { $Red })
Write-Host "Failed endpoints: $($endpoints.Count - $successCount)" -ForegroundColor $(if ($endpoints.Count - $successCount -eq 0) { $Green } else { $Red })

if ($successCount -eq 0) {
    Write-Host "`n❌ All endpoints failed. Check that the API server is running correctly." -ForegroundColor $Red
    Write-Host "Try running the fix-community-posts-404.ps1 script to start the emergency API server." -ForegroundColor $Yellow
} elseif ($successCount -lt $endpoints.Count) {
    Write-Host "`n⚠️ Some endpoints are working, but not all." -ForegroundColor $Yellow
    Write-Host "Use one of the working endpoints in your application configuration." -ForegroundColor $Yellow
} else {
    Write-Host "`n✅ All endpoints are working correctly!" -ForegroundColor $Green
}
