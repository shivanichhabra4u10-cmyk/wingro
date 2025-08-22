

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function HomePage() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #e0e7ff' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Welcome to WinGroX AI</h2>
      <p style={{ fontSize: '1.1rem', color: '#374151' }}>This is the public Home page. Sign in to access your dashboard and admin features.</p>
    </div>
  );
}

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ textAlign: 'center', marginBottom: 24 }}>
      <Link to="/" style={{ margin: 8, padding: '8px 24px', borderRadius: 8, background: '#38bdf8', color: '#fff', fontWeight: 600, border: 'none', textDecoration: 'none' }}>Home</Link>
      {!user && <Link to="/login" style={{ margin: 8, padding: '8px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', textDecoration: 'none' }}>Sign In</Link>}
      {!user && <Link to="/register" style={{ margin: 8, padding: '8px 24px', borderRadius: 8, background: '#34d399', color: '#fff', fontWeight: 600, border: 'none', textDecoration: 'none' }}>Sign Up</Link>}
      {user && <button onClick={logout} style={{ margin: 8, padding: '8px 24px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600, border: 'none' }}>Sign Out</button>}
      {user && user.role === 'admin' && <Link to="/admin" style={{ margin: 8, padding: '8px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', textDecoration: 'none' }}>Admin</Link>}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, #1e3a8a 0%, #6366f1 100%)' }}>
          <header style={{ padding: '32px 0 16px 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(90deg, #38bdf8, #34d399)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              WinGroX AI
            </h1>
            <h2 style={{ fontSize: '1.25rem', color: '#dbeafe', fontWeight: 500 }}>
              Your AI-Powered Growth Partner
            </h2>
          </header>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
