# Admin Token Quick Fix Guide

If you're having trouble with admin access in the WinGroX application, follow these steps to solve the issue:

## Quick Fix Steps (try these first)

1. **Clear your browser cache and cookies**
   - This is always a good first step

2. **Set the admin token directly**
   - Open your browser console (F12 > Console tab)
   - Copy and paste this command:
   ```javascript
   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
   window.location.reload();
   ```

3. **Login using demo admin credentials**
   - Go to the [Login Page](http://localhost:3000/login)
   - Click the "Demo Admin Login" button at the bottom of the page
   - OR manually enter:
     - Email: `admin@wingrox.ai`
     - Password: `admin123`

4. **Use the admin token setter page**
   - Open `set-admin-token.html` in the project root folder
   - Click the "SET ADMIN TOKEN NOW" button
   - This sets the token in your browser and displays the payload details

## Verify Your Token

1. **Open browser console** (F12 > Console)
2. **Run this command to check your token**:
   ```javascript
   const token = localStorage.getItem('token');
   if (!token) {
     console.log('No token found!');
   } else {
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       console.log('Token payload:', payload);
       console.log('Is admin?', payload.role === 'admin');
       console.log('Valid email?', payload.email === 'admin@wingrox.ai');
       console.log('Expired?', payload.exp * 1000 < Date.now());
     } catch (e) {
       console.log('Error decoding token:', e);
     }
   }
   ```

## Still Having Issues?

1. **Check the AuthContext component**
   - Make sure it's correctly reading the admin role from the JWT token
   - Check for any React errors in the browser console

2. **Check AdminControl component**  
   - AdminControl is used to conditionally render admin UI elements
   - Make sure it's getting the token and correctly parsing the admin role

3. **Use the debug scripts**
   - Run these PowerShell scripts in the project root to help diagnose issues:
     ```powershell
     .\verify-admin-login.ps1
     .\debug-admin-token.ps1
     .\fix-admin-login.ps1
     ```

4. **Check for network errors**  
   - Make sure the React app is running (http://localhost:3000)
   - Check if there are API errors related to authentication

## Important Admin Token Details

This is the correct token structure for admin access:

```json
{
  "userId": "admin-user-123",
  "email": "admin@wingrox.ai",  // Note the domain is .ai (not .com)
  "name": "Admin User",
  "role": "admin",              // Must be exactly "admin"
  "exp": 1750000000             // Must be a future timestamp
}
```

If your token doesn't match this structure, it won't grant admin access.
