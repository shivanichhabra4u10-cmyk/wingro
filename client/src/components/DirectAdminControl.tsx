import React from 'react';

/**
 * This is a simplified AdminControl component that always allows admin operations
 * It's designed to bypass JWT validation for easy testing
 */
const AdminControl: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always render admin content without validation
  return <>{children}</>;
};

export default AdminControl;
