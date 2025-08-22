import React from 'react';

export default function Register() {
    const [form, setForm] = React.useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const navigate = window.location ? (path: string) => window.location.assign(path) : () => {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      // Basic validation
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(form.email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(form.phone)) {
        setError('Please enter a valid phone number');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess('Registration successful! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          setError(data.error || 'Registration failed');
        }
      } catch (err) {
        setError('Server error');
      }
      setLoading(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Create your account</h2>
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1234567890" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </form>
        </div>
      </div>
    );
}
