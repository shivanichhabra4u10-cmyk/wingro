import React, { useEffect, useState } from 'react';

interface DecodedToken {
  sub?: string;
  role: string;
  exp: number;
  email?: string;
}

/**
 * Enhanced JWT decode function with better error handling and logging
 * This function parses a JWT token and returns the decoded payload
 */
function decodeJwt(token: string): DecodedToken | null {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format - token does not have 3 parts');
      return null;
    }
    
    // Decode the payload (middle part)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Handle padding
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    let jsonPayload;
    try {
      // For browsers
      jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (e) {
      // Alternative approach for some environments
      const raw = Buffer.from(paddedBase64, 'base64').toString('utf8');
      jsonPayload = decodeURIComponent(encodeURIComponent(raw));
    }
    
    const parsed = JSON.parse(jsonPayload);
    console.log('Decoded JWT payload:', { 
      ...parsed, 
      exp: parsed.exp ? new Date(parsed.exp * 1000).toISOString() : 'none' 
    });
    return parsed as DecodedToken;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * A component that only renders its children if the user is an admin
 */
const AdminControl: React.FC<{ 
  children: React.ReactNode;
}> = ({ 
  children 
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);  useEffect(() => {
    // Verify admin role from JWT token with improved logging and debugging
    const verifyAdmin = () => {
      try {
        console.log('🔍 AdminControl: Verifying admin status...');
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('❌ AdminControl: No token found in localStorage');
          console.log('💡 Tip: Use the demo admin login button or set a token manually');
          setIsAdmin(false);
          setIsVerifying(false);
          return;
        }
        
        console.log('📋 AdminControl: Token found, attempting to decode...');
        console.log(`📋 AdminControl: Token: ${token.substring(0, 20)}...`);
        
        // Manually decode token to avoid dependencies and ensure it works
        try {
          // Get the payload part (second part of the JWT)
          const parts = token.split('.');
          if (parts.length !== 3) {
            throw new Error('Invalid token format');
          }
          
          const payload = parts[1];
          // Convert from base64 to JSON
          const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
          const tokenData = JSON.parse(decodedPayload);
          
          console.log('✅ AdminControl: Token decoded successfully:', tokenData);
          
          // Check if token has admin role
          const role = tokenData.role;
          console.log(`📋 AdminControl: User role from token: ${role}`);
          
          // Check expiration
          const exp = tokenData.exp;
          const nowSeconds = Math.floor(Date.now() / 1000);
          const isExpired = exp && exp < nowSeconds;
          
          if (isExpired) {
            console.error('❌ AdminControl: Token expired', {
              expiry: new Date(exp * 1000).toLocaleString(),
              now: new Date().toLocaleString()
            });
            setIsAdmin(false);
          } else if (role !== 'admin') {
            console.error(`❌ AdminControl: User does not have admin role (has '${role}' instead)`);
            setIsAdmin(false);
          } else {
            console.log('✅ AdminControl: Valid admin token found!');
            setIsAdmin(true);
          }
        } catch (decodeError) {
          console.error('❌ AdminControl: Error manually decoding token:', decodeError);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyAdmin();
  }, []);

  // Show nothing while verifying
  if (isVerifying) {
    return null;
  }
  // Add a debug message in the UI for development purposes
  if (!isAdmin) {
    console.warn("Admin access denied - not displaying admin controls");
  } else {
    console.log("Admin access granted - admin controls should be visible");
  }
  // Only render children for admin users
  return isAdmin ? (
    <>
      {/* Add a subtle indicator to show admin status */}
      <div className="bg-green-100 border-l-4 border-green-500 p-2 mb-4 text-sm">
        <p className="font-bold">Admin Controls Active</p>
        <p>You are seeing this section because you have admin privileges.</p>
        <p className="mt-1 text-xs text-green-700">If you're expecting to see "ADD NEW PRODUCT" button, it should appear below.</p>
      </div>
      {children}
    </>
  ) : (
    <div className="bg-red-100 border-l-4 border-red-500 p-2 mb-4 text-sm">
      <p className="font-bold">Admin Controls Hidden</p>
      <p>You need admin privileges to manage products. Contact your administrator.</p>
      <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
        <p>Debug info:</p>
        <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
        <p>Role verification failed - JWT does not have admin role.</p>
      </div>
    </div>
  );
};

export default AdminControl;
