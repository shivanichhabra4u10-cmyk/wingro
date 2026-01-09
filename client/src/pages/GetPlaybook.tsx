import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const GetPlaybook: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    contactNo: '',
    painAreas: '',
    interestedInDigitalTwin: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.companyName || !formData.email || !formData.contactNo || !formData.painAreas) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit lead data
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_BASE_URL}/api/leads/submit`, formData);

      if (response.data.success) {
        toast.success('Thank you! Our team will get back to you soon.');
        setIsSubmitted(true);

        // Reset form
        setFormData({
          name: '',
          companyName: '',
          email: '',
          contactNo: '',
          painAreas: '',
          interestedInDigitalTwin: false,
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            � Request a Consultation
          </h1>
          <p className="text-lg text-gray-600">
            Share your details and challenges with us. Our team will review your needs and schedule a personalized consultation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your company name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contactNo"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Top 5 Pain Areas/Challenges */}
            <div>
              <label htmlFor="painAreas" className="block text-sm font-medium text-gray-700 mb-2">
                Top 5 Pain Areas/Challenges <span className="text-red-500">*</span>
              </label>
              <textarea
                id="painAreas"
                name="painAreas"
                value={formData.painAreas}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                placeholder="Please list your top 5 pain areas or challenges (e.g., low employee retention, lack of career development programs, unclear growth paths, etc.)"
              />
            </div>

            {/* Digital Twin Interest Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  id="interestedInDigitalTwin"
                  name="interestedInDigitalTwin"
                  checked={formData.interestedInDigitalTwin}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="interestedInDigitalTwin" className="text-sm font-medium text-gray-700 cursor-pointer">
                  I'm interested in Digital Twin
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Get updates and early access to our Digital Twin technology
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>�</span>
                  <span>Submit Details</span>
                </>
              )}
            </button>

            {/* Success Message */}
            {isSubmitted && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-green-800 font-semibold">Thank you for your submission!</h4>
                    <p className="text-green-700 text-sm mt-1">Our team will review your details and get back to you shortly.</p>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By submitting, you agree to receive occasional updates from WinGroX AI. 
              We respect your privacy and you can unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Strategic Insights</h3>
            <p className="text-sm text-gray-600">Data-driven strategies for growth</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Actionable Steps</h3>
            <p className="text-sm text-gray-600">Ready-to-implement frameworks</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
            <p className="text-sm text-gray-600">Industry best practices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPlaybook;
