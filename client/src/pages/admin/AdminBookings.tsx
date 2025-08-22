import React, { useEffect, useState } from 'react';

interface Booking {
  _id: string;
  coachId: string;
  coachName: string;
  userName: string;
  userEmail: string;
  phoneNumber?: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  notes: string;
  sessionType: string;
  createdAt: string;
  status: string;
  meetingLink?: string;
  adminComments?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancel', label: 'Cancelled' },
];

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCoach, setFilterCoach] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        let url = `${API_BASE_URL}/api/bookings`;
        const params = [];
        if (filterCoach) params.push(`coachId=${filterCoach}`);
        // Fetch all, filter client-side for status/date
        if (params.length) url += `?${params.join('&')}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        let data = (await res.json()).data;
        // Filter by status
        if (filterStatus) data = data.filter((b: any) => b.status === filterStatus);
        // Filter by date
        if (filterDate) data = data.filter((b: any) => b.date && b.date.startsWith(filterDate));
        // Sort descending by creation date/time
        data.sort((a: any, b: any) => {
          const createdA = new Date(a.createdAt);
          const createdB = new Date(b.createdAt);
          return createdB.getTime() - createdA.getTime();
        });
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [filterCoach, filterStatus, filterDate]);

  // Get unique coaches for filter dropdown
  const coachOptions = Array.from(new Set(bookings.map(b => `${b.coachId}|${b.coachName}`)))
    .map(str => {
      const [id, name] = str.split('|');
      return { id, name };
    });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Bookings Management</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-semibold text-gray-700">Filter by Coach:</label>
          <select
            value={filterCoach}
            onChange={e => setFilterCoach(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Coaches</option>
            {coachOptions.map(coach => (
              <option key={coach.id} value={coach.id}>{coach.name}</option>
            ))}
          </select>
          <label className="font-semibold text-gray-700 ml-4">Status:</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="font-semibold text-gray-700 ml-4">Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            style={{ minWidth: 140 }}
          />
        </div>
        <div className="text-sm text-gray-500 mt-2 md:mt-0">Total Bookings: <span className="font-bold text-indigo-600">{bookings.length}</span></div>
      </div>
      <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white max-w-full">
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="p-8 text-center text-lg text-gray-500">Loading bookings...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No bookings found.</div>
          ) : (
            <div className="w-full min-w-[900px]">
              <table className="w-full text-sm md:text-base table-fixed">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[110px]">Coach</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[110px]">User Name</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[220px]">User Email</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[100px]">Date</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[60px]">Time</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[70px]">Duration</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[70px]">Mode</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[80px]">Status</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[90px]">Created</th>
                  <th className="p-3 font-semibold text-left text-gray-700 whitespace-nowrap min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-indigo-50 transition-colors">
                    <td className="p-3 font-medium text-gray-900 whitespace-nowrap min-w-[110px]">{b.coachName}</td>
                    <td className="p-3 text-gray-800 whitespace-nowrap min-w-[110px]">{b.userName}</td>
                    <td className="p-3 text-indigo-700 whitespace-nowrap min-w-[220px] max-w-[240px] overflow-hidden text-ellipsis" title={b.userEmail}>{b.userEmail}</td>
                    <td className="p-3 whitespace-nowrap text-indigo-600 font-semibold min-w-[100px]">{b.date ? new Date(b.date).toLocaleDateString() : ''}</td>
                    <td className="p-3 whitespace-nowrap min-w-[60px]">{b.time}</td>
                    <td className="p-3 whitespace-nowrap min-w-[70px]">{b.duration} min</td>
                    <td className="p-3 whitespace-nowrap capitalize min-w-[70px]">{b.sessionType}</td>
                    <td className="p-3 whitespace-nowrap min-w-[80px]">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold align-middle ${b.status === 'pending' || !b.status ? 'bg-yellow-100 text-yellow-800' : b.status === 'completed' ? 'bg-green-100 text-green-700' : b.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{(b.status ? (b.status.charAt(0).toUpperCase() + b.status.slice(1)) : 'Pending')}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-xs text-gray-500 min-w-[90px]">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}</td>
                    <td className="p-3 whitespace-nowrap min-w-[80px] text-center">
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs font-semibold shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onClick={() => setSelectedBooking(b)}
                        tabIndex={0}
                        aria-label={`View booking for ${b.userName}`}
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedBooking(null)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Booking Details</h2>
            <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Coach:</span> {selectedBooking.coachName}</div>
                <div><span className="font-semibold">User:</span> {selectedBooking.userName} ({selectedBooking.userEmail})</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Phone:</span> {selectedBooking.phoneNumber || '-'}</div>
                <div><span className="font-semibold">Topic:</span> {selectedBooking.topic}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Date/Time:</span> {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : ''} {selectedBooking.time}</div>
                <div><span className="font-semibold">Duration/Type:</span> {selectedBooking.duration} min, {selectedBooking.sessionType}</div>
              </div>
              <div>
                <span className="font-semibold">User Notes:</span> <span className="whitespace-pre-line text-gray-700">{selectedBooking.notes || <span className="italic text-gray-400">(none)</span>}</span>
              </div>
              {/* Removed Admin Notes from static details section as requested */}
              <div><span className="font-semibold">Created:</span> {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : ''}</div>
              {/* Removed static Admin Comments display above the textarea */}
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setStatusUpdating(true);
                setStatusError(null);
                const form = e.target as typeof e.target & {
                  status: { value: string };
                  meetingLink?: { value: string };
                  date: { value: string };
                  time: { value: string };
                  adminComments?: { value: string };
                };
                const newStatus = form.status.value;
                const newMeetingLink = form.meetingLink ? form.meetingLink.value : selectedBooking.meetingLink;
                const newDate = form.date.value;
                const newTime = form.time.value;
                const newAdminComments = form.adminComments ? form.adminComments.value : selectedBooking.adminComments;
                if (newStatus === 'scheduled' && (!newMeetingLink || newMeetingLink.trim() === '')) {
                  setStatusError('Meeting link is required when status is Scheduled.');
                  setStatusUpdating(false);
                  return;
                }
                try {
                  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                  const res = await fetch(`${API_BASE_URL}/api/bookings/${selectedBooking._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      status: newStatus,
                      meetingLink: newMeetingLink,
                      date: newDate,
                      time: newTime,
                      adminComments: newAdminComments
                    })
                  });
                  if (!res.ok) throw new Error('Failed to update booking');
                  // Update local state
                  setBookings(prev =>
                    prev.map(b =>
                      b._id === selectedBooking._id
                        ? { ...b, status: newStatus, meetingLink: newMeetingLink, date: newDate, time: newTime, adminComments: newAdminComments }
                        : b
                    )
                  );
                  setSelectedBooking(sb =>
                    sb ? { ...sb, status: newStatus, meetingLink: newMeetingLink, date: newDate, time: newTime, adminComments: newAdminComments } : sb
                  );
                } catch (err: any) {
                  setStatusError(err.message || 'Error updating booking');
                } finally {
                  setStatusUpdating(false);
                }
              }}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block font-semibold mb-1">Status:</label>
                  <select
                    name="status"
                    defaultValue={selectedBooking.status}
                    className="border rounded px-3 py-2 w-full max-w-[140px]"
                    disabled={statusUpdating}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Date:</label>
                  <input
                      type="date"
                      name="date"
                      defaultValue={selectedBooking.date ? selectedBooking.date.split('T')[0] : ''}
                      className="border rounded px-3 py-2 w-full min-w-[180px] max-w-full"
                      disabled={statusUpdating}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Time:</label>
                    <input
                      type="time"
                      name="time"
                      defaultValue={selectedBooking.time}
                      className="border rounded px-3 py-2 w-full"
                      disabled={statusUpdating}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Meeting Link:</label>
                <input
                  type="url"
                  name="meetingLink"
                  defaultValue={selectedBooking.meetingLink || ''}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://..."
                  disabled={statusUpdating}
                  required={selectedBooking.status === 'scheduled'}
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Admin Comments:</label>
                <textarea
                  name="adminComments"
                  defaultValue={selectedBooking.adminComments || ''}
                  className="border rounded px-3 py-2 w-full min-h-[60px]"
                  placeholder="Add internal admin comments..."
                  disabled={statusUpdating}
                />
              </div>
              {statusError && <div className="text-red-600 mb-2">{statusError}</div>}
            </form>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold shadow"
                type="button"
                disabled={statusUpdating}
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
              >
                {statusUpdating ? 'Updating...' : 'Update'}
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold shadow"
                onClick={async () => {
                  if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
                  setStatusUpdating(true);
                  setStatusError(null);
                  try {
                    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                    const res = await fetch(`${API_BASE_URL}/api/bookings/${selectedBooking._id}`, {
                      method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('Failed to delete booking');
                    setBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
                    setSelectedBooking(null);
                  } catch (err: any) {
                    setStatusError(err.message || 'Error deleting booking');
                  } finally {
                    setStatusUpdating(false);
                  }
                }}
                disabled={statusUpdating}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
