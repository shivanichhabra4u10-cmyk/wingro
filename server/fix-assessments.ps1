# Fix MongoDB Assessment Records PowerShell Script

# Check if an assessment ID was provided
if ($args.Count -gt 0) {
    $id = $args[0]
    Write-Host "Fixing assessment with ID: $id" -ForegroundColor Cyan
    node fix-mongodb-assessments.js $id
}
else {
    # No ID provided, fix all records
    Write-Host "Fixing all assessment records in the database..." -ForegroundColor Cyan
    node fix-mongodb-assessments.js
}

Write-Host "`nRunning verification to confirm results..." -ForegroundColor Yellow
node verify-assessment-data.js

# If a specific ID was provided, also verify that specific record
if ($args.Count -gt 0) {
    $id = $args[0]
    Write-Host "`nVerifying fixed assessment with ID: $id" -ForegroundColor Cyan
    node verify-assessment-data.js $id
}

Write-Host "`nDone! Your MongoDB records should now have the responseData field." -ForegroundColor Green
