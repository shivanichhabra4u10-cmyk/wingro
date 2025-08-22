# Server Migration Guide: From products-api to server

## Overview

This document explains the process of migrating functionality from the standalone `products-api` directory to the main TypeScript-based `server` directory. The goal is to consolidate all backend functionality into a single, well-structured server application.

## Why Consolidate?

The `products-api` directory was created as a temporary solution or fallback for product-related functionality. However, maintaining two separate backend codebases creates several challenges:

1. **Code Duplication**: Similar functionality exists in both places
2. **Maintenance Burden**: Bug fixes and features need to be implemented twice
3. **Confusion**: Developers need to know which server handles which endpoints
4. **Inconsistent Architecture**: One uses JavaScript with inline models, the other TypeScript with proper MVC structure

## What Was Migrated

The following functionality has been migrated from `products-api` to the main `server`:

1. **Community Segments**: Model, controller, and routes for community segments
2. **Community Posts**: Model, controller, and routes for community posts
3. **Comments**: Model, controller, and routes for post comments
4. **Associated Endpoints**: All API endpoints for the above functionality

## New Structure

The migrated functionality follows the established server architecture:

- **Models**: `/server/src/models/`
  - `communitySegment.model.ts`
  - `communityPost.model.ts`
  - `comment.model.ts`

- **Controllers**: `/server/src/controllers/`
  - `community.controller.ts` (handles segments, posts, and comments)

- **Routes**: `/server/src/routes/`
  - `community.routes.ts` (defines all community-related endpoints)

- **Scripts**: `/server/src/scripts/`
  - `initialize-community-data.ts` (populates sample data)

## API Endpoints

All community endpoints are now available under the `/community` path:

- **Segments**
  - GET `/community/segments` - Get all segments
  - GET `/community/segments/:id` - Get segment by ID
  - POST `/community/segments` - Create new segment (authenticated)
  - PUT `/community/segments/:id` - Update segment (authenticated)
  - DELETE `/community/segments/:id` - Delete segment (authenticated)

- **Posts**
  - GET `/community/posts` - Get all posts (with filtering options)
  - GET `/community/posts/:id` - Get post by ID
  - POST `/community/posts` - Create new post (authenticated)
  - PUT `/community/posts/:id` - Update post (authenticated)
  - DELETE `/community/posts/:id` - Delete post (authenticated)
  - POST `/community/posts/:id/like` - Like a post
  - POST `/community/posts/:id/bookmark` - Bookmark a post

- **Comments**
  - GET `/community/posts/:id/comments` - Get comments for a post
  - POST `/community/posts/:id/comments` - Add comment to a post (authenticated)
  - POST `/community/posts/:id/comments/:commentId/like` - Like a comment
  - DELETE `/community/posts/:id/comments/:commentId` - Delete a comment (authenticated)
  - POST `/community/posts/:id/comments/:commentId/replies` - Reply to a comment (authenticated)

## Client Impact

The client application has been updated to use the new consolidated API endpoints. The changes include:

- Using the main server endpoints for all community functionality
- Fallback mechanism to handle both `/community/*` and `/api/community/*` paths for backward compatibility
- Updated interface definitions to match server models

## Next Steps

After the migration, consider the following:

1. Verify all functionality in the client application
2. Run integration tests to ensure proper communication between client and server
3. Consider phasing out the `products-api` directory once stable
4. Update any documentation or API references to point to the new endpoints
5. Train team members on the new consolidated architecture

## Conclusion

This migration simplifies the application's backend architecture and aligns with best practices for maintainability and organization. All backend functionality now resides in a single, well-structured TypeScript application with proper separation of concerns through the MVC pattern.
