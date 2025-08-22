# Community POST Persistence Fix

## Problem
Posts submitted through the Community page were not being stored in MongoDB. Instead, they were either:

1. Failing with 404 errors when trying to reach the API endpoints
2. Falling back to creating local mock posts in memory
3. Not persisting between page refreshes or application restarts

## Solution
We've implemented a comprehensive solution that ensures all community posts are properly stored in the MongoDB database:

1. **Fixed the Authentication Middleware**
   - Added the `validateJWT` export in the auth middleware to match the imports
   - Added a development bypass to make testing easier

2. **Created a MongoDB-backed API Server**
   - Built a guaranteed community API that connects directly to MongoDB
   - Implements all required endpoints with proper MongoDB persistence
   - Supports all fallback paths the client might try (`/api/community/posts`, `/emergency/community/posts`, `/community/posts`)

3. **Improved Test Scripts**
   - Added a comprehensive test script (`test-post-persistence.js`) to verify posts are stored in the database
   - Created a better startup script that checks MongoDB connection status

## How to Use This Fix

### Start the Guaranteed Community API with MongoDB
```
./run-guaranteed-community-api.ps1
```

This script will:
1. Check if MongoDB is running (and attempt to start it using Docker if not)
2. Install necessary dependencies if missing
3. Start the guaranteed API server with MongoDB connection

### Test Post Creation and Storage
```
node test-post-persistence.js
```

This script will:
1. Create a test post through the API
2. Verify it can be retrieved by ID (proving database storage)
3. Check that it appears in the list of all posts
4. Test all available endpoints to ensure they're working

### Using the Community Page in the App
The client-side code already has proper fallback logic. When the guaranteed API is running:

1. It will first try `/emergency/community/posts` for post creation
2. Then fall back to `/api/community/posts` if needed
3. Then try `/community/posts` as a last resort
4. All of these endpoints now properly store data in MongoDB

## Technical Implementation Details

### MongoDB Connection
The API connects to MongoDB using the connection string from the environment variable `MONGODB_URI` or falls back to `mongodb://localhost:27017/wingrox_db`.

### Mongoose Schemas
We've implemented proper Mongoose schemas for:
- `CommunityPost` - Stores questions/posts from users
- `Comment` - Stores comments on posts

### Authentication Handling
We've fixed the mismatch between the auth middleware export and import by adding:

```typescript
export const validateJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {
    // For development, bypass JWT validation to make testing easier
    if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') {
        console.log('⚠️ DEV MODE: Bypassing JWT validation');
        req.user = { id: 'dev-user-id', email: 'dev@example.com', role: 'user' };
        next();
        return;
    }

    // Use the existing protect middleware implementation
    authMiddleware.protect(req, res, next);
};
```

This ensures the POST routes work properly with the authentication middleware.

## Health Check
You can verify the API is running and connected to MongoDB by visiting:
```
http://localhost:3001/health
```

This will show the MongoDB connection status and available endpoints.

## Conclusion
With these fixes in place, the community post functionality now properly persists data to MongoDB. Users can create posts through the UI and they will be stored in the database, ensuring they remain available after page refreshes or application restarts.
