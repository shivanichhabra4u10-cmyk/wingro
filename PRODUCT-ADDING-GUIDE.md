# Adding Products in WinGrox AI - Step by Step Guide

This guide shows you how to add new products as an admin user in the WinGrox AI platform.

## Step 1: Log in as Admin

1. Go to the login page: http://localhost:3000/login
2. Use the admin credentials:
   - **Email**: admin@wingrox.ai
   - **Password**: admin123
3. Or simply click the "Demo Admin Login" button at the bottom of the login form

## Step 2: Navigate to Products Page

1. After logging in, go to the Products page: http://localhost:3000/products
2. Scroll all the way to the bottom of the page to find the Product Management section

## Step 3: Find the "Add New Product" Button

The "Add New Product" button is located in the admin section at the bottom of the Products page:

1. It's in a highlighted blue gradient panel
2. The button is labeled "ADD NEW PRODUCT" with a plus (+) icon
3. Click this button to open the product creation form

## Step 4: Fill in the Product Details

In the product creation form, fill in the following details:

1. **Product Basic Information:**
   - Product Name (required)
   - Price (required)
   - Old Price (optional) - for showing discounts
   - Badge (optional) - e.g., "New", "Sale", "Featured"
   - Category - e.g., "digital", "physical"
   - Product Type - choose "individual" or "enterprise"

2. **Product Description:**
   - Enter a detailed description of the product

3. **Images:**
   - Add image URLs for the product
   - Click "Add Image" to add multiple images
   - The first image will be used as the main product image

4. **Features:**
   - List the features of the product
   - Click "Add Feature" to add multiple features

5. **Enterprise Features (if applicable):**
   - For enterprise products, add specific enterprise features
   - Click "Add Enterprise Feature" to add multiple features

6. **Enterprise Subcategory (if applicable):**
   - For enterprise products, select a subcategory

## Step 5: Save the Product

Once you've filled in all the required information:

1. Click the "Save Product" or "Create Product" button at the bottom of the form
2. The product will be added to the database and appear in the products list
3. You'll see a success message if the product was added successfully

## Step 6: Verify the New Product

After saving:

1. You'll be returned to the Product Management section
2. Your new product should appear in the products table
3. The product will also be visible on the main Products page for all users

## Troubleshooting

If you don't see the "Add New Product" button:

1. Make sure you're logged in as an admin (you should see an "Admin" badge in the navigation)
2. Scroll to the very bottom of the Products page
3. Check the browser console (F12) for any error messages
4. Try refreshing the page or logging out and back in

For any issues adding products, check the browser console for error messages or contact support.
