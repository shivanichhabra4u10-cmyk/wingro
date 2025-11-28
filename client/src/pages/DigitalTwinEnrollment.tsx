import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  selectedPlan: string;
  message: string;
}

const DigitalTwinEnrollment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get plan from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const planFromUrl = searchParams.get('plan') || '';

  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    linkedInUrl: '',
    selectedPlan: planFromUrl,
    message: ''
  });

  // Plan details mapping
  const planDetails: { [key: string]: { name: string; price: string; color: string } } = {
    'silver-identity': { 
      name: 'Silver — Identity Alignment Breakthrough', 
      price: '₹4,999',
      color: 'from-gray-400 to-gray-600'
    },
    'gold-reinvention': { 
      name: 'Gold — Career Reinvention Accelerator™', 
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

      // Submit to contact API (reusing existing contact endpoint)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contact`,
        enrollmentData
      );

      if (response.data.success) {
        toast.success('🎉 Enrollment request submitted successfully! We will contact you soon.');
        
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

        // Redirect to thank you or home after 2 seconds
        setTimeout(() => {
          navigate('/');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 shadow-2xl">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-4">
            Begin Your Transformation Journey
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            Complete your enrollment to unlock your personalized Digital Twin experience
          </p>
        </div>

        {/* Selected Plan Display */}
        {formData.selectedPlan && planDetails[formData.selectedPlan] && (
          <div className={`bg-gradient-to-r ${planDetails[formData.selectedPlan].color} rounded-2xl p-6 mb-8 text-white shadow-2xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90 mb-1">Selected Plan</p>
                <h3 className="text-2xl font-black">{planDetails[formData.selectedPlan].name}</h3>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black">{planDetails[formData.selectedPlan].price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedInUrl" className="block text-sm font-bold text-gray-900 mb-2">
                LinkedIn Profile URL <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                id="linkedInUrl"
                name="linkedInUrl"
                value={formData.linkedInUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Plan Selection */}
            <div>
              <label htmlFor="selectedPlan" className="block text-sm font-bold text-gray-900 mb-2">
                Select Your Plan *
              </label>
              <select
                id="selectedPlan"
                name="selectedPlan"
                value={formData.selectedPlan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
              >
                <option value="">Choose a plan...</option>
                <option value="silver-identity">Silver — Identity Alignment Breakthrough (₹4,999)</option>
                <option value="gold-reinvention">Gold — Career Reinvention Accelerator™ (₹24,999)</option>
                <option value="platinum-mastery">Platinum — Elite Transformation & Leadership Mastery (₹75,000)</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                Additional Message <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none"
                placeholder="Tell us about your goals and what you hope to achieve..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Our team will review your enrollment request within 24 hours</li>
                    <li>✓ We'll send you payment details and onboarding instructions</li>
                    <li>✓ Your personalized Digital Twin journey begins!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Go Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Submitting...' : '🚀 Submit Enrollment'}
              </button>
            </div>
          </form>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">🔒</span>
              Secure & Confidential
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 mr-2">⚡</span>
              Quick Response
            </div>
            <div className="flex items-center">
              <span className="text-purple-600 mr-2">💎</span>
              Premium Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinEnrollment;
