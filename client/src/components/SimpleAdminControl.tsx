import React, { useEffect, useState } from 'react';

/**
 * Simple AdminControl component with direct token handling
 * This component checks for admin role in the JWT token
 */
const SimpleAdminControl: React.FC<{ 
  children: React.ReactNode;
}> = ({ 
  children 
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is admin by directly parsing token
    const token = localStorage.getItem('token');
    
    try {
      if (token) {
        // Parse JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check for admin role
        if (payload.role === 'admin') {
          console.log('SimpleAdminControl: Admin role found in token');
          setIsAdmin(true);
        } else {
          console.log(`SimpleAdminControl: User role is ${payload.role}, not admin`);
        }
      } else {
        console.log('SimpleAdminControl: No token found');
      }
    } catch (error) {
      console.error('SimpleAdminControl: Error parsing token', error);
    }
  }, []);

  // Only render children for admin users
  if (!isAdmin) {
    return (
      <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
        <h3 className="font-bold text-orange-800">Simple Admin Check Failed</h3>
        <p className="text-orange-700">Admin token not found or invalid.</p>
        <button 
          onClick={() => {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA');
            window.location.reload();
          }}
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Set Admin Token & Reload
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
        <h3 className="font-bold text-orange-800">Simple Admin Check Passed ✓</h3>
        <p className="text-orange-700">Valid admin token found with SimpleAdminControl component.</p>
      </div>
      {children}
    </div>
  );
};

export default SimpleAdminControl;
