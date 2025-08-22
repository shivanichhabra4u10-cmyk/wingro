# Community API Implementation Guide

## Overview

This document provides guidance on using the permanently integrated community API in the WinGroX AI application. The community API has been properly integrated into the main server application, eliminating the need for emergency solutions or separate servers.

## API Endpoints

All community endpoints are now available through multiple paths for backward compatibility:

### Segments

- `GET /api/community/segments` - Get all community segments
- `GET /community/segments` - Alternative path for segments
- `GET /emergency/community/segments` - Legacy path for segments
- `GET /api/community/segments/:id` - Get segment by ID

### Posts

- `GET /api/community/posts` - Get all community posts (with filtering)
- `GET /community/posts` - Alternative path for posts
- `GET /emergency/community/posts` - Legacy path for posts
- `GET /api/community/posts/:id` - Get post by ID
- `POST /api/community/posts` - Create new post (requires authentication)
- `PUT /api/community/posts/:id` - Update post (requires authentication)
- `DELETE /api/community/posts/:id` - Delete post (requires authentication)

### Interactions

- `POST /api/community/posts/:id/like` - Like a post
- `POST /api/community/posts/:id/bookmark` - Bookmark a post
- `GET /api/community/posts/:id/comments` - Get comments for a post
- `POST /api/community/posts/:id/comments` - Add comment to a post (requires authentication)

## How to Use

1. Start the server with the integrated community API:
   ```powershell
   .\run-permanent-community-api.ps1
   ```

2. Access any of the community endpoints using your preferred path:
   ```
   http://localhost:3000/api/community/segments
   http://localhost:3000/community/segments
   http://localhost:3000/emergency/community/segments
   ```

3. To verify that the integration is working correctly, run:
   ```powershell
   .\verify-community-integration.ps1
   ```

## Response Format

All endpoints return data in a consistent format:

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "career-plateau",
      "name": "Career Plateau",
      "description": "Discussions and advice for professionals feeling stuck in their career growth.",
      "icon": "chart-line-stagnant",
      "color": "#e57373",
      "postCount": 25
    },
    // More items...
  ]
}
```

## Error Handling

If an error occurs, the API will return:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Client Integration

The client application can continue using the same endpoints without any changes. All previous paths are supported for backward compatibility.
