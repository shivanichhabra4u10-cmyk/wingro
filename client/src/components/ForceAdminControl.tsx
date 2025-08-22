import React, { useEffect, useState } from 'react';

/**
 * Enhanced AdminControl component with more robust token handling
 * This component only renders its children if the user has admin privileges
 */
const ForceAdminControl: React.FC<{ 
  children: React.ReactNode;
}> = ({ 
  children 
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    // Always log at start for debugging
    console.log('🔍 ForceAdminControl: Starting admin verification...');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ ForceAdminControl: No token found in localStorage');
        setTokenError('No token found. Please login as admin.');
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }
      
      console.log('📋 ForceAdminControl: Token found, decoding...');
      
      // Decode token parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ ForceAdminControl: Invalid token format - not a valid JWT');
        setTokenError('Invalid token format.');
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }
      
      try {
        // Decode payload
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        const payload = JSON.parse(jsonPayload);
        
        console.log('✅ ForceAdminControl: Token decoded:', { 
          email: payload.email,
          role: payload.role,
          exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'none'
        });
        
        // Check for admin role
        if (payload.role !== 'admin') {
          console.error(`❌ ForceAdminControl: Token does not have admin role (found '${payload.role}')`);
          setTokenError(`Token has role '${payload.role}', not 'admin'`);
          setIsAdmin(false);
          setIsChecking(false);
          return;
        }
        
        // Check expiration if present
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp < now) {
            console.error('❌ ForceAdminControl: Token expired');
            setTokenError(`Token expired on ${new Date(payload.exp * 1000).toLocaleString()}`);
            setIsAdmin(false);
            setIsChecking(false);
            return;
          }
        }
        
        // If we got here, token is valid with admin role
        console.log('✅ ForceAdminControl: Valid admin token - granting access');
        setIsAdmin(true);
        setTokenError(null);
        setIsChecking(false);
        
      } catch (decodeError) {
        console.error('❌ ForceAdminControl: Error decoding token:', decodeError);
        setTokenError(`Error decoding token: ${(decodeError as Error).message}`);
        setIsAdmin(false);
        setIsChecking(false);
      }
    } catch (error) {
      console.error('❌ ForceAdminControl: Unexpected error:', error);
      setTokenError(`Unexpected error: ${(error as Error).message}`);
      setIsAdmin(false);
      setIsChecking(false);
    }
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="bg-blue-50 p-4 rounded-md animate-pulse">
        <p className="text-blue-500">Verifying admin access...</p>
      </div>
    );
  }

  // Show admin content for admin users
  return isAdmin ? (
    <>
      <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
        <h3 className="font-bold text-green-800">Admin Controls Active ✅</h3>
        <p className="text-green-700">You are seeing this section because you have admin privileges.</p>
      </div>
      {children}
    </>
  ) : (
    <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
      <h3 className="font-bold text-red-800">Admin Controls Hidden ❌</h3>
      <p className="text-red-700">You need admin privileges to view this section.</p>
      
      <div className="mt-4 p-4 bg-white rounded-md border border-red-200">
        <h4 className="font-bold text-gray-800 mb-2">Troubleshooting</h4>
        
        {tokenError && (
          <div className="mb-3 text-red-600 text-sm font-mono">
            Error: {tokenError}
          </div>
        )}
        
        <p className="mb-2 text-gray-700 text-sm">Try these steps:</p>
        <ol className="list-decimal list-inside text-sm text-gray-700">
          <li>Login with admin credentials (admin@wingrox.ai / admin123)</li>
          <li>Set admin token manually in browser console:
            <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto">
              localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
              window.location.reload();
            </pre>
          </li>
          <li>Check browser console (F12) for error messages</li>
          <li>Open admin-access-fix.html from the project root</li>
        </ol>
        
        <button 
          onClick={() => {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
            window.location.reload();
          }}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Set Admin Token & Refresh
        </button>
      </div>
    </div>
  );
};

export default ForceAdminControl;
