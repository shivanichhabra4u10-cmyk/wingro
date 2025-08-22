# Resolving Products API 404 Error

This document provides step-by-step instructions to resolve the 404 error when accessing `/api/products`.

## Problem
- GET http://localhost:3001/api/products returns 404 (Not Found)
- Other APIs are working correctly
- MongoDB is running fine

## Solution Steps

### 1. Start the Standalone Products API Server

The most reliable way to get the products API working is to use the standalone Products API server:

```powershell
# Navigate to the project root directory
cd c:\Users\shichhab1\source\pers\wingrox-ai

# Start the standalone products API server
.\start-products-api.ps1
```

This will:
- Stop any existing Node processes to avoid port conflicts
- Start MongoDB if not already running
- Install required dependencies
- Start a dedicated server just for the products API on port 3001

### 2. Verify the API is Working

After starting the standalone server, run the test script to verify the API endpoints:

```powershell
.\test-product-api.ps1
```

### 3. Alternative: Use the Emergency Products API

If the standalone server doesn't work, try the emergency products API:

```powershell
.\start-emergency-api.ps1
```

### 4. Using the Application with Mock Fallback

Even if none of the API servers work, the client application has been updated to fall back to using localStorage for product management. This allows you to:

1. View products (uses static data if API fails)
2. Add new products (stored in localStorage if API fails)
3. Edit products (updates localStorage if API fails)
4. Delete products (updates localStorage if API fails)

You'll see an indicator when the application is using mock data.

## Technical Details

### Server Configuration

The products API routes should be correctly configured in the following files:

- `server/src/routes/index.ts`: Registers product routes at `/products`
- `server/src/app.ts`: Mounts all routes at `/api`

### Client Configuration

The client is configured to try multiple API endpoints:

1. First tries: `http://localhost:3001/api/products`
2. Then tries: `http://localhost:3001/products`
3. Finally falls back to localStorage

## Need Further Help?

If you're still experiencing issues, check the following:

1. Make sure port 3001 is not blocked or in use by another application
2. Check MongoDB connection (run `docker ps` to verify the container is running)
3. Look at the server console logs for specific error messages
