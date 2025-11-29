import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  selectedPlan: string;
  message: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose, selectedPlan = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    linkedInUrl: '',
    selectedPlan: selectedPlan,
    message: ''
  });

  // Update selected plan when prop changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, selectedPlan }));
  }, [selectedPlan]);

  // Plan details mapping
  const planDetails: { [key: string]: { name: string; price: string; color: string } } = {
    'silver-identity': { 
      name: 'Silver — Identity Alignment Breakthrough', 
      price: '₹4,999',
      color: 'from-gray-400 to-gray-600'
    },
    'gold-reinvention': { 
      name: 'Gold — Career Reinvention Accelerator', 
      price: '₹24,999',
      color: 'from-yellow-500 to-orange-600'
    },
    'platinum-mastery': { 
      name: 'Platinum — Elite Transformation & Leadership Mastery', 
      price: '₹75,000',
      color: 'from-purple-500 to-pink-600'
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.selectedPlan) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare enrollment data
      const enrollmentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        linkedInUrl: formData.linkedInUrl,
        subject: 'Digital Twin Enrollment',
        interestedIn: planDetails[formData.selectedPlan]?.name || formData.selectedPlan,
        message: formData.message || `I would like to enroll in the ${planDetails[formData.selectedPlan]?.name || formData.selectedPlan} plan.`
      };

      // Submit to contact API
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contact`,
        enrollmentData
      );

      if (response.data.success) {
        toast.success('🎉 Enrollment request submitted successfully! Our team will contact you.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          linkedInUrl: '',
          selectedPlan: '',
          message: ''
        });

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error('Failed to submit enrollment. Please try again.');
      }
    } catch (error: any) {
      console.error('Enrollment submission error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-xl">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-2">
                Begin Your Transformation
              </h2>
              <p className="text-lg text-gray-700 font-semibold">
                Complete your enrollment to unlock your personalized journey
              </p>
            </div>

            {/* Selected Plan Display */}
            {formData.selectedPlan && planDetails[formData.selectedPlan] && (
              <div className={`bg-gradient-to-r ${planDetails[formData.selectedPlan].color} rounded-2xl p-5 mb-6 text-white shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-90 mb-1">Selected Plan</p>
                    <h3 className="text-xl font-black">{planDetails[formData.selectedPlan].name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black">{planDetails[formData.selectedPlan].price}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-900 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label htmlFor="linkedInUrl" className="block text-sm font-bold text-gray-900 mb-1">
                  LinkedIn Profile <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="linkedInUrl"
                  name="linkedInUrl"
                  value={formData.linkedInUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label htmlFor="selectedPlan" className="block text-sm font-bold text-gray-900 mb-1">
                  Select Your Plan *
                </label>
                <select
                  id="selectedPlan"
                  name="selectedPlan"
                  value={formData.selectedPlan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                >
                  <option value="">Choose a plan...</option>
                  <option value="silver-identity">Silver — Identity Alignment Breakthrough (₹4,999)</option>
                  <option value="gold-reinvention">Gold — Career Reinvention Accelerator (₹24,999)</option>
                  <option value="platinum-mastery">Platinum — Elite Transformation & Leadership Mastery (₹75,000)</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-1">
                  Additional Message <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none"
                  placeholder="Tell us about your goals and what you hope to achieve..."
                />
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1 text-sm">What happens next?</h4>
                    <ul className="text-xs text-blue-800 space-y-0.5">
                      <li>✓ Our team will review your enrollment within 24 hours</li>
                      <li>✓ We'll send payment details and onboarding instructions</li>
                      <li>✓ Your personalized Digital Twin journey begins!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold text-base rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold text-base rounded-xl hover:shadow-xl transition-all ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : '🚀 Submit Enrollment'}
                </button>
              </div>
            </form>

            {/* Trust Signals */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-600 mr-1">🔒</span>
                  Secure
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-1">⚡</span>
                  Quick Response
                </div>
                <div className="flex items-center">
                  <span className="text-purple-600 mr-1">💎</span>
                  Premium Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
