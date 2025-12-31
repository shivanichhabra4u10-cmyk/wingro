# WinGroX AI Application

## Overview
WinGroX AI is the world's first Growth Intelligence Studio, designed to unlock the untapped potential of individuals, startups, and organizations through personalized growth journeys. This application combines cutting-edge artificial intelligence with deep human psychology.

## Technology Stack
- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT with role-based access control
- **Deployment**: Azure App Service

## Features
- Web-based application accessible on mobile and desktop
- Responsive design for optimal user experience
- Dynamic product catalog with admin management interface
- Coach marketplace with specialization filtering and consultation booking
- Direct Admin Dashboard for product and coach management without JWT validation
- End-to-end CRUD operations for products and coaches
- Comprehensive admin menu and UI controls for admin-only functionality
- Integration with third-party APIs and custom APIs
- User authentication using JWT for secure access
- Comprehensive testing including unit tests and integration tests
- Robust API fallback mechanisms for maximum reliability
- CI/CD pipeline for automated deployment

## Project Structure
```
wingrox-ai
├── client                # Frontend application
│   ├── public            # Static assets
│   ├── src
│   │   ├── components    # Reusable React components
│   │   ├── context       # React context providers
│   │   ├── hooks         # Custom React hooks
│   │   ├── pages         # Page components (Products, Marketplace, etc.)
│   │   ├── services      # API service layer with fallbacks
│   │   ├── styles        # Global styles
│   │   └── types         # TypeScript type definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server                # Backend application
│   ├── src
│   │   ├── controllers   # Route controllers (product, coach, etc.)
│   │   ├── middleware    # Express middleware (auth, etc.)
│   │   ├── models        # Database models (Mongoose schemas)
│   │   ├── routes        # API routes
│   │   ├── services      # Backend services
│   │   ├── scripts       # Utility scripts (data initialization, etc.)
│   │   ├── types         # TypeScript type definitions
│   │   └── utils         # Utility functions and helpers
│   ├── package.json
│   └── tsconfig.json
├── products-api          # Standalone products API server
├── public                # Public assets
├── .github
│   └── workflows
│       └── main.yml
├── COACH-PRODUCT-MANAGEMENT.md # Documentation for coach and product features
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Documentation

This project has several documentation files:

- **README.md** - This file, containing general project information
- **COACH-PRODUCT-MANAGEMENT.md** - Detailed documentation about the coach and product management features
- **PRODUCT-API-FIX.md** - Guide for fixing product API issues
- **PRODUCTS-API-404-FIX-GUIDE.md** - Guide for troubleshooting 404 errors
- **SPEC.md** - Project specifications and requirements

## Setup Instructions

### Client
1. Navigate to the `client` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Server
1. Navigate to the `server` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   npm run dev
   ```

### Docker
To run the application using Docker, use the following command:
```
docker-compose up
```

## Testing
- Ensure to write unit tests and integration tests for both frontend and backend components.
- Use appropriate testing frameworks and libraries.

## Contribution
Contributions are welcome! Please follow the coding standards and guidelines outlined in the project documentation.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## API Endpoints

The application uses a consolidated API architecture with all endpoints served from the main Express server. Here are the key API routes:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/verify` - Verify JWT token
- `GET /auth/me` - Get current user profile

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Coaches
- `GET /coaches` - Get all coaches
- `GET /coaches/:id` - Get coach by ID
- `POST /coaches` - Create new coach (admin)
- `PUT /coaches/:id` - Update coach (admin)
- `DELETE /coaches/:id` - Delete coach (admin)

### Community
- `GET /community/segments` - Get all community segments
- `GET /community/posts` - Get community posts (filterable)
- `POST /community/posts` - Create new post
- `GET /community/posts/:id/comments` - Get comments for a post
- `POST /community/posts/:id/comments` - Add comment to a post
- `POST /community/posts/:id/like` - Like a post
- `POST /community/posts/:id/bookmark` - Bookmark a post

## Database Schema

The application uses MongoDB for data storage with the following main collections:

- `users` - User accounts and authentication information
- `products` - Product listings with details and pricing
- `coaches` - Coach profiles and availability
- `communitySegments` - Community topic segments
- `communityPosts` - User posts and questions in community
- `comments` - Comments on community posts

### Mongo DB Restore

- Step 1 - Create new cluster in Free Tier

- Step 2 - Open Windows Power Shell as administrator

mongodump --uri "mongodb+srv://shivanichhabra4u10:rzJnUw4hZWtsOmzU@wingrocluster.rdz8evo.mongodb.net" --out "C:\Backup\dump"

- Step 3 (copy connection string from Connect --> driver -- enter previous password )
mongorestore --uri "mongodb+srv://shivanichhabra4u10:rzJnUw4hZWtsOmzU@wingroxcluster.rrbmh0f.mongodb.net" --drop C:\Backup\dump


## Getting Started

### Prerequisites
- Node.js 14.x or higher
- MongoDB 4.x or higher
- npm or yarn

### Installation

