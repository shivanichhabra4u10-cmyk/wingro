import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { coaches } from '../services/api';
import { uploadFile, getPublicUrl } from '../services/supabaseStorage';

interface JoinAsCoachProps {
  initialData?: Partial<CoachFormData>;
  editMode?: boolean;
  coachId?: string;
  onSubmitSuccess?: () => void;
  viewOnly?: boolean;
  applicationId?: string;
}

interface CoachFormData {
  name: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  specialization: string;
  industry: string;
  title: string;
  growthPhilosophy: string;
  successStory: string;
  coachingStyle: string;
  targetClients: string;
  availableHours: string;
  offerPackages: boolean;
  remoteOnly: boolean;
  certifications: string;
  yearsCoaching: string;
  preferredIndustries: string;
  languages: string;
  groupCoaching: boolean;
  aiToolsExperience: string;
  referralSource: string;
  status: string;
  desiredHourlyRate: string;
}

const defaultFormData: CoachFormData = {
  name: '',
  email: '',
  phone: '',
  linkedInUrl: '',
  specialization: '',
  industry: '',
  title: '',
  growthPhilosophy: '',
  successStory: '',
  coachingStyle: '',
  targetClients: '',
  availableHours: '',
  offerPackages: false,
  remoteOnly: true,
  certifications: '',
  yearsCoaching: '',
  preferredIndustries: '',
  languages: '',
  groupCoaching: false,
  aiToolsExperience: '',
  referralSource: '',
  status: 'Pending',
  desiredHourlyRate: '',
};

