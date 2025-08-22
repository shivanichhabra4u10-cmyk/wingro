# PRODUCTS API FIX - STEP BY STEP GUIDE

This guide provides step-by-step instructions to fix the 404 error with the products API
and to get the "Add New Product" functionality working.

## STEP 1: START THE STANDALONE API SERVER

This specially designed server focuses exclusively on product management and runs
completely separate from the main application server to avoid any routing issues.

```
.\start-products-api.ps1
```

Wait until you see "STANDALONE PRODUCTS API running on port 3001" and MongoDB connection confirmation.

## STEP 2: TEST THE STANDALONE API

In a new terminal window, verify the API is working correctly:

```
cd products-api
node test.js
```

This will:
1. Try multiple possible API endpoints
2. Attempt to create a test product on each endpoint
3. Show which endpoints are working

If one or more tests pass, you'll see which endpoint to use in your application.

## STEP 3: START THE CLIENT

In a new terminal window, start the client:

```
cd client
npm start
```

Wait until the client starts and is available at http://localhost:3000

## STEP 4: USE THE PRODUCTS PAGE

1. Navigate to http://localhost:3000/products
2. Scroll down to find the "Product Management" section with "Admin Only" badge
3. Click "Add New Product"
4. Fill in the product details
5. Click "Create Product"

## TROUBLESHOOTING

If you still encounter issues:

1. Check the browser console for errors
2. Look at the standalone API server logs for request information
3. Ensure both the standalone API server and client are running
4. Try using a simple HTTP client like Postman to test the API directly
5. Try bypassing the client completely and use the test.js script

## WHAT WAS FIXED

1. Created a completely separate standalone API server with its own package.json
2. Provided multiple API endpoint options in both formats (/products and /api/products)
3. Modified the client code to try multiple endpoints until one works
4. Added a comprehensive test script to verify which endpoints are working

## NEXT STEPS

Once everything is working with the emergency server, you can later investigate
why the main server's API routes aren't working properly.
