import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coach } from '../types/coach';
import { coaches } from '../services/api';

const Marketplace: React.FC = () => {
  const [coachList, setCoachList] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  });
  const [specialization, setSpecialization] = useState<string | null>(null);
  const commonSpecializations = [
    'Executive Leadership',
    'Career Transitions',
    'Business Strategy',
    'Product Development',
    'Personal Branding',
    'Startup Growth'
  ];

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await coaches.getAll({
          page: pagination.page,
          limit: pagination.limit,
          specialty: specialization || undefined
        });
        if (response && response.success) {
          setCoachList(response.data as Coach[]);
          setPagination(prev => ({ ...prev, totalCount: response.totalCount, totalPages: response.totalPages, hasMore: response.hasMore }));
        }
      } catch (err) {
        setError('Failed to fetch coaches');
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, [pagination.page, pagination.limit, specialization]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Meet Growth Architects
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Discover and connect with world-class coaches, consultants, and experts to accelerate your personal and business growth.
            </p>
            <Link to="/join-as-architect" className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-105 transition-transform">
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Join as Architect
            </Link>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        </div>
      </section>
      <div className="container mx-auto px-4 pb-16">
        {/* Specialization Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {commonSpecializations.map(spec => (
            <button
              key={spec}
              onClick={() => setSpecialization(spec)}
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all ${specialization === spec ? 'bg-cyan-500 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}
            >
              {spec}
            </button>
          ))}
          {specialization && (
            <button onClick={() => setSpecialization(null)} className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 ml-2">Clear</button>
          )}
        </div>
        {/* Coach List */}
        {loading ? (
          <div className="text-center py-12 text-xl text-blue-700">Loading coaches...</div>
        ) : error ? (
          <div className="text-center py-12 text-xl text-red-600">{error}</div>
        ) : coachList.length === 0 ? (
          <div className="text-center py-12 text-xl text-gray-500">No coaches found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coachList.map(coach => (
                <div key={coach._id || coach.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
                  <img src={coach.avatar || '/default-avatar.png'} alt={coach.name} className="h-24 w-24 object-cover rounded-full mb-4 shadow-lg" />
                  <h2 className="text-xl font-bold mb-2 text-gray-900 text-center">{coach.name}</h2>
                  <p className="text-gray-600 text-center mb-2">{coach.specialty}</p>
                  <div className="mb-2 text-sm text-gray-500">{coach.bio?.slice(0, 80) || 'No bio available.'}</div>
                  <div className="flex gap-2 mt-auto">
                    <Link to={`/coach/${coach._id || coach.id}`} className="px-4 py-2 rounded-full bg-cyan-500 text-white font-semibold shadow hover:bg-cyan-600 transition">View Profile</Link>
                  </div>
                </div>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 gap-4">
          <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50">Previous</button>
          <span className="px-4 py-2 text-gray-700">Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={!pagination.hasMore} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
