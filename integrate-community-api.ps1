# PowerShell script to integrate community API into the main server

Write-Host "🔄 Integrating Community API into main server..." -ForegroundColor Cyan

# Navigate to the server plugins directory
cd "$PSScriptRoot\server\plugins"

# Run the integration script with Node.js
node integrate-community-api.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Community API successfully integrated!" -ForegroundColor Green
    Write-Host "📋 The main server now supports all community endpoints" -ForegroundColor Green
    Write-Host "   - /api/community/segments" -ForegroundColor Green
    Write-Host "   - /emergency/community/segments" -ForegroundColor Green
    Write-Host "   - /community/segments" -ForegroundColor Green
    Write-Host "   - /api/community/posts" -ForegroundColor Green
    Write-Host "   - /emergency/community/posts" -ForegroundColor Green
    Write-Host "   - /community/posts" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️ Important: Restart the server for changes to take effect." -ForegroundColor Yellow
    
    # Check if we need to create any data directories
    if (-Not (Test-Path "$PSScriptRoot\server\data")) {
        Write-Host "📁 Creating data directory for community API..." -ForegroundColor Cyan
        New-Item -ItemType Directory -Path "$PSScriptRoot\server\data" -Force | Out-Null
    }
} else {
    Write-Host "❌ Failed to integrate Community API" -ForegroundColor Red
    Write-Host "👉 Please check the error messages above and try again" -ForegroundColor Red
}

# Return to the original directory
cd $PSScriptRoot

Write-Host ""
Write-Host "📌 Next steps:"
Write-Host "   1. Run the main server application"
Write-Host "   2. Test the community endpoints"
Write-Host "   3. Verify that community segments and posts are accessible"
Write-Host ""
