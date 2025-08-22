import React, { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { Coach as CoachType } from '../types/coach';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface BookConsultationProps {
  coach: CoachType;
  onClose: () => void;
  onSuccess: (bookingDetails: BookingDetails) => void;
}

export interface BookingDetails {
  coachId: string;
  coachName: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  notes: string;
  sessionType: 'video' | 'phone' | 'in-person';
  phoneNumber?: string;
}

const BookConsultation: React.FC<BookConsultationProps> = ({ coach, onClose, onSuccess }) => {
  // const navigate = useNavigate();
  
  // Get today's date in YYYY-MM-DD format for min date in date picker
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 3 months from now for max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  const { user } = useAuth();
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState<BookingDetails & { userName?: string; userEmail?: string }>({
    coachId: coach._id || '',
    coachName: coach.name,
    date: '',
    time: '',
    duration: 60, // Default 60 minutes
    topic: '',
    notes: '',
    sessionType: 'video',
    phoneNumber: '',
    userName: user && user.name ? user.name : '',
    userEmail: user && user.email ? user.email : ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  // Available durations in minutes
  const durations = [30, 60, 90, 120];
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.date || !formData.time || !formData.topic) {
      setError('Please fill in all required fields');
      return;
    }
    // If user context is missing, allow manual entry
    let bookingUser: { name: string; email: string; id?: string };
    if (user && user.name && user.email) {
      bookingUser = user;
    } else {
      if (!formData.userName || !formData.userEmail) {
        setError('Please enter your name and email.');
        return;
      }
      bookingUser = {
        name: formData.userName,
        email: formData.userEmail
      };
    }
    setLoading(true);
    setError(null);
    const bookingData = {
      ...formData,
      userName: bookingUser.name,
      userEmail: bookingUser.email
    };
    try {
      // Try to POST to backend API
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      onSuccess(json.data);
      setSuccess(true);
    } catch (err) {
      // Fallback: store booking in localStorage
      console.error('Error booking consultation, falling back to localStorage:', err);
      setError('Failed to book consultation with server. Saved locally.');
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingId = `booking_${Date.now()}`;
      const newBooking = {
        ...bookingData,
        id: bookingId,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      onSuccess(bookingData);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Book a Consultation with {coach.name}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-green-600 text-2xl font-bold mb-4">Booking Created Successfully!</div>
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                onClick={() => navigate('/marketplace')}
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Coach info summary */}
                <div className="mb-6 bg-blue-50 p-4 rounded-lg flex items-center">
                  {coach.imageUrl ? (
                    <img 
                      src={coach.imageUrl} 
                      alt={coach.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-4 font-bold">
                      {coach.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{coach.name}</h3>
                    <p className="text-sm text-gray-600">{coach.title}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="font-bold">${coach.startingPrice}</span>
                    <span className="text-sm text-gray-600">/{coach.pricingModel}</span>
                  </div>
                </div>
                {/* User details (if not logged in, allow input) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                      disabled={!!(user && user.name)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                      disabled={!!(user && user.email)}
                    />
                  </div>
                </div>
                {/* Session details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      max={maxDateString}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-600">*</span>
                    </label>
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <select 
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    >
                      {durations.map(duration => (
                        <option key={duration} value={duration}>{duration} minutes</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <select 
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="e.g. +1 555 123 4567"
                    required
                    pattern="[+0-9 ()-]{7,}"
                    // Always allow editing phone number
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="E.g., Career Transition Strategy"
                    required
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Any additional information you'd like the coach to know"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </span>
                    ) : (
                      'Book Consultation'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
