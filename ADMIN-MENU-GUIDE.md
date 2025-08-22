# Admin Menu Guide

This guide explains how to use the new Admin Menu feature, which organizes all admin-specific functionality in the WinGroX AI application.

## Features

1. **Dedicated Admin Menu** - A separate menu in the navigation bar that's only visible to admin users
2. **Centralized Admin Access** - All admin screens grouped under a single menu for better organization
3. **Admin Dashboard** - Overview dashboard showing key metrics and quick access to admin functions
4. **Product Management** - Dedicated admin page for creating and managing products
5. **Coach Management** - Dedicated admin page for creating and managing coaches
6. **User Management** - Dedicated admin page for viewing and managing users

## How to Access

1. Log in as an admin user:
   - Email: `admin@wingrox.ai`
   - Password: `admin123`

2. Once logged in as an admin, you'll see the "Admin" menu in the navigation bar.

3. Click on "Admin" to see the admin menu options:
   - Dashboard
   - Product Management
   - Coach Management
   - User Management
   - Settings

4. Click on any option to access that specific admin function.

## Available Admin Pages

### Admin Dashboard
- URL: `/admin`
- Overview of platform statistics
- Quick access to key admin functions

### Product Management
- URL: `/admin/products`
- Create, edit, and delete products
- Set product pricing, descriptions, and featured status

### Coach Management
- URL: `/admin/coaches`
- Create, edit, and delete coach profiles
- Manage coach availability and services

### User Management
- URL: `/admin/users`
- View and manage all platform users
- See user registration dates and login history

## Testing the Admin Menu

Run the `test-admin-menu.ps1` script to start the app and test admin menu functionality:

```powershell
.\test-admin-menu.ps1
```

This script will:
1. Start the React application
2. Provide guidance on logging in as an admin
3. Outline steps to verify that the admin menu is working correctly

## Troubleshooting

If you don't see the Admin menu:

1. **Verify Login** - Make sure you're logged in with admin credentials
2. **Check Token** - Open browser console and run the following to check token:
   ```javascript
   try {
     const token = localStorage.getItem('token');
     const payload = JSON.parse(atob(token.split('.')[1]));
     console.log('Admin role?', payload.role === 'admin');
   } catch (e) {
     console.error('Token error:', e);
   }
   ```
3. **Set Admin Token Manually** - Use one of the utility scripts:
   ```
   .\set-admin-token.ps1
   ```
   
4. **Admin Access Fix** - Open `admin-access-fix.html` from the project root if other methods fail

## Implementation Details

The admin menu is implemented as a standalone component (`AdminMenu.tsx`) that:

1. Checks for admin status via the AuthContext
2. Renders the admin menu with dropdown functionality
3. Has both mobile and desktop views
4. Integrates into the main Layout component

Each admin page is protected by the AdminProtected component, which verifies admin status before rendering the page.
