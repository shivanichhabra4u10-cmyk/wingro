# Complete Guide to Fixing Community API Endpoints

This guide addresses the 404 errors occurring when the client tries to fetch community segments and posts, ensuring that posts are properly persisted to the database.

## Problem Description

The client was encountering 404 errors when trying to access:
- `/emergency/community/segments`
- `/emergency/community/posts?segmentId=career-plateau&sort=most-viewed`

This happened because:
1. The API server wasn't properly handling these endpoints
2. Query parameters like `sort=most-viewed` weren't being processed correctly
3. The segments data structure didn't match what the client expected

## Solution Overview

1. **Enhanced API Server**:
   - Added support for all endpoint variants
   - Made the API respond to all required query parameters
   - Added fallback data for resilience
   - Ensured segments match client expectations

2. **MongoDB Integration**:
   - Connected to MongoDB for data persistence
   - Implemented proper schemas for posts and comments

3. **Error Handling & Diagnostics**:
   - Added detailed logging
   - Implemented a helpful 404 handler
   - Created test scripts to verify functionality

## Step-by-Step Fix Implementation

### 1. Start the API Server

```powershell
.\start-api.ps1
```

This script:
- Installs necessary dependencies
- Kills any conflicting processes on port 3001
- Starts the guaranteed community API

### 2. Verify All Endpoints Work

```
node test-api-endpoints.js
```

This will test all required endpoints to ensure they're responding correctly.

### 3. Test Post Creation & Persistence

```
node test-post-persistence.js
```

This verifies that:
- Posts can be created via the API
- They are properly stored in MongoDB
- They can be retrieved later

### 4. Using the Application

1. Start the guaranteed API server
2. Start the main application
3. Navigate to the Community page
4. Create posts and verify they persist

## Technical Details

### Fixed Endpoints

The API now handles all these endpoints (including query parameters):

| Endpoint | Purpose |
|----------|---------|
| `/api/community/segments` | Get all community segments |
| `/emergency/community/segments` | Fallback for segments |
| `/community/segments` | Direct access to segments |
| `/api/community/posts` | Get/create community posts |
| `/emergency/community/posts` | Emergency endpoint for posts |
| `/community/posts` | Direct access to posts |

### Query Parameters Support

- `segmentId` - Filter posts by segment
- `sort` - Sort posts by:
  - `newest` (default)
  - `oldest`
  - `most-viewed`
  - `most-liked`

### Authentication Bypass

For testing, we've added a bypass for the JWT validation:

```typescript
// Development bypass for easier testing
if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') {
    console.log('⚠️ DEV MODE: Bypassing JWT validation');
    req.user = { id: 'dev-user-id', email: 'dev@example.com', role: 'user' };
    next();
    return;
}
```

## Troubleshooting

If you still encounter issues:

1. **Check API server logs**:
   - Look for 404 errors
   - Check request parameters

2. **Verify MongoDB connection**:
   - Visit `http://localhost:3001/health`
   - Check that MongoDB shows as "connected"

3. **Test specific endpoints**:
   - Use the test scripts or curl/Postman
   - Check for specific error messages

4. **Inspect client-side API calls**:
   - Look for the exact endpoints being called
   - Check the parameters being sent

## Conclusion

After implementing these fixes, the client should be able to successfully fetch community segments and posts, and new posts should be properly stored in the MongoDB database. The enhanced error handling and fallbacks ensure the system is resilient even in case of partial failures.
