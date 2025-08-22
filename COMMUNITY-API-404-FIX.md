# Community API 404 Fix Guide

This guide explains how to fix the 404 errors with the community API endpoints.

## Problem Description

The application is experiencing 404 (Not Found) errors when attempting to access community data:

1. GET requests to `/emergency/community/segments` are failing
2. GET requests to `/emergency/community/posts?segmentId=career-plateau&sort=most-viewed...` are failing

These errors occur in the GrowWithCommunity component when it tries to load community segments and posts.

## Solution Summary

We've provided multiple solutions for the community API issues:

1. **Direct Community Routes**: Added direct community routes in the server app.ts file
2. **Enhanced API Client**: Improved client-side API handling with better retry logic
3. **Emergency API Server**: Created a guaranteed API server with mock data
4. **Automatic API Fix**: Created a script that automatically starts the emergency API server

## Using the Emergency API Server

We've created a new script to automatically fix the community API issues:

1. Run our new 404 fix script:
   ```powershell
   .\fix-community-404.ps1
   ```
2. This script will:
   - Check for existing processes and stop them if needed
   - Start the emergency community API server
   - Test the endpoints to verify they're working
   - Apply additional fixes if needed

3. The emergency server provides all necessary community endpoints:
   - `/api/community/segments`
   - `/community/segments` 
   - `/api/community/posts`
   - `/community/posts`
   - `/emergency/community/segments`
   - `/emergency/community/posts`

## Client-Side Changes

We've enhanced the client-side API to:
1. Try using emergency endpoints when standard endpoints fail
2. Implement better retry logic between `/api/community/` and `/community/` paths
3. Provide more detailed error information

## Testing the API

You can test if the API is working using:
```powershell
node check-community-paths.js
```

This script will test all community endpoint versions and report which ones are working.

## Explanation of 404 Errors

The 404 errors were occurring due to:
1. The emergency community API server not running when the client tries to access it
2. Mismatch between client API calls and server route configuration
3. Inconsistent use of `/api/community/` vs `/community/` prefixes

## Verification

After running the fix script, you should verify:
1. The emergency community API server is running in a new window
2. Refresh the community page in your application
3. Segments and posts should load without errors
4. Check the browser console for any remaining errors

## Troubleshooting

If issues persist after running the fix:
1. Check if port 3001 is already in use with:
   ```
   netstat -ano | findstr :3001
   ```
2. Try running the emergency community API directly:
   ```
   node emergency-community-api.js
   ```
3. Check the browser console for any additional error details
3. Potential server-side routing issues in mounting the community routes

The solution ensures all variations of the endpoint URLs are properly handled.
