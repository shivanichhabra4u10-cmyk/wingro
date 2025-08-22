Write-Host "Starting Community Posts Fix Server..." -ForegroundColor Yellow
Write-Host "This server will handle all community API requests, including post creation" -ForegroundColor Green
Write-Host "Use Ctrl+C to stop the server when done" -ForegroundColor Cyan
Write-Host ""

# Run the fix server
node "$PSScriptRoot\fix-community-posts.js"
