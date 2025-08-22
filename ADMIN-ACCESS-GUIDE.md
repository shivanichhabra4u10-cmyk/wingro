# Admin Access for Products and Coaches Management

## Overview
WinGrox AI implements role-based access control to ensure that only administrators can perform CRUD operations on products and coaches, while allowing all users to view these items.

## Admin Features
As an admin user, you can:
- View all products and coaches (like regular users)
- Access admin panels on Products and Marketplace pages
- Add new products and coaches
- Edit existing products and coaches
- Delete products and coaches

## How to Access Admin Features

### Option 1: Login Page Admin Button
1. Navigate to the Login page
2. Click the "Demo Admin Login" button at the bottom
3. You'll be automatically logged in with admin privileges and redirected to the Products page

### Option 2: Run the Admin Token Script
1. Open PowerShell
2. Navigate to the project root directory
3. Run the script: `.\set-admin-token.ps1`
4. The script will open a browser with admin access

### Option 3: Manually Set the Admin Token
1. Open your browser's developer console (F12)
2. Run the following JavaScript code:
```javascript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
```
3. Refresh the page

## Where to Find Admin Panels

### Products Management
1. Navigate to the Products page (`/products`)
2. Scroll to the bottom of the page
3. With admin access, you'll see the "Product Management" panel

### Coaches Management
1. Navigate to the Marketplace/Find a Coach page (`/marketplace`)
2. Scroll to the bottom of the page
3. With admin access, you'll see the "Admin Controls" panel for coach management

## Verification
When logged in as an admin, you'll see:
- An "Admin" badge in the navigation header
- Admin panels at the bottom of Products and Marketplace pages
- Console messages confirming your admin status when performing admin actions

## Troubleshooting
If admin panels don't appear:
1. Check browser console for any errors
2. Verify the token is set in localStorage
3. Try clearing browser cache and reloading
4. Use the set-admin-token.ps1 script to reset the token
