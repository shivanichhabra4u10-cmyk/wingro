import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth token
api.interceptors.request.use(
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

// Applications API service
export const applications = {
  // Submit coach application
  submitCoachApplication: async (applicationData: any) => {
    try {
      console.log("Submitting coach application:", applicationData);
      const response = await api.post('/applications/coach', applicationData);
      return response.data;
    } catch (error) {
      console.error("Failed to submit coach application:", error);
      throw error;
    }
  },
  
  // Check application status (if implemented)
  checkApplicationStatus: async (applicationId: string, email: string) => {
    try {
      const response = await api.get(`/applications/coach/status`, { 
        params: { id: applicationId, email } 
      });
      return response.data;
    } catch (error) {
      console.error("Failed to check application status:", error);
      throw error;
    }
  }
};

export default applications;
