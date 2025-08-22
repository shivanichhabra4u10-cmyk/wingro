import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { coaches } from '../services/api';
import { Coach as CoachType } from '../types/coach';
import BookConsultation, { BookingDetails } from '../components/BookConsultation';

// Helper component for star rating display
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
};

const CoachProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coach, setCoach] = useState<CoachType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError("Coach ID is missing");
          setLoading(false);
          return;
        }
        const response = await coaches.getById(id);
        if (response && response.success) {
          setCoach(response.data as CoachType);
        } else {
          setError('Failed to fetch coach profile');
        }
      } catch (error) {
        console.error('Error fetching coach profile:', error);
        setError('An error occurred while fetching the coach profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCoachProfile();
  }, [id]);
  
  // Placeholder for avatar if no image URL
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image Placeholder */}
            <div className="w-40 h-40 rounded-full bg-gray-200"></div>
            
            {/* Coach Info Placeholder */}
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !coach) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Coach Profile</h2>
          <p className="text-red-600 mb-6">{error || "Coach profile not found"}</p>
          <Link to="/marketplace" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back to marketplace link */}
      <Link to="/marketplace" className="flex items-center text-blue-600 mb-6 font-medium hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
          <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
        </svg>
        Back to Marketplace
      </Link>
      
      {/* Main profile section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-40"></div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Coach avatar */}
            <div className="md:-mt-24">
              {coach.imageUrl ? (
                <img 
                  src={coach.imageUrl} 
                  alt={coach.name} 
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                />
              ) : (
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold">
                  {getInitials(coach.name)}
                </div>
              )}
            </div>
            
            {/* Coach info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{coach.name}</h1>
                  <p className="text-lg text-gray-600">{coach.title}</p>
                </div>
                
                {coach.matchPercentage && (
                  <div className="mt-2 md:mt-0 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                    {coach.matchPercentage}% Match
                  </div>
                )}
              </div>
              
      {/* Success Message handled inside BookConsultation modal now */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600 whitespace-pre-line">{coach.bio}</p>
              </div>
              
              {/* Specializations */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.specializations.map((spec, index) => (
                    <span 
                      key={`spec-${index}`}
                      className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              {coach.tags && coach.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.tags.map((tag, index) => (
                      <span 
                        key={`tag-${index}`}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
                {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                {coach.linkedinUrl && (
                  <button
                    className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center"
                    onClick={() => window.open(coach.linkedinUrl, '_blank')}
                  >
                    View LinkedIn Profile
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                    </svg>
                  </button>
                )}

                <button 
                  className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
                  onClick={() => window.open(`mailto:contact@wingrox.ai?subject=Coaching Request: ${coach.name}`)}
                >
                  Contact Coach
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </button>

                <button 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Consultation
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Clients Section (with placeholder) */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Clients</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-gray-400 text-sm">Client {i}</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">Success Story {i}</p>
                <p className="text-sm text-gray-500">Achieved key goals</p>
              </div>
            </div>
          ))}
        </div>
      </div>
        {/* Book a Session Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Growth Journey?</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Book a session with {coach.name} today and take your first step toward breakthrough results.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300"
          >
            Book Consultation
          </button>
          <Link to="/career-assessment" className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Take the Assessment
          </Link>
          <button 
            onClick={() => window.location.href = `/contact?coach=${encodeURIComponent(coach.name)}`}
            className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300"
          >
            Contact Coach
          </button>
        </div>
      </div>
      
      {/* Book Consultation Section - New Addition */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Consultation</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coach info for booking */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{coach.name}</h3>
            <p className="text-gray-600 mb-4">{coach.title}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500 mr-2">
                  <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {coach.experience} Years Experience
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500 mr-2">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
                {coach.clientCount} Clients
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mr-2">
                  <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                  <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                </svg>
                ${coach.startingPrice}/{coach.pricingModel}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
              <p className="text-gray-600 whitespace-pre-line">{coach.bio}</p>
            </div>
          </div>
          </div>
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && coach && (
        <BookConsultation 
          coach={coach} 
          onClose={() => setShowBookingModal(false)}
          onSuccess={(details) => {
            setBookingDetails(details);
            setBookingSuccess(true);
            // Do NOT close the modal here; let BookConsultation handle success UI
          }}
        />
      )}
      {/* Success Message handled inside BookConsultation modal now */}
    </div>
  );
};

export default CoachProfile;
