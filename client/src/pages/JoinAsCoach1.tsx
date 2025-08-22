import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Define props for edit mode if needed
interface JoinAsCoachProps {
  initialData?: any;
  editMode?: boolean;
  coachId?: string;
  onSubmitSuccess?: () => void;
}

const defaultFormData = {
  name: '',
  email: '',
  phone: '',
  linkedInUrl: '',
  specialization: '',
  experience: '',
  currentTitle: '',
  industry: '',
  growthPhilosophy: '',
  successStory: '',
  coachingStyle: '',
  targetClients: '',
  hourlyRate: '',
  availableHours: '',
  offerPackages: false,
  remoteOnly: true
};

const JoinAsCoach: React.FC<JoinAsCoachProps> = ({ initialData, editMode, coachId, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...(initialData || {})
  });
  const [files, setFiles] = useState<{ resume: File | null; profilePhoto: File | null }>({
    resume: null,
    profilePhoto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFiles(prev => ({
        ...prev,
        [name]: file
      }));
      if (name === 'profilePhoto') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    setFiles(prev => ({
      ...prev,
      profilePhoto: null
    }));
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form validation by step
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return Boolean(
          formData.name && 
          formData.email && 
          formData.email.includes('@') &&
          formData.phone
        );
      case 2:
        return Boolean(
          formData.specialization && 
          formData.experience && 
          formData.currentTitle
        );
      case 3:
        return Boolean(
          formData.growthPhilosophy &&
          formData.successStory && 
          formData.coachingStyle
        );
      case 4:
        return Boolean(
          formData.hourlyRate &&
          formData.availableHours
        );
      default:
        return false;
    }
  };

  const isCurrentStepValid = () => validateStep(currentStep);

  const goToNextStep = () => {
    if (currentStep < totalSteps && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Dummy submit handler (replace with real API logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentStepValid()) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      // Simulate success
      setSubmissionSuccess(true);
      setApplicationId('APP123456');
      window.scrollTo(0, 0);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl pt-6 pb-8 md:pt-8 md:pb-12 px-4 md:px-12 text-white relative overflow-hidden mb-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
            Join as Coach
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-5 text-blue-100">
            Transform your expertise into a thriving practice. Help ambitious growth seekers achieve breakthrough results.
          </h2>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
      {/* ...rest of the form and UI... */}
    </div>
  );
};

export default JoinAsCoach;
