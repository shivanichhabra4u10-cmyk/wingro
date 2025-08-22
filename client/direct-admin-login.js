// direct-admin-login.js
// This script is meant to be run directly in the browser console

(function() {
  console.log('🔑 WinGroX Direct Admin Login Helper');
  console.log('==================================');
  
  // Clear any existing tokens
  localStorage.removeItem('token');
  console.log('✅ Cleared existing token');
  
  // Set correct admin token
  const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA";
  localStorage.setItem('token', adminToken);
  console.log('✅ Set new admin token');
  
  // Verify token was set correctly
  const token = localStorage.getItem('token');
  if (token === adminToken) {
    console.log('✅ Token verification successful');
  } else {
    console.error('❌ Token verification failed!');
  }
  
  // Decode token for validation
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('📋 Token payload:', payload);
    console.log('📋 Admin role:', payload.role === 'admin' ? '✅ Yes' : '❌ No');
    console.log('📋 Email:', payload.email);
    console.log('📋 Expires:', new Date(payload.exp * 1000).toLocaleString());
  } catch (e) {
    console.error('❌ Error parsing token:', e);
  }
  
  // Reload the page to apply token
  console.log('🔄 Reloading page to apply token...');
  window.location.reload();
})();
