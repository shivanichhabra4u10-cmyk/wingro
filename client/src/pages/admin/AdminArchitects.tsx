import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ArchitectApplication {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  specialization?: string;
  experience?: string;
  currentTitle?: string;
  industry?: string;
  growthPhilosophy?: string;
  successStory?: string;
  coachingStyle?: string;
  targetClients?: string;
  hourlyRate?: string;
  availableHours?: string;
  offerPackages?: boolean;
  remoteOnly?: boolean;
  status?: string;
  createdAt?: string;
}

const AdminArchitects: React.FC = () => {
  const [applications, setApplications] = useState<ArchitectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${API_BASE_URL}/api/applications/coach`);
        setApplications(res.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching architect applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Architect Applications</h1>
      {loading ? (
        <div className="text-blue-700 py-8 text-xl">Loading applications...</div>
      ) : error ? (
        <div className="text-red-600 py-8 text-xl">{error}</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500 py-8 text-xl">No architect applications found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">Name</th>
                <th className="p-3 text-left font-semibold text-gray-700">Email</th>
                <th className="p-3 text-left font-semibold text-gray-700">Specialization</th>
                <th className="p-3 text-left font-semibold text-gray-700">Experience</th>
                <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left font-semibold text-gray-700">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id || app.email} className="border-b">
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.email}</td>
                  <td className="p-3">{app.specialization || '-'}</td>
                  <td className="p-3">{app.experience || '-'}</td>
                  <td className="p-3">{app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}</td>
                  <td className="p-3">{app.createdAt ? new Date(app.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminArchitects;
