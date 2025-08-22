# URGENT SCRIPT TO FIX MONGODB ASSESSMENT DATA

# Check if an assessment ID was provided
$id = $null
if ($args.Count -gt 0) {
    $id = $args[0]
}

# Show banner
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "FIXING MONGODB ASSESSMENT DATA - URGENT" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor Cyan

# Run the fix script
if ($id) {
    Write-Host "Fixing specific assessment with ID: $id" -ForegroundColor Yellow
    node fix-mongodb.js $id
} else {
    Write-Host "Fixing all assessments..." -ForegroundColor Yellow
    node fix-mongodb.js
}

Write-Host "`nFIX COMPLETED!" -ForegroundColor Green
Write-Host "If you still don't see responseData in MongoDB, please restart your server" -ForegroundColor Yellow
