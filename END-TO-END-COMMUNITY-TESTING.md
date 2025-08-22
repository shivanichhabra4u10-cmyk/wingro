# End-to-End Testing Guide for Community Functionality

This guide will help you test the complete community functionality, ensuring that posts are properly stored in the MongoDB database when created through the UI.

## Quick Start

Run the following command to start all necessary components:

```powershell
.\run-app-with-community.ps1
```

This script will:
1. Start MongoDB (using Docker if necessary)
2. Start the Guaranteed Community API (backup API with MongoDB persistence)
3. Start the Main Server
4. Start the Client Application

## Testing the Community Feature

### Step 1: Access the Application
Once all components are started, open your browser and navigate to:
```
http://localhost:3000
```

### Step 2: Navigate to the Community Page
Find and click on the Community or "Grow With Community" section in the main navigation.

### Step 3: Create a New Post
1. Select a segment (e.g., "Career Plateau")
2. Enter your question in the text field
3. Click the submit button
4. Verify that your post appears in the feed

### Step 4: Verify Persistence
To confirm the post is truly saved in the database:
1. Refresh the page
2. Your post should still be visible
3. Close the browser and reopen it
4. Navigate back to the Community page
5. Your post should still be there

## How It Works

The complete solution ensures posts persist through:

1. **Multiple API Fallbacks**:
   - First tries the direct server endpoint
   - Falls back to a guaranteed Community API endpoint
   - Both save posts to the same MongoDB database

2. **Authentication Bypass**:
   - Development mode bypasses JWT validation
   - Allows for easier testing without login requirements

3. **MongoDB Connection**:
   - All API endpoints connect to the same MongoDB instance
   - Posts are stored in the CommunityPost collection

## Troubleshooting

If you encounter issues:

### 404 Errors in Console
- Check that all servers are running
- Verify MongoDB is running (check the docker container)
- Look for error messages in the server console windows

### Posts Not Persisting
1. Test the API directly:
   ```
   node test-api-endpoints.js
   ```

2. Check MongoDB connection:
   ```
   http://localhost:3001/health
   ```

3. Inspect the server logs for any errors

### Port Conflicts
If you see "address already in use" errors:
1. Close all PowerShell windows
2. Run the cleanup command:
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```
3. Try again with `.\run-app-with-community.ps1`
