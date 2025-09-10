import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogleToken } = useAuth(); // You may need to implement this in AuthContext

  useEffect(() => {
    // Parse id_token from URL hash (for implicit flow)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const idToken = params.get('id_token');
    if (idToken) {
      // Send token to backend for verification and login
      loginWithGoogleToken(idToken)
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          alert('Google login failed.');
          navigate('/login');
        });
    } else {
      alert('No Google ID token found.');
      navigate('/login');
    }
  }, [navigate, loginWithGoogleToken]);

  return <div>Signing you in with Google...</div>;
};

export default GoogleCallback;