const JoinAsCoach: React.FC<JoinAsCoachProps> = ({
  initialData,
  editMode,
  coachId,
  onSubmitSuccess,
  viewOnly,
  applicationId: propApplicationId,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState<CoachFormData>({
    ...defaultFormData,
    ...initialData,
    desiredHourlyRate: initialData?.desiredHourlyRate || '',
    linkedInUrl: initialData?.linkedInUrl || '',
  });
  const [files, setFiles] = useState<{ resume: File | null; profilePhoto: File | null }>({ resume: null, profilePhoto: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(propApplicationId || null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (viewOnly) return;
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (viewOnly) return;
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFiles(prev => ({ ...prev, [name]: file }));
      if (name === 'profilePhoto') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeProfilePhoto = () => {
    if (viewOnly) return;
    setFiles(prev => ({ ...prev, profilePhoto: null }));
    setProfilePhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return Boolean(formData.name && formData.email && formData.email.includes('@') && formData.phone);
    }
    if (step === 2) {
      return Boolean(formData.title && formData.title.trim() !== '' && formData.industry && formData.industry.trim() !== '');
    }
    if (step === 3) {
      return Boolean(formData.growthPhilosophy && formData.successStory && formData.coachingStyle);
    }
    if (step === 4) {
      return Boolean(formData.desiredHourlyRate && formData.availableHours);
    }
    return false;
  };
  const isCurrentStepValid = () => validateStep(currentStep);
  const goToNextStep = () => { if (currentStep < totalSteps && isCurrentStepValid()) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0); } };
  const goToPreviousStep = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentStepValid()) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      let resumeUrl = '';
      let profilePhotoUrl = '';
      if (files.resume) {
        const resumePath = `resumes/${Date.now()}_${files.resume.name}`;
        await uploadFile(files.resume, resumePath);
        resumeUrl = getPublicUrl(resumePath);
      }
      if (files.profilePhoto) {
        const photoPath = `profile-photos/${Date.now()}_${files.profilePhoto.name}`;
        await uploadFile(files.profilePhoto, photoPath);
        profilePhotoUrl = getPublicUrl(photoPath);
      }
      const jsonData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title || 'Coach',
        certifications: formData.certifications,
        yearsCoaching: formData.yearsCoaching,
        industry: formData.industry,
        preferredIndustries: formData.preferredIndustries,
        languages: formData.languages,
        growthPhilosophy: formData.growthPhilosophy,
        successStory: formData.successStory,
        coachingStyle: formData.coachingStyle,
        targetClients: formData.targetClients,
        hourlyRate: formData.desiredHourlyRate || '',
        availableHours: formData.availableHours,
        offerPackages: formData.offerPackages,
        remoteOnly: formData.remoteOnly,
        groupCoaching: formData.groupCoaching,
        aiToolsExperience: formData.aiToolsExperience,
        referralSource: formData.referralSource,
        linkedinUrl: formData.linkedInUrl,
        resumeUrl,
        profilePhotoUrl,
        status: formData.status || 'Pending',
      };
      let response;
      if (editMode && coachId) {
        response = await coaches.update(coachId, jsonData);
      } else {
        response = await coaches.create(jsonData);
      }
      if (response.success) {
        setSubmissionSuccess(true);
        setApplicationId(response.data?.applicationId || 'APP123456');
        window.scrollTo(0, 0);
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setSubmissionError(response.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900 tracking-tight">Join as a Coach</h1>
        {applicationId && (
          <div className="mb-4 text-center text-green-700 font-semibold">Application ID: {applicationId}</div>
        )}
        {submissionSuccess ? (
          <div className="text-center text-green-700 font-bold text-xl">Application submitted successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input type="text" name="name" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="Your full name" value={formData.name} onChange={handleInputChange} required disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Professional Email *</label>
                    <input type="email" name="email" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange} required disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                    <input type="tel" name="phone" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="Your phone number" value={formData.phone} onChange={handleInputChange} required disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">LinkedIn URL</label>
                    <input type="url" name="linkedInUrl" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedInUrl} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Professional Certifications</label>
                    <input type="text" name="certifications" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="e.g. ICF, PCC, ACC, etc." value={formData.certifications} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Years of Coaching Experience</label>
                    <select name="yearsCoaching" className="w-full border-2 border-blue-200 rounded-lg p-3" value={formData.yearsCoaching} onChange={handleInputChange} disabled={viewOnly} >
                      <option value="">Select years...</option>
                      <option value="0-2">0-2 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-15">10-15 years</option>
                      <option value="15-20">15-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Industries</label>
                    <input type="text" name="preferredIndustries" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="e.g. Tech, Finance, Healthcare" value={formData.preferredIndustries} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Languages Spoken</label>
                    <input type="text" name="languages" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="e.g. English, Hindi, Spanish" value={formData.languages} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <input type="checkbox" name="groupCoaching" checked={formData.groupCoaching} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" disabled={viewOnly} />
                  <label className="text-gray-700 font-medium">Do you offer group coaching?</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Experience with AI tools in coaching</label>
                    <input type="text" name="aiToolsExperience" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="Describe your experience with AI tools" value={formData.aiToolsExperience} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">How did you hear about WinGroX?</label>
                    <input type="text" name="referralSource" className="w-full border-2 border-blue-200 rounded-lg p-3" placeholder="e.g. LinkedIn, Referral, Search" value={formData.referralSource} onChange={handleInputChange} disabled={viewOnly} />
                  </div>
                </div>
                <div className="mt-8">
                  <label className="block text-gray-700 font-medium mb-2">Profile Photo</label>
                  {profilePhotoPreview ? (
                    <div className="flex items-center gap-4">
                      <img src={profilePhotoPreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border" />
                      {!viewOnly && (
                        <button type="button" className="text-red-600 underline" onClick={removeProfilePhoto}>Remove</button>
                      )}
                    </div>
                  ) : (
                    <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="w-full border-2 border-gray-300 rounded-lg p-3" disabled={viewOnly} />
                  )}
                </div>
                <div className="mt-8">
                  <label className="block text-gray-700 font-medium mb-2">Resume</label>
                  <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full border-2 border-gray-300 rounded-lg p-3" disabled={viewOnly} />
                  <p className="text-xs text-gray-500 mt-1">PDF or Word document. Max size: 10MB</p>
                </div>
              </>
            )}
            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Current Job Title *</label>
                  <input type="text" name="title" className="w-full border-2 border-gray-300 rounded-lg p-3" placeholder="e.g. Executive Coach, Leadership Consultant" value={formData.title} onChange={handleInputChange} required disabled={viewOnly} />
                </div>
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-2">Industry Focus *</label>
                  <input type="text" name="industry" className="w-full border-2 border-gray-300 rounded-lg p-3" placeholder="e.g. Tech, Finance, Healthcare" value={formData.industry} onChange={handleInputChange} required disabled={viewOnly} />
                </div>
              </>
            )}
            {/* Step 3: Coaching Approach */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Growth Philosophy *</label>
                  <textarea name="growthPhilosophy" className="w-full border-2 border-gray-300 rounded-lg p-3 h-24" placeholder="Describe your approach..." value={formData.growthPhilosophy} onChange={handleInputChange} required disabled={viewOnly} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Coaching Style *</label>
                  <select name="coachingStyle" className="w-full border-2 border-gray-300 rounded-lg p-3" value={formData.coachingStyle} onChange={handleInputChange} required disabled={viewOnly} >
                    <option value="">Select your primary style...</option>
                    <option value="directive">Directive</option>
                    <option value="facilitative">Facilitative</option>
                    <option value="consultative">Consultative</option>
                    <option value="transformational">Transformational</option>
                    <option value="holistic">Holistic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Biggest Client Success Story *</label>
                  <textarea name="successStory" className="w-full border-2 border-gray-300 rounded-lg p-3 h-32" placeholder="Describe your most impressive client transformation..." value={formData.successStory} onChange={handleInputChange} required disabled={viewOnly} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Ideal Client Profile</label>
                  <input type="text" name="targetClients" className="w-full border-2 border-gray-300 rounded-lg p-3" placeholder="e.g., Startup founders, Mid-career professionals" value={formData.targetClients} onChange={handleInputChange} disabled={viewOnly} />
                </div>
              </>
            )}
            {/* Step 4: Business Details */}
            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Starting Price (INR) - Desired Hourly Rate *</label>
                  <select name="desiredHourlyRate" className="w-full border-2 border-gray-300 rounded-lg p-3" value={formData.desiredHourlyRate || ''} onChange={handleInputChange} required disabled={viewOnly} >
                    <option value="">Select hourly rate...</option>
                    <option value="500">₹500/hr</option>
                    <option value="1000">₹1,000/hr</option>
                    <option value="1500">₹1,500/hr</option>
                    <option value="2000">₹2,000/hr</option>
                    <option value="2500">₹2,500/hr</option>
                    <option value="3000">₹3,000/hr</option>
                    <option value="4000">₹4,000/hr</option>
                    <option value="5000">₹5,000/hr</option>
                    <option value="7500">₹7,500/hr</option>
                    <option value="10000">₹10,000/hr</option>
                    <option value="15000">₹15,000/hr</option>
                    <option value="20000">₹20,000/hr</option>
                  </select>
                </div>
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-2">Available Hours Per Week *</label>
                  <select name="availableHours" className="w-full border-2 border-gray-300 rounded-lg p-3" value={formData.availableHours} onChange={handleInputChange} required disabled={viewOnly} >
                    <option value="">Select availability...</option>
                    <option value="5-">Less than 5 hours</option>
                    <option value="5-10">5-10 hours</option>
                    <option value="10-20">10-20 hours</option>
                    <option value="20-30">20-30 hours</option>
                    <option value="30+">30+ hours</option>
                  </select>
                </div>
                <div className="flex items-start space-x-2 mt-6">
                  <input id="packages" name="offerPackages" type="checkbox" checked={formData.offerPackages} onChange={handleInputChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded" disabled={viewOnly} />
                  <label htmlFor="packages" className="block text-sm text-gray-700">I'm interested in offering fixed-price coaching packages in addition to hourly rates</label>
                </div>
                <div className="flex items-start space-x-2 mt-2">
                  <input id="remote" name="remoteOnly" type="checkbox" checked={formData.remoteOnly} onChange={handleInputChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded" disabled={viewOnly} />
                  <label htmlFor="remote" className="block text-sm text-gray-700">I'm available for remote coaching sessions only (no in-person)</label>
                </div>
              </>
            )}
            {/* Navigation & Submit Buttons */}
            {!viewOnly && (
              <div className="flex justify-between items-center mt-10 gap-4">
                {currentStep > 1 && (
                  <button type="button" className="py-2 px-6 border border-blue-300 rounded-lg text-blue-700 font-semibold bg-white hover:bg-blue-50 transition" onClick={goToPreviousStep}>Back</button>
                )}
                {currentStep < totalSteps ? (
                  <button type="button" className={`py-2 px-8 rounded-lg font-semibold ml-auto shadow-md transition ${isCurrentStepValid() ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} disabled={!isCurrentStepValid()} onClick={goToNextStep}>Continue</button>
                ) : (
                  <button type="submit" className={`py-2 px-8 rounded-lg font-semibold ml-auto shadow-md transition ${isCurrentStepValid() ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} disabled={!isCurrentStepValid() || isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Submitting...
                      </div>
                    ) : "Submit Application"}
                  </button>
                )}
              </div>
            )}
            {submissionError && <div className="text-red-600 text-center mt-4">{submissionError}</div>}
            <p className="text-sm text-gray-500 mt-8 text-center">Our application process includes portfolio review, skill assessment, and interview.<br />We accept the top 5% of applicants to maintain quality standards.</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinAsCoach;