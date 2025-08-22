# Verify MongoDB Assessment Data

# Run the verification script
Write-Host "Running verification script for assessment data..."
Write-Host "=============================================" -ForegroundColor Cyan

# List all assessments
Write-Host "`nListing all assessments:" -ForegroundColor Green
node verify-assessment-data.js

# If an ID is provided as argument, show details for that assessment
if ($args.Count -gt 0) {
    $id = $args[0]
    Write-Host "`nShowing details for assessment ID: $id" -ForegroundColor Green
    node verify-assessment-data.js $id
}

# Reminder about MongoDB commands
Write-Host "`nUseful MongoDB Shell commands:" -ForegroundColor Yellow
Write-Host "use wingrox" -ForegroundColor DarkCyan
Write-Host "db.individual_assessments.find().pretty()" -ForegroundColor DarkCyan
Write-Host "db.individual_assessments.findOne({email: 'user@example.com'})" -ForegroundColor DarkCyan
Write-Host "db.individual_assessments.updateOne({_id: ObjectId('your-id-here')}, {`$set: {responseData: {answers: {1: 5, 2: 7}}}})" -ForegroundColor DarkCyan
