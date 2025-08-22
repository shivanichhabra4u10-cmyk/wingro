import React, { useEffect, useState } from 'react';

interface AdminBadgeProps {
  className?: string;
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ className = '' }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if user is admin
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Only check admin if token looks like a JWT (3 parts, base64 middle)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          setIsAdmin(payload.role === 'admin');
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        // Not a JWT (e.g. dev-mock-token), skip admin check
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  }, []);
  
  if (!isAdmin) return null;
  
  return (
    <div className={`inline-flex items-center bg-indigo-600 text-white text-xs px-2 py-1 rounded-full ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
      Admin
    </div>
  );
};

export default AdminBadge;
