# Coach and Product Management Guide

This document explains how to use and manage the product and coach features in the WinGrox application.

## Table of Contents

1. [Overview](#overview)
2. [Products Management](#products-management)
3. [Coach Management](#coach-management)
4. [Backend Architecture](#backend-architecture)
5. [API Endpoints](#api-endpoints)
6. [Fallback Mechanisms](#fallback-mechanisms)
7. [Troubleshooting](#troubleshooting)

## Overview

The WinGrox application features fully functional product and coach management capabilities with:

- Database-driven storage (MongoDB)
- Complete CRUD operations (Create, Read, Update, Delete)
- Admin-only access control for master data management
- Admin management interfaces
- Pagination support
- Filtering and sorting
- Multiple fallback mechanisms for reliability

## Admin Access Control

To ensure data integrity and security, the admin features on Products and Marketplace pages are restricted to admin users only:

### Admin Access Implementation

- All users can view Products and Marketplace pages
- Admin-only features (add, edit, delete) are protected by the `AdminControl` component
- Non-admin users will not see admin controls and cannot modify data
- Admin status is verified through JWT token role claims
- Access to admin features is controlled at the component level
- If a non-admin attempts to access admin features directly, they will be directed to an access denied page

### Becoming an Admin

To gain admin access:

1. Register a new user account
2. A system administrator must update your user role to 'admin' in the database
3. Once your role is updated, you'll have access to all admin features upon login

## Products Management

### Product Features

- **Product Display**: Products are displayed on the Products page, grouped by Individual and Enterprise categories
- **Pagination**: Products are paginated with configurable number of items per page (default: 5)
- **Admin Functions**: Admins can add, edit, and delete products directly from the UI
- **Product Types**: Both Individual and Enterprise products are fully supported
- **Resilient API**: Multiple fallback mechanisms ensure products always display

### Using the Product Admin UI

1. Log in as an admin user
2. Navigate to the Products page
3. The admin panel will appear at the top of the page
4. From here you can:
   - Add new products (with all required fields)
   - Edit existing products
   - Delete products (with confirmation)
   - Switch between Individual and Enterprise product types

### Product Data Structure

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  category: string;
  productType: 'individual' | 'enterprise';
  images?: string[];
  features?: string[];
  enterpriseFeatures?: string[]; // For enterprise products
  enterpriseSubcategory?: string; // For enterprise products
}
```

## Coach Management

### Coach Features

- **Coach Marketplace**: Coaches are displayed on the Marketplace/Find a Coach page
- **Pagination**: Coaches are paginated with configurable number of items per page (default: 10)
- **Filtering**: Coaches can be filtered by specialization
- **Admin Functions**: Admins can add, edit, and delete coaches directly from the UI
- **Coach Details**: Each coach has detailed information including rating, client count, specializations, etc.
- **Coach Profiles**: Detailed individual coach profile pages with comprehensive information
- **Resilient API**: Multiple fallback mechanisms ensure coaches always display

### Using the Coach Admin UI

1. Log in as an admin user
2. Navigate to the Marketplace page
3. The admin panel will appear at the top of the page
4. From here you can:
   - Add new coaches (with all required fields)
   - Edit existing coaches
   - Delete coaches (with confirmation)
   - View coach specializations and ratings

### Coach Profiles

The application features detailed coach profile pages:

1. **Accessing Profiles**: 
   - Click "View Profile" on any coach card in the Marketplace
   - Direct URL access via `/coach/[id]`

2. **Profile Features**:
   - Professional details (name, title, bio)
   - Performance metrics (rating, client count, experience)
   - Specializations and tags
   - Pricing information
   - Contact and booking options
   - Match percentage (if assessment completed)

3. **User Actions**:
   - Take assessment to get matched
   - Book consultations directly through the platform
   - Contact coach via email
   - Request custom coaching packages

### Book Consultation Feature

The application includes a comprehensive consultation booking system:

1. **Accessing the Booking Form**:
   - From Coach Profile page, click "Book Consultation" button
   - Available both in the action buttons and the call-to-action section

2. **Booking Process**:
   - Select date (limited to 3 months in advance)
   - Choose available time slot
   - Select consultation duration (30-120 minutes)
   - Choose session type (video, phone, or in-person)
   - Provide consultation topic and additional notes
   - Submit booking request

3. **Confirmation**:
   - Receive immediate on-screen confirmation
   - View booking details summary
   - Navigate to dashboard or close the confirmation
   
4. **Data Storage**:
   - Booking details are stored in localStorage for persistence
   - Future enhancement: Backend API for bookings
   - Future enhancement: Email notifications for bookings

### Coach Data Structure

```typescript
interface Coach {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  experience: number;
  rating: number;
  clientCount: number;
  topPercentage?: number;
  specializations: string[];
  tags: string[];
  imageUrl?: string;
  startingPrice: number;
  pricingModel: 'hourly' | 'monthly' | 'package';
  matchPercentage?: number;
  isActive?: boolean;
}
```

## Backend Architecture

The backend uses a layered architecture:

1. **Models**: Mongoose schemas for Products and Coaches (MongoDB)
2. **Controllers**: Business logic for CRUD operations
3. **Routes**: API endpoints for accessing data
4. **Middleware**: Authentication and authorization
5. **Fallback APIs**: Multiple standalone API servers for maximum resilience

## API Endpoints

### Products API

- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

Query parameters for `/api/products`:
- `limit` - Number of products per page (default: 10)
- `page` - Page number (default: 1)
- `productType` - Filter by product type (individual/enterprise)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction (1 for ascending, -1 for descending)

### Coaches API

- `GET /api/coaches` - Get all coaches (with pagination)
- `GET /api/coaches/:id` - Get coach by ID (used for detailed coach profiles)
- `POST /api/coaches` - Create a new coach (admin only)
- `PUT /api/coaches/:id` - Update a coach (admin only)
- `DELETE /api/coaches/:id` - Delete a coach (admin only)

Query parameters for `/api/coaches`:
- `limit` - Number of coaches per page (default: 10)
- `page` - Page number (default: 1)
- `specialization` - Filter by specialization
- `tag` - Filter by tag
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction (1 for ascending, -1 for descending)

## Fallback Mechanisms

### Multiple API Endpoints

The app will attempt to fetch data from multiple endpoints:
1. Main API endpoint (`/api/products` or `/api/coaches`)
2. Direct endpoint (`/products` or `/coaches`) 
3. Standalone API endpoint (various ports)

### Local Storage Cache

For critical operations:
- Products and coaches are cached in localStorage when fetched
- In case of all API failures, this cache is used as a fallback
- Add/Edit/Delete operations update the localStorage cache

### Mock Data

If all other methods fail:
- The app uses mock data as a last resort
- This ensures the UI is never empty and users can still see content
- Mock data is clearly labeled

## Troubleshooting

### Common Issues and Solutions

1. **Products or coaches not displaying**:
   - Check that the MongoDB server is running
   - Verify API server is running on port 3001
   - Look for console errors related to API endpoints

2. **Cannot add/edit products or coaches**:
   - Verify you're logged in as an admin
   - Check browser console for API errors
   - Ensure all required fields are filled

3. **Pagination not working**:
   - Check that the backend API is returning correct pagination metadata
   - Verify the frontend is passing correct page and limit parameters

### Testing the APIs

Use the included test script:

```powershell
./test-api-endpoints.ps1
```

This will check all product and coach API endpoints across multiple base URLs to verify connectivity.

For detailed API debugging:
```powershell
./start-services.ps1 -Debug
```
