import React from 'react';

export default function CartPage() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #e0e7ff' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Your Cart</h2>
      <p style={{ fontSize: '1.1rem', color: '#374151' }}>This is a protected cart page. Only logged-in users can view this.</p>
    </div>
  );
}
