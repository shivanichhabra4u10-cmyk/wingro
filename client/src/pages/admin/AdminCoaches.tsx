import React, { useState, useEffect } from 'react';
import JoinAsCoach from '../JoinAsCoach';
// ...existing code...
import axios from 'axios';

interface Coach {
  _id: string;
  applicationId?: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  experience: number;
  specializations: string[];
  tags?: string[];
  imageUrl?: string;
  startingPrice: number;
  pricingModel: 'hourly' | 'monthly' | 'package';
  isActive?: boolean;
  linkedinUrl?: string;
  status?: string;
}

interface CoachApplication {
  _id?: string;
  name: string;
  email: string;
  specialization?: string;
  experience?: string;
  status?: string;
  appliedDate?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AdminCoaches: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Coach detail modal state
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showCoachDetail, setShowCoachDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  // Pagination state for coaches
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  // Status filter
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      setLoading(true);
  const coachesRes = await api.get(`/api/coaches?page=${page}&limit=${pageSize}`);
  setCoaches(coachesRes.data?.data || []);
  setTotal(coachesRes.data?.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Approve application
  const handleApprove = async (id: string) => {
    try {
      await api.post(`/api/applications/coach/${id}/approve`);
      fetchData();
    } catch (err) {
      setError('Failed to approve application.');
    }
  };

  // Delete coach
  const handleDeleteCoach = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        await api.delete(`/api/coaches/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete coach. Please try again.');
      }
    }
  };

  // Open coach detail modal (now opens JoinAsCoach in edit mode)
  const handleViewCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewOnly(true);
    setShowEditModal(true);
  };

  // Close coach detail modal
  const handleCloseCoachDetail = () => {
    setSelectedCoach(null);
    setShowCoachDetail(false);
  };

  // Open edit modal
  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewOnly(false);
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setSelectedCoach(null);
    setShowEditModal(false);
    setViewOnly(false);
    fetchData(); // Refresh list after edit
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Coach Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review, approve, and manage Growth Architect/Coach applications. Only approved coaches are visible in the marketplace.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading coaches...</span>
        </div>
      ) : (
        <>


          {/* Status Filter */}
          <div className="mb-6 flex items-center">
            <label htmlFor="statusFilter" className="mr-2 font-medium text-gray-700">Filter by Status:</label>
            <select
              id="statusFilter"
              className="border rounded px-2 py-1"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applications Table (filtered by status) */}
          <div className="bg-white shadow rounded-md mb-8">
            <h2 className="text-xl font-semibold px-6 py-4 border-b">Coach Applications</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coaches
                    .filter(coach => {
                      if (statusFilter === 'All') return true;
                      return coach.status === statusFilter;
                    })
                    .map(coach => (
                      <tr key={coach._id || coach.email} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{coach.applicationId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coach.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coach.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coach.specializations?.join(', ') || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coach.experience || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coach.status || 'Pending'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewCoach(coach)}
                            className="text-blue-600 hover:text-blue-900 font-semibold mr-2"
                          >
                            View
                          </button>
                          {coach.status === 'Pending' && (
                            <button
                              onClick={() => handleApprove(coach._id as string)}
                              className="text-green-600 hover:text-green-900 font-semibold mr-2"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>





          {/* Coach Detail Modal */}
          {showCoachDetail && selectedCoach && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCloseCoachDetail}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Coach Details</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {selectedCoach.imageUrl ? (
                      <img className="h-12 w-12 rounded-full object-cover mr-3" src={selectedCoach.imageUrl} alt={selectedCoach.name} />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        {selectedCoach.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-lg">{selectedCoach.name}</div>
                      <div className="text-gray-500 text-sm">{selectedCoach.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-1"><span className="font-medium">App ID:</span> {selectedCoach.applicationId || '-'}</div>
                  <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Title:</span> {selectedCoach.title || '-'}</div>
                  <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Specializations:</span> {selectedCoach.specializations?.join(', ') || '-'}</div>
                  <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Experience:</span> {selectedCoach.experience || '-'} yrs</div>
                  <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Status:</span> {selectedCoach.status || '-'}</div>
                  {selectedCoach.linkedinUrl && (
                    <div className="text-sm text-blue-700 mb-1"><a href={selectedCoach.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></div>
                  )}
                  {/* Add more fields as needed */}
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={handleCloseCoachDetail}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Coach Modal */}
          {showEditModal && selectedCoach && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative overflow-y-auto" style={{ maxHeight: '90vh' }}>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCloseEditModal}
                >
                  &times;
                </button>
                <JoinAsCoach
                  initialData={{
                    ...selectedCoach,
                  }}
                  applicationId={selectedCoach.applicationId}
                  editMode={!viewOnly}
                  viewOnly={viewOnly}
                  onSubmitSuccess={handleCloseEditModal}
                />
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AdminCoaches;