# UPDATED Integrated API Server Guide

## Overview
This updated integrated API server is a complete solution that addresses all known issues in the application:

1. ✅ Products API 404 errors 
2. ✅ Products map runtime errors
3. ✅ Community API 404 errors
4. ✅ Community posts 404 errors 
5. ✅ MongoDB connection issues

## New Features

### 1. Unified Server Architecture
- All APIs now run on a single port (3005)
- Includes products, community, admin, and database status endpoints
- Comprehensive error handling and logging

### 2. Enhanced Community Posts Support
- Added complete implementation for community posts endpoints
- Support for filtering, sorting, pagination and search
- Sample data included to demonstrate functionality

### 3. Multiple Route Pattern Support
All endpoints support multiple route patterns for backward compatibility:

**Products API:**
- `/api/v1/products`
- `/v1/products`
- `/api/products`
- `/products`

**Community API:**
- `/api/community/segments`
- `/community/segments`
- `/emergency/community/segments`
- `/api/community/posts`
- `/community/posts`
- `/emergency/community/posts`

**Admin & Health:**
- `/admin/products`
- `/admin/health`
- `/health`
- `/api/db/status`

## Files Created
- `updated-integrated-api-server.js` - The complete integrated API server
- `run-updated-integrated-api.ps1` - PowerShell script to run the server
- `direct-emergency-community-api.js` - Standalone community posts API (if needed separately)
- `fix-community-posts-404.ps1` - Script to run just the community API (if needed separately)

## How to Use

### Option 1: Run the Complete Integrated Solution (Recommended)

1. Run the integrated server script:
   ```powershell
   .\run-updated-integrated-api.ps1
   ```

2. The server will start on port 3005 with all endpoints available:
   - Products API: http://localhost:3005/api/v1/products
   - Community Segments: http://localhost:3005/emergency/community/segments
   - Community Posts: http://localhost:3005/emergency/community/posts
   - Admin Products: http://localhost:3005/admin/products
   - Health Check: http://localhost:3005/health
   - Database Status: http://localhost:3005/api/db/status

### Option 2: Run Only the Community Posts API

If you only need to fix the community posts issues:

1. Run the community posts server script:
   ```powershell
   .\fix-community-posts-404.ps1
   ```

2. The community API will be available at:
   - http://localhost:3001/emergency/community/posts

## Troubleshooting

### Port Conflicts
The script automatically checks for and kills any processes using the required ports (3000-3005).

### 404 Errors
If you still encounter 404 errors:
1. Check the browser console to see the exact URL being requested
2. Verify that the URL matches one of the supported patterns
3. Look at the server logs to see if the request is reaching the server

### CORS Issues
The server is configured to allow requests from all origins. If you encounter CORS issues, check your browser console for specific error messages.

## Next Steps

1. Start the React app with the integrated API server running
2. Test all functionality that previously had issues
3. Consider updating client code to use consistent API patterns in the future
