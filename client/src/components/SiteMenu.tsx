import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuLinks = [
  { to: '/', label: 'Marketplace' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Admin' },
];

const SiteMenu: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-indigo-700 font-bold text-xl tracking-tight hover:text-indigo-900">
            <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            WinGroX AI
          </Link>
          <div className="hidden md:flex gap-2 ml-6">
            {menuLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith(link.to) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-gray-700 text-sm">{user.name || user.email}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
                title="Logout"
              >Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">Login</Link>
          )}
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Implement hamburger menu if needed */}
        </div>
      </div>
    </nav>
  );
};

export default SiteMenu;
