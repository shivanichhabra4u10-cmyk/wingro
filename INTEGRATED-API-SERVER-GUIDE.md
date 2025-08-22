# Integrated API Server Guide

## Overview

This guide explains how we've consolidated multiple separate API servers into a single, integrated backend server. The integrated solution eliminates the need for running multiple servers and simplifies the architecture.

## Problem Statement

Previously, the application was using several separate API servers:

1. **Main Application API** (`app.js`) - The primary API server
2. **Emergency Community API** (`emergency-community-api.js`) - A separate server for community features
3. **Products API** (`guaranteed-products-api.js`) - A separate server for product management

This approach caused several issues:
- Increased complexity in deployment and maintenance
- Port conflicts and resource waste
- Confusing API structure with multiple endpoints for the same functionality
- Inconsistent data access patterns

## Solution

We've created an integrated API server that combines all functionality into a single Express application:

1. **Consolidated Routes**:
   - All community routes (`/api/community/*`, `/community/*`, `/emergency/community/*`)
   - All product routes (`/products`, `/api/products`, `/v1/products`, `/api/v1/products`)
   - All main application routes

2. **Shared Database Connection**:
   - Single MongoDB connection for all features
   - Consistent data models across all APIs

3. **Unified Error Handling**:
   - Standardized error handling and response formats
   - Common logging and monitoring

## Benefits

1. **Simplified Architecture**:
   - Single server to deploy and maintain
   - One codebase to manage

2. **Better Resource Utilization**:
   - Fewer processes running simultaneously
   - No port conflicts

3. **Improved Developer Experience**:
   - Easier debugging (single log stream)
   - Consistent patterns for adding new features

4. **Enhanced Reliability**:
   - Unified health checking
   - Single point of failure instead of multiple

## Usage Instructions

To use the integrated API server:

1. Run the PowerShell script:
   ```powershell
   .\run-integrated-api.ps1
   ```

2. This script will:
   - Stop any existing API servers
   - Install required dependencies
   - Start the integrated server
   - Verify all endpoints are working

3. Access all API endpoints from a single server at `http://localhost:3001`:
   - Community API: `/api/community/segments`, `/community/segments`, etc.
   - Products API: `/api/v1/products`, `/v1/products`, etc.
   - Health check: `/health`

## Implementation Details

The integrated server implements:

1. **Common Middleware**:
   - CORS handling
   - Request logging
   - JSON parsing

2. **Unified MongoDB Connection**:
   - Single connection pool shared across all routes
   - Automatic fallback to file-based storage when database is unavailable

3. **Route Compatibility**:
   - Support for all legacy routes to maintain backwards compatibility
   - New, standardized routes for future development

4. **Graceful Shutdown**:
   - Proper handling of server termination
   - Database connection closure

## Technical Architecture

The integrated server follows this architecture:

```
┌─────────────────────────────────┐
│      Integrated API Server      │
├─────────────────────────────────┤
│ ┌───────────┐ ┌───────────────┐ │
│ │ Community │ │ Product Routes │ │
│ │  Routes   │ │               │ │
│ └───────────┘ └───────────────┘ │
│ ┌───────────────────────────────┤
│ │     Main Application Routes   │ │
│ └───────────────────────────────┤
├─────────────────────────────────┤
│    Express.js + Middleware      │
├─────────────────────────────────┤
│      MongoDB Connection          │
└─────────────────────────────────┘
```

## Future Recommendations

1. **Standardize Route Structure**:
   - Move towards a consistent pattern like `/api/v1/resource`
   - Phase out legacy routes over time

2. **Enhanced API Documentation**:
   - Consider adding Swagger/OpenAPI documentation 
   - Create comprehensive API reference docs

3. **Authentication Integration**:
   - Implement consistent auth checks across all routes
   - Centralize permission management

4. **Monitoring and Logging**:
   - Add structured logging
   - Implement performance monitoring
   - Set up alerting for critical failures
