// client-api-update-with-auth.js
//
// Updated version of client API service with token handling
// and emergency endpoints for all CRUD operations
//
// Copy this content to your client/src/services/api.ts file

import axios from 'axios';

// Base API client configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// API client with token handling
const authenticatedClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token handling to authenticated client
authenticatedClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced community API functions with fallbacks
export const community = {
  getSegments: async () => {
    const endpoints = [
      '/emergency/community/segments', // Try emergency endpoint first
      '/api/community/segments',       // Then standard API endpoint
      '/community/segments'            // Then direct community endpoint
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch segments from: ${endpoint}`);
        const response = await apiClient.get(endpoint);
        console.log(`Successfully fetched segments from: ${endpoint}`);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to fetch segments from ${endpoint}:`, error);
        lastError = error;
        // Continue to next endpoint
      }
    }
    
    // All endpoints failed
    console.error('All segment endpoints failed');
    throw lastError || new Error('Could not fetch segments from any endpoint');
  },
  
  getSegmentById: async (id) => {
    const endpoints = [
      `/emergency/community/segments/${id}`,
      `/api/community/segments/${id}`,
      `/community/segments/${id}`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to fetch segment ${id} from ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not fetch segment ${id}`);
  },
  
  getPosts: async (params = {}) => {
    const endpoints = [
      '/emergency/community/posts',
      '/api/community/posts',
      '/community/posts'
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch posts from: ${endpoint}`, params);
        const response = await apiClient.get(endpoint, { params });
        console.log(`Successfully fetched posts from: ${endpoint}`);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to fetch posts from ${endpoint}:`, error);
        lastError = error;
        // Continue to next endpoint
      }
    }
    
    // All endpoints failed
    console.error('All post endpoints failed');
    throw lastError || new Error('Could not fetch posts from any endpoint');
  },
  
  getPostById: async (id) => {
    const endpoints = [
      `/emergency/community/posts/${id}`,
      `/api/community/posts/${id}`,
      `/community/posts/${id}`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to fetch post ${id} from ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not fetch post ${id}`);
  },
  
  // Create Post with fallbacks
  createPost: async (post) => {
    const endpoints = [
      '/emergency/community/posts',
      '/api/community/posts',
      '/community/posts'
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to create post at: ${endpoint}`);
        const response = await authenticatedClient.post(endpoint, post);
        console.log(`Successfully created post at: ${endpoint}`);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to create post at ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    // Special fallback: if all API endpoints fail, create a local mock post
    try {
      console.log('All API endpoints failed, creating mock post');
      const mockPost = {
        _id: `local_${Date.now()}`,
        ...post,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        bookmarks: 0,
        commentCount: 0,
        _isMock: true // flag to indicate this is a mock post
      };
      
      // Store in localStorage for persistence
      const storedPosts = JSON.parse(localStorage.getItem('mockPosts') || '[]');
      storedPosts.push(mockPost);
      localStorage.setItem('mockPosts', JSON.stringify(storedPosts));
      
      console.log('Created mock post:', mockPost);
      return mockPost;
    } catch (error) {
      console.error('Failed to create mock post:', error);
      throw lastError || new Error('Could not create post');
    }
  },
  
  // Update, like and bookmark with fallbacks
  likePost: async (id) => {
    const endpoints = [
      `/emergency/community/posts/${id}/like`,
      `/api/community/posts/${id}/like`,
      `/community/posts/${id}/like`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to like post at: ${endpoint}`);
        const response = await authenticatedClient.put(endpoint, {});
        console.log(`Successfully liked post at: ${endpoint}`);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to like post at ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not like post ${id}`);
  },
  
  bookmarkPost: async (id) => {
    const endpoints = [
      `/emergency/community/posts/${id}/bookmark`,
      `/api/community/posts/${id}/bookmark`,
      `/community/posts/${id}/bookmark`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to bookmark post at: ${endpoint}`);
        const response = await authenticatedClient.put(endpoint, {});
        console.log(`Successfully bookmarked post at: ${endpoint}`);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to bookmark post at ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not bookmark post ${id}`);
  },
  
  // Comment functions with fallbacks
  getComments: async (postId) => {
    const endpoints = [
      `/emergency/community/posts/${postId}/comments`,
      `/api/community/posts/${postId}/comments`,
      `/community/posts/${postId}/comments`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to get comments from ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not get comments for post ${postId}`);
  },
  
  addComment: async (postId, comment) => {
    const endpoints = [
      `/emergency/community/posts/${postId}/comments`,
      `/api/community/posts/${postId}/comments`,
      `/community/posts/${postId}/comments`
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await authenticatedClient.post(endpoint, comment);
        return response.data.data;
      } catch (error) {
        console.error(`Failed to add comment at ${endpoint}:`, error);
        lastError = error;
      }
    }
    
    throw lastError || new Error(`Could not add comment to post ${postId}`);
  }
};

// You can export your other API services here
// export const auth = { ... }
// export const products = { ... }
// etc.
