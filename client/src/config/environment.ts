/**
 * Environment configuration for the application
 * These settings can be overridden by environment variables
 */

// Default storage provider: 'firebase' or 'r2'
export const DEFAULT_STORAGE_PROVIDER = process.env.REACT_APP_STORAGE_PROVIDER || 'firebase';

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

// Cloudflare R2 configuration
export const R2_CONFIG = {
  accountId: process.env.REACT_APP_R2_ACCOUNT_ID || '',
  accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.REACT_APP_R2_BUCKET_NAME || 'wingrox-products',
  customDomain: process.env.REACT_APP_R2_CUSTOM_DOMAIN || '', // e.g. https://files.yourdomain.com
};

// File upload settings
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '52428800', 10), // 50MB default
  allowedFileTypes: (process.env.REACT_APP_ALLOWED_FILE_TYPES || 'pdf,video,presentation,excel,image').split(','),
  productFilesPath: process.env.REACT_APP_PRODUCT_FILES_PATH || 'products',
};

// API configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10), // 30s default
};

/**
 * Helper function to check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Helper function to get the current storage provider
 */
export const getStorageProvider = (): 'firebase' | 'r2' | 'mock' => {
  // Check for localStorage override (used when switching providers at runtime)
  const localStorageProvider = localStorage.getItem('STORAGE_PROVIDER');
  if (localStorageProvider === 'firebase' || localStorageProvider === 'r2') {
    return localStorageProvider;
  }

  // If in development and no specific provider configured, use mock
  if (isDevelopment() && DEFAULT_STORAGE_PROVIDER !== 'firebase' && DEFAULT_STORAGE_PROVIDER !== 'r2') {
    return 'mock';
  }

  // Use configured provider
  return DEFAULT_STORAGE_PROVIDER as 'firebase' | 'r2';
};
