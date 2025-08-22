import axios from 'axios';

// Create a centralized admin API service with proper error handling
const adminApi = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for admin operations
});

// Add auth token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error information
    console.error('Admin API Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      status: error.response?.status || 'Network Error',
      data: error.response?.data || error.message
    });

    // Add fallback logic for API endpoints
    const originalRequest = error.config;
    
    if (error.response?.status === 404 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try alternative endpoint patterns
      if (originalRequest.url.startsWith('/products')) {
        originalRequest.url = `/v1${originalRequest.url}`;
        return adminApi(originalRequest);
      }
      
      if (originalRequest.url.startsWith('/coaches')) {
        originalRequest.url = `/v1${originalRequest.url}`;
        return adminApi(originalRequest);
      }
    }
    
    return Promise.reject({
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      originalError: error
    });
  }
);

// Product operations
export const productsAdmin = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/products');
      // Return the data structure, properly handling both response formats
      return response.data; // The AdminProducts component will handle the "data" property
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await adminApi.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  create: async (productData: any) => {
    try {
      const response = await adminApi.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  update: async (id: string, productData: any) => {
    try {
      const response = await adminApi.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await adminApi.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};

// Coach operations
export const coachesAdmin = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/coaches');
      return response.data;
    } catch (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await adminApi.get(`/coaches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching coach ${id}:`, error);
      throw error;
    }
  },
  
  create: async (coachData: any) => {
    try {
      const response = await adminApi.post('/coaches', coachData);
      return response.data;
    } catch (error) {
      console.error('Error creating coach:', error);
      throw error;
    }
  },
  
  update: async (id: string, coachData: any) => {
    try {
      const response = await adminApi.put(`/coaches/${id}`, coachData);
      return response.data;
    } catch (error) {
      console.error(`Error updating coach ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await adminApi.delete(`/coaches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting coach ${id}:`, error);
      throw error;
    }
  }
};

// User operations
export const usersAdmin = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await adminApi.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  updateRole: async (id: string, role: string) => {
    try {
      const response = await adminApi.patch(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error(`Error updating role for user ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await adminApi.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};

// Dashboard statistics
export const dashboardAdmin = {
  getStats: async () => {
    try {
      const response = await adminApi.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  }
};

export default adminApi;
