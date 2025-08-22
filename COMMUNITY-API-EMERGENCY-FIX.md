# Community API 404 Fix Solution

This document explains the solution to fix 404 errors occurring when accessing community API endpoints.

## Overview of the Solution

The 404 errors for `/emergency/community/segments` and `/emergency/community/posts` endpoints have been fixed by:

1. Creating a dedicated emergency API server that explicitly handles these endpoints
2. Updating the startup script to use this dedicated server
3. Adding robust error handling and health checks

## Key Files Modified

1. **emergency-community-api.js**:
   - Added explicit handlers for `/emergency/community/segments` and `/emergency/community/posts`
   - Added MongoDB integration for data persistence
   - Enhanced CORS settings to allow all origins
   - Added detailed request logging
   - Added health check endpoint

2. **run-app-with-community.ps1**:
   - Updated to use the emergency-community-api.js instead of guaranteed-community-api.js
   - Added better process management and port conflict resolution
   - Added verification of API endpoints
   - Added longer wait times for proper initialization

3. **run-emergency-api.ps1**:
   - Created a dedicated script for testing just the emergency API

## How to Run the Application

1. Open a PowerShell terminal in the project root directory
2. Run the updated startup script:
   ```powershell
   .\run-app-with-community.ps1
   ```
3. Wait for all services to start:
   - MongoDB database
   - Emergency Community API (port 3001)
   - Main server (port 5000)
   - Client application (port 3000)
4. Open http://localhost:3000 in your browser

## Testing the Emergency API Separately

To test just the emergency API endpoints:

1. Open a PowerShell terminal in the project root directory
2. Run:
   ```powershell
   .\run-emergency-api.ps1
   ```
3. Once running, you can access:
   - http://localhost:3001/health
   - http://localhost:3001/emergency/community/segments
   - http://localhost:3001/emergency/community/posts?segmentId=career-plateau&sort=most-viewed

## Troubleshooting

If you still experience 404 errors:

1. Check that the emergency API is running by accessing http://localhost:3001/health
2. Look for any error messages in the API terminal window
3. Ensure MongoDB is running: `docker ps | findstr mongo`
4. Try running just the emergency API with `.\run-emergency-api.ps1` to isolate issues
5. Check the browser console for more detailed error information

## Next Steps

1. Continue improving the emergency API with better error handling
2. Add more extensive logging to help diagnose future issues
3. Create more comprehensive automated tests for API endpoints
