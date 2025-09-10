import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isCoach?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogleToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      const getCurrentUser = async () => {
        try {
          //To_do - Implement token verification
          const response = await auth.verifyToken();
          // response may be just the JWT payload, so map to user object
          const userObj = {
            id: (response as any).userId || (response as any).id || '',
            name: (response as any).name || '',
            email: (response as any).email || '',
            role: (response as any).role || '',
          };
          setUser(userObj);
          setIsAuthenticated(true);
          // Use userObj.role for admin detection (always up-to-date)
          setIsAdmin(userObj.role === 'admin');
        } catch {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      };
      getCurrentUser();
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
    }
  }, []);  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      // Save JWT token to localStorage for authenticated requests
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
    } catch (error) {
      // Remove any legacy/hardcoded user from localStorage
      localStorage.removeItem('user');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };


  const loginWithGoogleToken = async (token: string) => {
    try {
      // Call backend endpoint to verify Google token and get JWT
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      });
      if (!response.ok) throw new Error('Google login failed');
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user?.role === 'admin');
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    window.location.href = '/login';
  };
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      isAuthenticated,
      login, 
      register, 
      logout,
      loginWithGoogleToken
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
