// Script to test and verify admin menu functionality
console.log('Testing Admin Menu functionality...');

const checkAdminMenu = () => {
  console.log('=== Admin Menu Test ===');
  
  // 1. Check if token exists
  const token = localStorage.getItem('token');
  console.log('1. Token exists:', !!token);
  
  // 2. Check if token is valid and contains admin role
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('2. Token payload:', payload);
      console.log('   - Is admin:', payload.role === 'admin');
      console.log('   - Token expiry:', new Date(payload.exp * 1000).toLocaleString());
      console.log('   - Is expired:', payload.exp * 1000 < Date.now());
    } else {
      console.log('2. No token to decode');
    }
  } catch (error) {
    console.error('2. Error decoding token:', error);
  }
  
  // 3. Simulate admin check logic from AdminMenu component
  const isAdmin = (() => {
    try {
      if (!token) return false;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' && payload.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  })();
  
  console.log('3. Is Admin (based on component logic):', isAdmin);
  
  // 4. Instructions for testing
  console.log('\n=== Test Instructions ===');
  if (!token) {
    console.log('No token found. Please login with admin credentials:');
    console.log('1. Go to /login');
    console.log('2. Use credentials: admin@wingrox.ai / admin123');
  } else if (!isAdmin) {
    console.log('Token exists but not admin or expired. Please login with admin credentials:');
    console.log('1. Logout first');
    console.log('2. Go to /login');
    console.log('3. Use credentials: admin@wingrox.ai / admin123');
  } else {
    console.log('Admin token valid! You should see the Admin menu.');
    console.log('Please verify that:');
    console.log('1. The "Admin" menu appears in the navigation bar');
    console.log('2. Clicking it shows dropdown with admin options');
    console.log('3. You can access /admin, /admin/products, /admin/coaches, and /admin/users');
  }
};

// Run the test
checkAdminMenu();
