import React, { useEffect, useState } from 'react';
import { getAdminContent, refreshToken } from '../utils/auth';

export default function AdminPage() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminContent().then(data => {
      if (data) setContent(data);
      else setError('Access denied or not admin');
    });
  }, []);

  const handleRefresh = async () => {
    await refreshToken();
    getAdminContent().then(data => {
      if (data) {
        setContent(data);
        setError('');
      } else {
        setError('Access denied or not admin');
      }
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Admin Page</h2>
      {content ? <div>{content}</div> : <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleRefresh} style={{ marginTop: 20 }}>Refresh Token</button>
    </div>
  );
}
