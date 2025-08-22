import React, { useState } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('Invalid or missing token');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password reset successful! You can now log in.');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Reset your password</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New password" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}
