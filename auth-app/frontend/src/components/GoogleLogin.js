import React from 'react';
import axios from 'axios';

export default function GoogleLogin() {
  // You would use a real Google Sign-In button here
  const handleGoogle = async () => {
    const googleToken = window.prompt('Paste Google ID token here (simulate)');
    const phone = window.prompt('Enter phone (optional, for first time)');
    const res = await axios.post('http://localhost:5000/api/auth/login/google', { token: googleToken, phone }, { withCredentials: true });
    // handle login success (e.g., redirect)
    alert('Login successful!');
  };
  return <button onClick={handleGoogle}>Sign in with Google</button>;
}
