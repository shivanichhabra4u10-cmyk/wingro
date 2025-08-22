
import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import CartButton from '../components/CartButton';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userApi.getProfile()
      .then(setUser)
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Not logged in.</div>;

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts[0][0].toUpperCase();
  };

  return (
  <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
        <span className="text-gray-500 text-sm">{user.email}</span>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 text-blue-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </span>
          <span className="font-semibold">Role:</span> <span className="ml-1 text-gray-700">{user.role || 'User'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 text-green-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </span>
          <span className="font-semibold">Email Verified:</span> <span className="ml-1 text-gray-700">{user.emailVerified ? 'Yes' : 'No'}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 text-purple-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l3.6 7.59-1.35 2.44A1 1 0 008 17h8a1 1 0 00.95-.68l3.58-8.59A1 1 0 0020 7H7.42" /></svg>
            </span>
            <span className="font-semibold">Phone:</span> <span className="ml-1 text-gray-700">{user.phone}</span>
          </div>
        )}
      </div>
  {/* Removed Edit Profile button */}
    </div>
  );
};

export default Profile;
