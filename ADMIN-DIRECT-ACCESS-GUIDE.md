# WinGroX Admin Access Guide

## Quick Admin Access Solution

We've created multiple ways for you to access the admin panel without JWT validation issues.

### Option 1: Direct Admin Dashboard

Access a special admin dashboard that doesn't require JWT validation:

1. Navigate directly to: [http://localhost:3000/admin-direct](http://localhost:3000/admin-direct)
2. This page shows all admin functionality without requiring authentication

### Option 2: HTML Direct Access Page

1. Open the HTML file in your browser:
   - `admin-direct-access.html` in the project root
2. Use the "Set Admin Token" button to set a valid admin token in localStorage
3. Then navigate to any page in the app where you need admin access

### Option 3: Console Script

1. Open your browser console on any WinGroX page (press F12)
2. Copy and paste the contents of `set-admin-token.js` into the console
3. Press Enter to execute the script
4. Refresh the page to see admin features

### Option 4: Login Page Admin Button

If you prefer using the login page:

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Click the "Demo Admin Login" button
3. If it gives an "Access Denied" error, try one of the other methods first

## Admin Panel Features

The admin panel includes:

1. **Dashboard** - Overview of products, coaches, users, and applications
2. **Products Management** - Add, edit, and delete products
3. **Coaches Management** - Manage coach profiles and availability
4. **Coach Applications** - Review and approve/reject coach applications

## Troubleshooting JWT Issues

If you're experiencing issues with JWT validation:

1. JWT might be expired - Our direct methods use a token with a very long expiry
2. JWT payload might be incorrect - Our script sets the proper `role: "admin"` field
3. JWT verification might be failing - The direct access pages bypass verification

## Why This Alternative Access?

The main admin protection uses JWT validation which might be encountering issues with:

1. Token signing/verification
2. Payload structure
3. Role checking logic
4. Expiration time validation

These alternative access methods allow you to view and test admin functionality while the authentication system is being debugged.

## Security Note

In a production environment, proper authentication and authorization would be required. These direct access methods are for development and testing purposes only.
