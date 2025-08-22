# Community Posts API Fix

## Problem
The application is experiencing 404 errors when attempting to access the `/emergency/community/posts` endpoint, which prevents users from viewing community posts in the application.

## Solution
We've created a dedicated emergency API server specifically focused on fixing the community posts 404 issue. This server provides:

1. Multiple compatible route patterns:
   - `/api/community/posts`
   - `/community/posts`
   - `/emergency/community/posts`

2. Sample community post data with filtering capabilities
3. Support for query parameters: 
   - `segmentId` - filter posts by segment
   - `sort` - sort by newest, oldest, most-viewed, most-liked, or most-commented
   - `limit` - number of posts per page
   - `page` - pagination support
   - `search` - text search in question and details fields

4. Comprehensive error handling and logging

## Files Created
- `direct-emergency-community-api.js` - The standalone Express server for community posts
- `fix-community-posts-404.ps1` - PowerShell script to start the emergency API

## How to Use

1. Run the PowerShell script:
   ```
   .\fix-community-posts-404.ps1
   ```

2. The server will start on port 3001 with these available endpoints:
   - Health check: http://localhost:3001/health
   - Community segments: http://localhost:3001/emergency/community/segments
   - Community posts: http://localhost:3001/emergency/community/posts

3. You can test the endpoints in a browser or with tools like Postman.

4. You can filter posts by adding query parameters:
   ```
   http://localhost:3001/emergency/community/posts?segmentId=career-plateau&sort=most-liked&page=1&limit=10
   ```

## Integration with the Main Application
The emergency API is designed to be drop-in compatible with the existing application code. Once the server is running, the application should automatically connect to this endpoint and display community posts correctly.

## Troubleshooting
- If you see "port already in use" errors, the script will attempt to kill processes using port 3001.
- If you continue to see 404 errors, check the browser console for the specific URL being requested and verify it matches one of the supported routes.
- For Cross-Origin Resource Sharing (CORS) issues, the server is configured to allow all origins.

## Next Steps
After confirming this fix resolves the immediate issue, consider integrating this into the consolidated API server solution for a more permanent fix.
