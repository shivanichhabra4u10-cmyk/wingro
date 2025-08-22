import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';


interface AdminMenuProps {
  className?: string;
  onMenuClose?: () => void;
  isMobile?: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  className = '', 
  onMenuClose, 
  isMobile = false 
}) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Only show admin menu for admin users
  if (!isAdmin) return null;

  const adminItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      description: 'Admin dashboard overview',
      icon: '🏠'
    },
    { 
      name: 'Product Management', 
      href: '/admin/products', 
      description: 'Add, edit, and delete products',
      icon: '📦'
    },
    { 
      name: 'Coach Management', 
      href: '/admin/coaches', 
      description: 'Manage Growth Architects',
      icon: '👨‍🏫'
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      description: 'View and manage all bookings',
      icon: '📅'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      description: 'Manage platform users',
      icon: '👥'
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      description: 'Platform metrics and insights',
      icon: '📊'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      description: 'Platform configuration',
      icon: '⚙️'
    }
  ];

  const isActive = (path: string) => {
    // Special case for dashboard (main admin page)
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    // For other admin pages
    return location.pathname.includes('/admin') && location.pathname.includes(path);
  };

  // Handle mobile view of the admin menu
  if (isMobile) {
    return (
      <div className={`mb-4 ${className}`}>
        <Link
          to="/admin"
          className={`${
            location.pathname.startsWith('/admin')
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-indigo-50 text-gray-700 hover:bg-indigo-100'
          } flex items-center justify-between px-4 py-2.5 rounded-t-lg text-base font-medium`}
          onClick={() => onMenuClose ? null : null}
        >
          <span className="flex items-center gap-2">
            <span>👑</span>
            <span>Admin Panel</span>
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </Link>
        
        <div className="bg-white rounded-b-lg shadow-sm mb-2 border border-indigo-100/50 border-t-0">
          {adminItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-2.5 px-4 border-t border-gray-50 ${isActive(item.href) ? 'bg-indigo-50' : 'hover:bg-indigo-50'}`}
              onClick={onMenuClose}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="block text-sm font-medium text-gray-800">{item.name}</span>
              </span>
              {item.description && (
                <span className="text-xs text-gray-500 ml-6">{item.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => {
        if (dropdownTimerRef.current) {
          clearTimeout(dropdownTimerRef.current);
        }
        setIsDropdownOpen(true);
      }}
      onMouseLeave={() => {
        dropdownTimerRef.current = setTimeout(() => {
          setIsDropdownOpen(false);
        }, 200);
      }}
    >
      <Link
        to="/admin"
        className={`${
          location.pathname.startsWith('/admin')
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
            : 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50/60'
        } flex items-center gap-1.5 mx-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300`}
      >
        <span>👑</span>
        <span>Admin</span>
        <svg 
          className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </Link>
      
      <div 
        className={`absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-3 px-4 z-50 border border-indigo-100/50 transform transition-all duration-300 origin-top ${
          isDropdownOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={() => {
          if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
          }
        }}
        onMouseLeave={() => {
          dropdownTimerRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
          }, 200);
        }}
      >
        <div className="mb-2 pb-2 border-b border-gray-100">
          <p className="text-xs font-medium text-indigo-600">Admin Panel</p>
        </div>
        <div className="space-y-2">
          {adminItems.map((item) => {
            const isItemActive = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-2 px-3 rounded-lg ${
                  isItemActive
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'hover:bg-indigo-50'
                } transition-colors duration-200`}
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <span className={`text-sm font-medium ${isItemActive ? 'text-indigo-600' : 'text-gray-800'}`}>
                    {item.name}
                  </span>
                </span>
                {item.description && (
                  <span className="text-xs text-gray-500 ml-6">{item.description}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
