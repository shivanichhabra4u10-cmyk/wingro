import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add auth token to requests
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


const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=${limit}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleUpdating(userId);
    setSuccessMsg(null);
    try {
      await api.put(`/users/role`, { userId, role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMsg('Role updated successfully.');
    } catch (err) {
      setError('Failed to update role.');
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      await api.put(`users/${editUser._id}`, editUser);
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? editUser : u)));
      setSuccessMsg('User updated successfully.');
      setShowEdit(false);
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleting(true);
    try {
      await api.delete(`users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setSuccessMsg('User deleted successfully.');
      setDeleteUserId(null);
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage users registered on the WinGroX AI platform.
          </p>
        </div>
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
      {/* Success message */}
      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.293 9.293a1 1 0 011.414 0L10 9.586l.293-.293a1 1 0 111.414 1.414L10 12.414l-1.707-1.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading users...</span>
        </div>
      ) : (
        <>
          {/* Users table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">There are no users registered in the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-medium">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className={`px-2 py-1 text-xs rounded-full border focus:outline-none ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}
                            value={user.role}
                            disabled={roleUpdating === user._id}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="coach">Coach</option>
                          </select>
                          {roleUpdating === user._id && (
                            <span className="ml-2 text-xs text-gray-500">Updating...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.lastLogin 
                              ? new Date(user.lastLogin).toLocaleDateString() 
                              : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleViewDetails(user)}
                          >
                            View Details
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => setDeleteUserId(user._id)}
                            disabled={deleting && deleteUserId === user._id}
                          >
                            {deleting && deleteUserId === user._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {users.length ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, totalCount)} of {totalCount} users
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-2 py-1">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
          <select
            className="ml-2 px-2 py-1 border rounded"
            value={limit}
            onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
          >
            {[10, 20, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt} / page</option>
            ))}
          </select>
        </div>
      </div>
        </>
      )}

      {/* Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowDetails(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {selectedUser.name}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {selectedUser.email}</div>
            <div className="mb-2"><span className="font-semibold">Role:</span> {selectedUser.role}</div>
            <div className="mb-2"><span className="font-semibold">Joined:</span> {new Date(selectedUser.createdAt).toLocaleString()}</div>
            <div className="mb-2"><span className="font-semibold">Last Login:</span> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowEdit(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={editUser.name}
                onChange={e => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={editUser.role}
                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="coach">Coach</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEdit(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4">Delete User</h2>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => handleDelete(deleteUserId)} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
