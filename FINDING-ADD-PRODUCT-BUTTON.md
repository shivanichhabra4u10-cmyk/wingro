# Finding the "Add New Product" Button

When logged in as admin, you need to look at the **bottom** of the Products page to find the admin controls.

## Step-by-Step Instructions

1. Log in as admin (using email: admin@wingrox.ai, password: admin123)
2. Go to the Products page (http://localhost:3000/products)
3. **Scroll all the way to the bottom of the page**
4. You should see a blue gradient panel labeled "Product Management"
5. Inside this panel is a large blue button labeled "ADD NEW PRODUCT"

## What to Look For

The admin panel looks like this:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────┐ ┌────────────────────┐   │
│  │ Product Management                    │ │                    │   │
│  │ As an admin, you can add, edit, or    │ │  ADD NEW PRODUCT   │   │
│  │ delete products from here.            │ │                    │   │
│  └───────────────────────────────────────┘ └────────────────────┘   │
│                                                                     │
│  Instructions:                                                      │
│  1. Click ADD NEW PRODUCT to create a new product                   │
│  2. Use the table below to edit or delete existing products         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Troubleshooting

If you don't see this panel:

1. **Verify admin login**: Check if you see an "Admin" badge next to your name in the navigation
2. **Clear browser cache**: Try clearing your browser cache and refreshing
3. **Use debug script**: Run the `debug-admin-token.ps1` script to verify your admin token
4. **Check console**: Open browser console (F12) to see any errors

## Still Having Issues?

If you're still not seeing the "Add New Product" button:

1. Try running this in your browser console (F12 > Console tab):
   ```javascript
   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
   ```

2. Refresh the page and scroll to the bottom

3. If it still doesn't appear, there might be a code issue. Please run:
   ```
   ./debug-admin-token.ps1
   ```
