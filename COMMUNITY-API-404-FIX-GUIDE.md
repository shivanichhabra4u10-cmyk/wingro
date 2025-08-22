# Community API 404 Fix Implementation

This document explains the changes that have been made to fix the 404 errors occurring when accessing community API endpoints.

## Summary of Changes

1. **Updated `run-app-with-community.ps1` script**:
   - Added port checking and process cleanup to prevent port conflicts
   - Increased wait times between service startups
   - Added health check verification
   - Added better error handling and diagnostics
   - Improved verification steps and troubleshooting guidance

2. **Enhanced `guaranteed-community-api.js`**:
   - Added a dedicated `/health` endpoint for API health verification
   - Ensured all required endpoints are properly defined including:
     - `/emergency/community/segments`
     - `/emergency/community/posts`
     - `/api/community/segments`
     - `/api/community/posts`

3. **Created `check-community-api-health.js`**:
   - A diagnostic script that tests all critical API endpoints
   - Provides clear success/failure reporting
   - Gives troubleshooting advice for failed endpoints

## Running the Application

To run the full application with all components:

1. Open a PowerShell terminal in the project root directory
2. Run the following command:
   ```powershell
   .\run-app-with-community.ps1
   ```
3. Wait for all services to start (MongoDB, API server, main server, client)
4. Once all services are running, open http://localhost:3000 in your browser

## Verifying API Health

If you encounter 404 errors in the console, you can verify the API health:

1. Open a new terminal in the project root directory
2. Run the health check script:
   ```powershell
   node check-community-api-health.js
   ```
3. This will test all critical endpoints and report any issues

## Manual Endpoint Testing

You can also manually test the endpoints in your browser:

- Health check: http://localhost:3001/health
- Community segments: 
  - http://localhost:3001/emergency/community/segments
  - http://localhost:3001/api/community/segments
- Community posts:
  - http://localhost:3001/emergency/community/posts
  - http://localhost:3001/api/community/posts

## Troubleshooting

If you still experience issues:

1. Ensure MongoDB is running:
   ```powershell
   docker ps | findstr mongo
   ```

2. Check the terminal windows for any error messages in:
   - The Community API terminal
   - The Main Server terminal
   - The Client terminal

3. Try restarting the entire process by first stopping any running Node.js processes:
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
   ```
   
4. Then run the script again:
   ```powershell
   .\run-app-with-community.ps1
   ```

5. If specific endpoints are failing, check the API server logs for detailed error information.
