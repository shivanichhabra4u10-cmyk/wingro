import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      // You can add password logic or OTP verification as needed
      await axios.post('http://localhost:5000/api/auth/register', { name, email, phone, password });
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage('Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Sign Up</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ width: '100%', marginBottom: 8 }} />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', marginBottom: 8 }} />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" style={{ width: '100%', marginBottom: 8 }} />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={handleRegister} style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: '#38bdf8', color: '#fff', fontWeight: 600, border: 'none' }}>Register</button>
      <div style={{ marginTop: 12 }}>{message}</div>
    </div>
  );
}
