# MongoDB connection test script
Write-Host "Checking MongoDB connection..."

# Try MongoDB connection using Node.js
$testScript = @"
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/wingrox_db';

console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
"@

$testScriptPath = Join-Path -Path $PWD -ChildPath "temp-mongodb-test.js"
$testScript | Out-File -FilePath $testScriptPath -Encoding utf8

Write-Host "Running MongoDB connection test..."
node $testScriptPath

# Check if MongoDB container is running
Write-Host "`nChecking Docker containers..."
docker ps

# Start MongoDB container if needed
Write-Host "`nStarting MongoDB container if not running..."
cd ..
docker-compose up -d mongodb

# Try to connect to the database again
Write-Host "`nTesting connection again after ensuring container is running..."
cd server
node $testScriptPath

# Update .env file
$envPath = Join-Path -Path $PWD -ChildPath ".env"
$envContent = Get-Content -Path $envPath -Raw
$updatedEnvContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=mongodb://localhost:27017/wingrox_db"
$updatedEnvContent | Out-File -FilePath $envPath -Encoding utf8

Write-Host "`nUpdated .env file with correct MongoDB URI"

# Clean up
Remove-Item -Path $testScriptPath -Force
Write-Host "Diagnostics complete. Try starting your server with 'npm start'"
