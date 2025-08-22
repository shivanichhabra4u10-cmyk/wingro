// client-api-update.js
// 
// This file contains the updated API service code that should be
// integrated into your client's API service file.
//
// Example: Copy this code into client/src/services/api.ts

import axios from 'axios';

// Base API client configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Enhanced version of getSegments with multiple fallbacks
export async function getSegments() {
  // Try all possible endpoint patterns in order of preference
  const endpoints = [
    '/emergency/community/segments', // Try emergency endpoint first
    '/api/community/segments',       // Then standard API endpoint
    '/community/segments'            // Then direct community endpoint
  ];
  
  let lastError = null;
  
  // Try each endpoint in sequence
  for (const endpoint of endpoints) {
    try {
      console.log(`Attempting to fetch segments from: ${endpoint}`);
      const response = await apiClient.get(endpoint);
      console.log(`Successfully fetched segments from: ${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch segments from ${endpoint}:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }
  
  // All endpoints failed
  console.error('All segment endpoints failed');
  throw lastError || new Error('Could not fetch segments from any endpoint');
}

// Enhanced version of getPosts with multiple fallbacks
export async function getPosts(params = {}) {
  const endpoints = [
    '/emergency/community/posts', // Try emergency endpoint first
    '/api/community/posts',       // Then standard API endpoint
    '/community/posts'            // Then direct community endpoint
  ];
  
  let lastError = null;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Attempting to fetch posts from: ${endpoint}`);
      const response = await apiClient.get(endpoint, { params });
      console.log(`Successfully fetched posts from: ${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch posts from ${endpoint}:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }
  
  // All endpoints failed
  console.error('All post endpoints failed');
  throw lastError || new Error('Could not fetch posts from any endpoint');
}

// Example usage:
/*
import { getSegments, getPosts } from './api';

// In a React component
useEffect(() => {
  async function fetchData() {
    try {
      // This will try all endpoints until one works
      const segmentsData = await getSegments();
      setSegments(segmentsData.data);
      
      // This will also try all endpoints
      const postsData = await getPosts({ segmentId: 'career-plateau' });
      setPosts(postsData.data);
    } catch (error) {
      console.error('Failed to fetch community data:', error);
      setError('Failed to load community data. Please try again later.');
    }
  }
  
  fetchData();
}, []);
*/
