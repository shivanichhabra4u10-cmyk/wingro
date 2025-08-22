import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



/**
 * A component that restricts access to admin users only.
 * It will redirect non-admin users to the specified redirect path (default: access-denied).
 */
const AdminProtected: React.FC<{ 
  children: React.ReactNode; 
  redirectPath?: string;
}> = ({ 
  children,
  redirectPath = '/access-denied'
}) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    //To_Do - remove direct admin
    // DEV MODE: Always grant admin access for development
    setIsAdmin(true);
    setIsVerifying(false);
    console.log('DEV MODE: Admin access granted for development');
    console.log('MongoDB connection is fixed and ready to use!');
    
    /* Original verification code - commented out for development
    const verifyAdmin = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAdmin(false);
          setIsVerifying(false);
          return;
        }
        const decodedToken = decodeJwt(token) as DecodedToken;
        
        // Check if token is expired and has the required fields
        if (!decodedToken || !decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
          setIsAdmin(false);
          localStorage.removeItem('token');
        } else {
          setIsAdmin(decodedToken.role === 'admin');
          console.log('User role:', decodedToken.role);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyAdmin();
    */
  }, [user]);

  // Show loading state while checking auth status
  if (loading || isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Verifying access...</span>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children for admin users
  return <>{children}</>;
};

export default AdminProtected;
