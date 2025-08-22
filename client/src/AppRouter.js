import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CareerAssessment910Page from './pages/CareerAssessment910Page';
// Import other pages as needed

/**
 * Main application router component
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Add the route for the 9-10 assessment */}
      <Route path="/assessment/9-10" element={<CareerAssessment910Page />} />
      
      {/* Add other routes as needed */}
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/profile" element={<ProfilePage />} /> */}
      
      {/* Add a catch-all route for 404 */}
      <Route path="*" element={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRouter;
