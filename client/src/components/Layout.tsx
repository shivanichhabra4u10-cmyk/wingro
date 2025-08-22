import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}




const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Use real authentication context
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation with all submenus restored
  const navigation = [
    {
      name: 'About Us',
      icon: '🏢',
      submenu: [
        { name: 'Our Story', href: '/about-us' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Why Choose Us', href: '/why-wingrox' },
        { name: 'Who We Serve', href: '/who-we-serve' },
      ],
    },
    {
      name: 'Digital Solutions',
      icon: '🛠️',
      submenu: [
        { name: 'Product Store', href: '/products' },
        { name: 'Branding Kit', href: '/branding-kit' },
        { name: 'Diagnostic Tool', href: '/diagnostic-tool' },
        { name: 'Playbooks', href: '/playbooks' },
        { name: 'Book a Coach', href: '/marketplace' },
  { name: 'Join as Coach', href: '/join-as-coach' },
      ],
    },
    {
      name: 'Knowledge Hub',
      icon: '�',
      submenu: [
        { name: 'Knowledge Hub Home', href: '/knowledge' },
        { name: 'Assessment Selection', href: '/assessment-selection' },
      ],
    },
    {
      name: 'Community',
      icon: '👨‍👩‍👧‍👦',
      submenu: [
        { name: 'Join Community', href: '/grow-with-community' },
        { name: 'Free Assessments', href: '/assessment-selection' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className={`backdrop-blur-md bg-white/90 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md transition-all group-hover:scale-110 group-hover:shadow-lg relative overflow-hidden">
                <span className="relative z-10">WX</span>
                <div className="absolute inset-0 bg-white/20 blur-sm transform rotate-45 translate-x-8 translate-y-8"></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700">
                WinGroX AI
              </span>
            </Link>
            {/* Navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {navigation.map((item) => {
                if (item.submenu && item.submenu.length > 0) {
                  return (
                    <div key={item.name} className="relative group">
                      <button
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-left ${
                          item.submenu.some((sub) => location.pathname === sub.href)
                            ? 'text-gray-900 bg-blue-100'
                            : 'text-gray-900 bg-blue-50 hover:bg-blue-100 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        type="button"
                        tabIndex={0}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </button>
                      {activeDropdown === item.name && (
                        <div
                          className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50 border border-gray-200 animate-fade-in"
                          onMouseLeave={() => setActiveDropdown(null)}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              className={`block px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 ${
                                location.pathname === sub.href
                                  ? 'bg-gray-200 text-gray-900 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else if ('href' in item && item.href) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-left ${
                        location.pathname === item.href
                          ? 'text-gray-900 bg-blue-100'
                          : 'text-gray-900 bg-blue-50 hover:bg-blue-100 hover:text-gray-900'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                } else {
                  return null;
                }
              })}
              {/* Admin menu for admin users */}
              {isAdmin && <AdminMenu />}
            </div>
            {/* User menu */}
            <div className="flex items-center ml-2">
              {user ? (
                <div className="relative group">
                  <button
                    className="flex items-center bg-gray-50 rounded-full pl-1 pr-2 py-1 border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all hover:shadow-md hover:border-gray-400"
                    onClick={() => setActiveDropdown(activeDropdown === 'user-menu' ? null : 'user-menu')}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === 'user-menu'}
                  >
                    <div
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-indigo-400 flex items-center justify-center text-white font-extrabold mr-1 shadow border-2 border-white group-hover:scale-105 transition-all duration-200"
                    >
                      {user.name ? user.name[0].toUpperCase() : ''}
                    </div>
                    <svg
                      className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${activeDropdown === 'user-menu' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {activeDropdown === 'user-menu' && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-4 z-[100] border border-gray-100 animate-fade-in backdrop-blur-md transition-all flex flex-col items-start"
                      style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)' }}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="flex flex-col items-start gap-1 px-4 py-2 border-b border-gray-100 mb-2 w-full">
                        <span className="font-semibold text-gray-900 text-base">{user?.name}</span>
                        <span className="text-xs text-gray-500">{user?.email}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 w-full justify-start"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="h-6 w-6 flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </span>
                        Profile
                      </Link>
                      <Link
                        to="/cart"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 w-full justify-start"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="h-6 w-6 flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                        </span>
                        Cart
                      </Link>
                      <div className="my-2 border-t border-gray-100 w-full"></div>
                      <button
                        onClick={() => {
                          logout();
                          setActiveDropdown(null);
                        }}
                        className="hidden"
                      >Sign out</button>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          logout();
                          setActiveDropdown(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 w-full justify-start cursor-pointer"
                        role="menuitem"
                      >
                        <span className="h-6 w-6 flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 8v8a4 4 0 004 4h1"/></svg>
                        </span>
                        Sign out
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-700 hover:text-cyan-700 px-4 py-1.5 rounded-full hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="bg-gradient-to-b from-white to-blue-50/50 mt-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <h3 className="text-sm font-semibold text-gray-700">About Us</h3>
              <Link to="/about-us" className="text-xs text-gray-500 hover:text-blue-600">Our Story</Link>
              <Link to="/how-it-works" className="text-xs text-gray-500 hover:text-blue-600">How It Works</Link>
              <Link to="/why-wingrox" className="text-xs text-gray-500 hover:text-blue-600">Why Choose Us</Link>
            </div>
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <h3 className="text-sm font-semibold text-gray-700">Solutions</h3>
              <Link to="/products" className="text-xs text-gray-500 hover:text-blue-600">Product Store</Link>
              <Link to="/marketplace" className="text-xs text-gray-500 hover:text-blue-600">Book a Coach</Link>
              <Link to="/join-as-coach" className="text-xs text-gray-500 hover:text-blue-600">Join as Coach</Link>
              <Link to="/knowledge" className="text-xs text-gray-500 hover:text-blue-600">Knowledge Hub</Link>
            </div>
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <h3 className="text-sm font-semibold text-gray-700">Community</h3>
              <Link to="/grow-with-community" className="text-xs text-gray-500 hover:text-blue-600">Join Community</Link>
              <Link to="/assessment-selection" className="text-xs text-gray-500 hover:text-blue-600">Free Assessments</Link>
            </div>
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <h3 className="text-sm font-semibold text-gray-700">Contact & Support</h3>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-blue-600">Contact Us</Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-blue-600">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-gray-500 hover:text-blue-600">Terms of Service</Link>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} WinGroX AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
