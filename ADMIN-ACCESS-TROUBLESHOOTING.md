# WinGroX Admin Access Troubleshooting Guide

If you're having trouble accessing admin features in the WinGroX application, follow these steps to fix the issue.

## Quick Fix Steps

1. **Use the Demo Admin Login**
   - Go to [Login Page](http://localhost:3000/login)
   - Click the "Demo Admin Login" button (fastest option)
   - OR manually enter:
     - Email: `admin@wingrox.ai`
     - Password: `admin123`

2. **Verify Admin Token**
   - Run the verification script:
   ```powershell
   .\verify-admin-login.ps1
   ```
   - Use the "Set Admin Token" button in the verification tool if needed

3. **Check Admin Controls**
   - Visit [Products Page](http://localhost:3000/products)
   - Scroll to the bottom to see the admin panel
   - You should see "ADD NEW PRODUCT" button in the admin controls

## Token Not Working?

If the admin token isn't working after login, try these steps:

1. **Manual Token Setting**
   - Open browser console (F12 > Console tab)
   - Run this command:
   ```javascript
   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
   window.location.reload();
   ```

2. **Clear Browser Cache and Cookies**
   - Clear your browser cache and cookies
   - Try logging in again with demo admin credentials

3. **Use the Debug Scripts**
   - Run the debug script:
   ```powershell
   .\debug-admin-token.ps1
   ```
   - Or use the fix script:
   ```powershell
   .\fix-admin-login.ps1
   ```

## Still Having Issues?

Check these common problems:

1. **Incorrect Domain**
   - Make sure the email domain is exactly `admin@wingrox.ai` (not .com)
   - The token must have `role: "admin"` in the payload

2. **Token Expiration**
   - Check if the token is expired in the verification tool
   - A valid token should have an expiration date in the future

3. **Application Issues**
   - Make sure the React app is running (http://localhost:3000)
   - Check browser console for React errors

4. **AdminControl Component**
   - The AdminControl component should be present in Products.tsx
   - It should correctly decode and verify the admin role

## Contact Support

If you've tried all these steps and still can't access admin features, contact the development team for further assistance.
