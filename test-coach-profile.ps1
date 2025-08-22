#!/usr/bin/env pwsh
# Test-CoachProfile.ps1 - Test the coach profile functionality

Write-Host "Testing coach profile functionality..." -ForegroundColor Cyan

$baseUrls = @(
    "http://localhost:3001/api",
    "http://localhost:3001",
    "http://localhost:3002/api",
    "http://localhost:3002"
)

$coachIds = @("1", "2", "3") # Sample coach IDs to test

foreach ($baseUrl in $baseUrls) {
    Write-Host "Testing base URL: $baseUrl" -ForegroundColor Yellow
    
    # Test getting all coaches first
    $allCoachesUrl = "$baseUrl/coaches"
    Write-Host "  Testing: $allCoachesUrl" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $allCoachesUrl -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ SUCCESS ($($response.StatusCode))" -ForegroundColor Green
            
            # Try to extract real coach IDs from response
            try {
                $responseData = $response.Content | ConvertFrom-Json
                if ($responseData.data -and $responseData.data.data -and $responseData.data.data.Length -gt 0) {
                    # Use actual coach IDs from response
                    $coachIds = @()
                    foreach ($coach in $responseData.data.data) {
                        if ($coach._id) {
                            $coachIds += $coach._id
                        }
                    }
                    
                    Write-Host "  Found ${$coachIds.Count} actual coach IDs to test" -ForegroundColor Green
                }
            } catch {
                Write-Host "  Could not extract coach IDs from response, using default test IDs" -ForegroundColor Yellow
            }
        } else {
            Write-Host " ⚠️ UNEXPECTED STATUS ($($response.StatusCode))" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ❌ FAILED" -ForegroundColor Red
    }
    
    # Now test individual coach endpoints
    foreach ($coachId in $coachIds) {
        $coachUrl = "$baseUrl/coaches/$coachId"
        Write-Host "  Testing: $coachUrl" -NoNewline
        
        try {
            $response = Invoke-WebRequest -Uri $coachUrl -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200) {
                Write-Host " ✅ SUCCESS ($($response.StatusCode))" -ForegroundColor Green
                
                # Check if we got proper coach data
                try {
                    $coachData = $response.Content | ConvertFrom-Json
                    if ($coachData.data -and $coachData.data.data -and $coachData.data.data.name) {
                        Write-Host "    Coach: $($coachData.data.data.name)" -ForegroundColor Cyan
                    }
                } catch {
                    Write-Host "    Could not parse coach data" -ForegroundColor Yellow
                }
            } else {
                Write-Host " ⚠️ UNEXPECTED STATUS ($($response.StatusCode))" -ForegroundColor Yellow
            }
        } catch {
            Write-Host " ❌ FAILED" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

Write-Host "`nCoach Profile Testing Complete" -ForegroundColor Cyan
Write-Host "To test in browser, navigate to: http://localhost:3000/coach/1" -ForegroundColor Cyan
