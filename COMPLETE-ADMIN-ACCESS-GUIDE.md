# WinGroX Admin Access - Complete Guide

This guide provides multiple methods to fix admin access issues in the WinGroX application. Try the methods below in order until you get admin access working.

## Method 1: Use the HTML Tool

The simplest way to get admin access:

1. Open the file `admin-access-fix.html` in your browser
2. Click the "SET ADMIN TOKEN" button
3. Click "GO TO PRODUCTS PAGE"
4. Scroll down to see the admin panel

## Method 2: Use the Demo Admin Login

1. Go to http://localhost:3000/login
2. Click the "Demo Admin Login" button at the bottom
3. Wait for the redirect to the Products page
4. Scroll down to see the admin panel

## Method 3: Direct Browser Console

1. Open your browser developer tools (F12 or right-click > Inspect)
2. Go to the Console tab
3. Copy and paste this code:

```javascript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
window.location.reload();
```

4. Press Enter to execute the code
5. Wait for the page to reload
6. Scroll down to see the admin panel

## Method 4: Use the PowerShell Scripts

We've created several PowerShell scripts to help debug and fix admin access:

1. Open PowerShell in your project directory
2. Run one of these scripts:

```powershell
.\verify-admin-login.ps1    # Check token status and troubleshoot issues
.\force-admin-access.ps1    # Force-set the token and redirect to Products page
```

## Method 5: Multiple Admin Control Components

We've implemented three different AdminControl components that use different approaches to verify admin status:

1. **Standard AdminControl** - The original component
2. **ForceAdminControl** - Enhanced token verification
3. **SimpleAdminControl** - Simplified direct token parsing

All three components are now used in the Products page, so at least one should work!

## Debugging Admin Token Issues

If you're still having trouble, check these common issues:

### 1. Incorrect Token Format

The token must be a valid JWT with three parts separated by periods (xxx.yyy.zzz) and contain:
- `role: "admin"` in the payload
- `email: "admin@wingrox.ai"` (note the .ai domain)
- An expiration date that's in the future

### 2. Browser Storage Issues

- Try clearing your browser cache and cookies
- Check if localStorage is enabled in your browser
- Try using a different browser

### 3. React App Issues

- Make sure the React app is running on http://localhost:3000
- Check the browser console for React errors
- Try rebuilding the application

## Admin Credentials

These are the correct admin credentials:

- Email: `admin@wingrox.ai`
- Password: `admin123`

## Direct Files For Admin Access

These files can help you gain admin access directly:

- `admin-access-fix.html` - Interactive tool to set admin token
- `client/direct-admin-login.js` - Script to run in browser console
- `set-admin-token.html` - Standalone token setter

## Still Having Issues?

If you've tried all these methods and still can't access the admin panel:

1. Check if the middleware on the server side is validating JWT tokens correctly
2. Verify that the AdminControl component is properly mounted in Products.tsx
3. Check that the JWT token is being properly included in API requests
4. Try completely rebuilding the application from scratch
