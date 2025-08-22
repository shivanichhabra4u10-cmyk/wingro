# Fix React App Chunk Loading Errors
Write-Host "Fixing React App Chunk Loading Errors" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Move to client directory
cd client

# Clean React cache
Write-Host "`nStep 1: Cleaning React cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force -Path .\node_modules\.cache -ErrorAction SilentlyContinue

# Delete the build directory
Write-Host "`nStep 2: Removing build directory..." -ForegroundColor Cyan
Remove-Item -Recurse -Force -Path .\build -ErrorAction SilentlyContinue

# Update specific problematic packages
Write-Host "`nStep 3: Updating lodash package explicitly..." -ForegroundColor Cyan
npm install --save lodash@latest

# Build the project to ensure cache is refreshed
Write-Host "`nStep 4: Building the project for production to validate assets..." -ForegroundColor Cyan
$env:GENERATE_SOURCEMAP = "false"
npm run build

# Clean development server cache and restart
Write-Host "`nStep 5: Starting development server with clean cache..." -ForegroundColor Cyan
Write-Host "This will start the React development server..." -ForegroundColor Yellow

# Export environment variables
$env:REACT_APP_API_URL = "http://localhost:3001"
$env:PORT = "3000"
$env:BROWSER = "none" # Prevent browser from opening automatically

# Start the development server with a clean cache
npm start
