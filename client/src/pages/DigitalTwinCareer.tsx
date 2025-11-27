import React, { useEffect, useState, useCallback, useMemo } from 'react';
// For PDF expomongodb+srvrt
import html2pdf from 'html2pdf.js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement, 
  LineElement, 
  ArcElement,
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { calculateDigitalTwinScores } from '../services/digitalTwinClientScoring';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, 
  LineElement, 
  ArcElement,
  Filler, 
  Tooltip, 
  Legend
);


// Constants
const API_URL = `${process.env.REACT_APP_API_URL}/api`;

// Define question types for TypeScript
interface Option {
  option?: string;
  text: string;
  score?: number;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options?: Option[];
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  yearsExperience?: string;
  aspiration?: string;
  passion?: string;
  purpose?: string;
}

// Simple Markdown to HTML converter
const convertMarkdownToHTML = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br />')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<ul')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
};




const CareerAssessment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentType] = useState<string>('digital-twin-individual');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    company: '',
    yearsExperience: '',
    aspiration: '',
    passion: '',
    purpose: ''
  });
  const [showIntro, setShowIntro] = useState(true);
  const [showAspirationStep, setShowAspirationStep] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [scoringResults, setScoringResults] = useState<any>(null);
  const [, setLoadingScores] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<{ [key: string]: boolean }>({});
  
  // Toggle expanded state for a specific insight
  const toggleInsight = (key: string) => {
    setExpandedInsights(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Handle user data input changes
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle answer selection for Digital Twin assessment
  const handleAnswerSelect = (questionId: number, optionLetter: string) => {
    const stringKey = String(questionId);
    setAnswers(prev => ({
      ...prev,
      [stringKey]: optionLetter
    }));
  };

  // Handle moving from intro to aspiration step
  const handleContinueToAspiration = () => {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowIntro(false);
    setShowAspirationStep(true);
  };

  // Handle starting the assessment (move from aspiration step to assessment)
  const handleStartAssessment = async () => {
    try {
      // Validate required fields before submission
      if (!userData.firstName || !userData.firstName.trim()) {
        toast.error('First name is required');
        return;
      }
      if (!userData.lastName || !userData.lastName.trim()) {
        toast.error('Last name is required');
        return;
      }
      if (!userData.email || !userData.email.trim()) {
        toast.error('Email is required');
        return;
      }

      // Log the data being sent
      console.log('Sending user data to backend:', {
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim(),
        email: userData.email?.trim(),
        jobTitle: userData.jobTitle?.trim(),
        company: userData.company?.trim(),
        aspiration: userData.aspiration?.trim(),
        passion: userData.passion?.trim(),
        purpose: userData.purpose?.trim(),
      });

      // Create JSON payload for Digital Twin assessment submission
      const assessmentData = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        jobTitle: (userData.jobTitle || '').trim(),
        company: (userData.company || '').trim(),
        yearsExperience: (userData.yearsExperience || '').trim(),
        aspiration: (userData.aspiration || '').trim(),
        passion: (userData.passion || '').trim(),
        purpose: (userData.purpose || '').trim(),
        individualType: assessmentType,
        category: localStorage.getItem('digitalTwinCategory') || '',
        assessmentType: 'digital-twin-individual'
      };

      // Submit user data to backend
      const response = await axios.post(`${API_URL}/digitaltwin/individual`, assessmentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Digital Twin submission response:', response.data);
      
      // Extract assessment ID from response
      const assessmentId = response.data?.data?._id;
      
      if (!assessmentId) {
        console.error('No assessment ID returned from server. Response:', response.data);
        toast.error('Failed to start Digital Twin. Please try again.');
        return;
      }
      
      setAssessmentId(assessmentId);
      console.log('Digital Twin started with ID:', assessmentId);
      toast.success('Digital Twin started successfully!');
      setShowAspirationStep(false);
      setShowAssessment(true);
    } catch (error: any) {
      console.error('Error starting digital twin:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Network error. Please check your connection and try again.');
    }
  };

  // Clean up chart instances when component unmounts or when showResults changes
  useEffect(() => {
    return () => {
      if (showResults) {
        // Destroy chart instances when component unmounts or when hiding results
        ChartJS.getChart('radar-chart')?.destroy();
      }
    };
  }, [showResults]);

  // When results are shown, check if scoring results exist and generate AI report
  // TODO: Uncomment when report generation endpoint is ready
  // useEffect(() => {
  //   if (showResults && assessmentId && scoringResults) {
  //     console.log('Results displayed with scores:', scoringResults);
  //     
  //     // Generate AI report in background if not already loading
  //     if (!loadingReport && !aiReport) {
  //       console.log('Triggering AI report generation in background');
  //       setLoadingReport(true);
  //       generateAIReport(assessmentId);
  //     }
  //   }
  // }, [showResults, scoringResults, assessmentId, loadingReport, aiReport]);

  useEffect(() => {
    // Load Digital Twin questions from JSON
    try {
      const scoringLogicData = require('../data/DIGITAL-TWIN-SCORING-LOGIC.json');
      const questions = scoringLogicData.digitalTwinScoringFramework.questions;
      
      const questionsData = questions.map((q: any) => ({
        id: q.questionId,
        category: q.theme
          .replace(/Identity & Purpose Alignment/, 'Identity & Purpose')
          .replace(/Flow & Strength Expression/, 'Flow & Strength')
          .replace(/Career Trajectory Perception/, 'Career Trajectory')
          .replace(/Emotional Relationship with Work/, 'Emotional Work')
          .replace(/Energy & Workload Reality/, 'Energy & Workload')
          .replace(/Cultural Tension Signal/, 'Cultural Fit')
          .replace(/Leadership Energy Drain \/ Boost/, 'Leadership Impact')
          .replace(/Meaning & Values Alignment/, 'Values Alignment')
          .replace(/Reinvention & Future-Readiness/, 'Reinvention Ready')
          .replace(/Hidden Passion & Future Self Expression/, 'Hidden Passion'),
        question: q.question,
        options: q.scoringOptions.map((opt: any) => ({
          option: opt.option,
          text: opt.text
        }))
      })) as Question[];
      
      console.log('✅ Loaded Digital Twin questions:', questionsData.length);
      setQuestions(questionsData);
    } catch (error) {
      console.error('❌ Failed to load Digital Twin questions from JSON:', error);
      setQuestions([]);
    }
    
    setIsLoading(false);
  }, []);



  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // End of assessment: just show results, login already handled at start
      showAssessmentResults();
    }
  };

  // Handle moving to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };


  // Save assessment progress without completing
  const saveAssessmentProgress = async () => {
    try {
      if (!assessmentId) {
        toast.error('Assessment ID not found');
        return;
      }

      // Prepare the response data with current answers
      const responseData = {
        answers: answers,
        lastSavedAt: new Date().toISOString(),
        assessmentType: assessmentType,
        currentQuestionIndex: currentQuestionIndex
      };

      // Add user profile data
      const enhancedResponseData = {
        ...responseData,
        userData: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          jobTitle: userData.jobTitle,
          company: userData.company,
          yearsExperience: userData.yearsExperience
        }
      };

      // Use Digital Twin endpoint
      const assessmentEndpoint = 'individual';

      console.log(`Saving progress to /assessment/${assessmentEndpoint}/${assessmentId}/save-progress`);

      const response = await axios.put(
        `${API_URL}/assessment/${assessmentEndpoint}/${assessmentId}/save-progress`,
        { responseData: enhancedResponseData },
        { timeout: 10000 }
      );

      console.log('Save progress response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Progress saved successfully! You can resume later.');
        return true;
      } else {
        toast.error('Failed to save progress');
        return false;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Error saving progress. Trying to save locally...');

      // Fallback to local storage
      try {
        localStorage.setItem(`assessment-draft-${assessmentId}`, JSON.stringify({
          answers,
          currentQuestionIndex,
          userData,
          timestamp: new Date().toISOString(),
          assessmentType
        }));
        toast.info('Progress saved locally. It will sync when you resume.');
        console.log('Progress saved to local storage as fallback');
      } catch (localStorageError) {
        console.error('Could not save to local storage:', localStorageError);
      }

      return false;
    }
  };

  // Submit the completed assessment to the database
  const submitCompletedAssessment = async (assessmentId: string, responseData: any) => {
    try {
      console.log('Submitting completed assessment:', assessmentId, responseData);

      // Add user profile data
      const enhancedResponseData = {
        ...responseData,
        userData: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          jobTitle: userData.jobTitle,
          company: userData.company,
          yearsExperience: userData.yearsExperience
        }
      };
      
      // Use Digital Twin endpoint
      const endpoint = `${API_URL}/digitaltwin/individual/${assessmentId}`;
      
      console.log(`Making PUT request to ${endpoint}`);
      
      // Add timeout to axios request to prevent long hanging requests
      const response = await axios.put(
        endpoint, 
        { responseData: enhancedResponseData },
        { timeout: 10000 } // 10 second timeout
      );
      
      console.log('Assessment submission response:', response.data);
      
      if (response.data && response.data.success) {
        console.log('Assessment completed and saved successfully:', response.data);
        return true;
      } else {
        console.error('Failed to save completed assessment:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error saving completed assessment:', error);
      // Show error notification
      toast.error('Error saving assessment: Results saved locally but not to server.');
      
      // Save to local storage as a fallback
      try {
        localStorage.setItem(`assessment-${assessmentId}`, JSON.stringify({
          responseData,
          timestamp: new Date().toISOString(),
          userData: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
          }
        }));
        console.log('Assessment data saved to local storage as fallback');
      } catch (localStorageError) {
        console.error('Could not save to local storage:', localStorageError);
      }
      
      return false;
    }
  };



  // Calculate and display results
  const showAssessmentResults = async () => {
    try {
      setSubmitError('');
      console.log('=== ASSESSMENT SUBMISSION STARTED ===');
      console.log('Assessment Type:', assessmentType);
      console.log('Answers received:', answers);
      console.log('Answer keys:', Object.keys(answers));
      
      // Prepare the response data with just the answers
      const responseData = {
        answers: answers,
        completedAt: new Date().toISOString(),
        assessmentType: assessmentType
      };
      
      // Calculate Digital Twin scores CLIENT-SIDE
      try {
        const results = calculateDigitalTwinScores(answers as { [key: string]: string });
        console.log('✅ Scoring complete:', results);
        setScoringResults(results);
        
        setShowAssessment(false);
        setShowResults(true);
        window.scrollTo(0, 0);
        
        // Save to server in background
        if (assessmentId) {
          submitCompletedAssessment(assessmentId, responseData)
            .catch(err => console.error('Background save failed:', err));
        }
      } catch (scoringError) {
        console.error('❌ Error calculating scores:', scoringError);
        toast.error('Could not generate scoring results. Please try again.');
        setShowAssessment(false);
        setShowResults(true);
      }
      
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('❌ Outer error processing assessment:', error);
      setSubmitError('An error occurred. Please try again.');
      setLoadingScores(false);
      setShowAssessment(false);
      setShowResults(true);
      window.scrollTo(0, 0);
    }
  };

  // Generate AI-powered report based on aspiration, passion, purpose
  const generateAIReport = async (id: string) => {
    if (!id) {
      console.error('No assessment ID provided for report generation');
      return;
    }

    try {
      setLoadingReport(true);
      console.log('Generating AI report for assessment:', id);
      
      const response = await axios.post(
        `${API_URL}/assessment/generate-report/${id}`,
        { type: 'individual' },
        { 
          timeout: 150000, // 2.5 minutes for comprehensive AI report generation
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('AI report response:', response.data);
      
      if (response.data && response.data.success && response.data.report) {
        setAiReport(response.data.report);
        console.log('AI report generated successfully');
        toast.success('🎉 Your personalized Digital Twin report is ready!');
      } else {
        console.error('Failed to generate AI report:', response.data);
        toast.error('Could not generate AI report. Please try again.');
      }
    } catch (error: any) {
      console.error('Error generating AI report:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Report generation failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoadingReport(false);
    }
  };



  // Progress percentage for the assessment
  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    const raw = (currentQuestionIndex / (questions.length - 1)) * 100;
    return Number.isFinite(raw) ? Math.round(raw) : 0;
  }, [currentQuestionIndex, questions.length]);

  // Render the introduction section
  const renderIntroSection = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">
          Digital Twin Career Assessment
        </h2>
        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This assessment will create your personalized Digital Twin - a comprehensive snapshot of your career alignment, purpose, and transformation opportunities across 10 key dimensions.
          </p>
          
          <div className="bg-purple-50 border-purple-500 border-l-4 p-4 mb-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">What to expect</h3>
            <ul className="list-disc list-inside text-purple-700 space-y-1">
              <li>The assessment contains 10 carefully crafted questions covering identity, purpose, flow, and transformation readiness.</li>
              <li>Takes approximately 10-15 minutes to complete.</li>
              <li>Your responses generate an immediate personalized Digital Twin profile with actionable insights.</li>
              <li>Receive a transformation roadmap with 24-hour, 7-day, and 30-day micro-actions.</li>
              <li>All responses are confidential and secure.</li>
            </ul>
          </div>
        </div>
        
        <form className="space-y-6">
          {/* Always required: First Name, Last Name, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input 
                type="text"
                id="firstName"
                name="firstName"
                value={userData.firstName}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input 
                type="text"
                id="lastName"
                name="lastName"
                value={userData.lastName}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input 
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleUserDataChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Professional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
              <input 
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={userData.jobTitle}
                onChange={handleUserDataChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
              <input 
                type="text"
                id="company"
                name="company"
                value={userData.company}
                onChange={handleUserDataChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <select
              id="yearsExperience"
              name="yearsExperience"
              value={userData.yearsExperience}
              onChange={(e) => setUserData({...userData, yearsExperience: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <button
              type="button"
              onClick={handleContinueToAspiration}
              className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              Start
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render the aspiration step section
  const renderAspirationSection = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-600 mb-6">Your Aspirations & Purpose</h2>
        <p className="text-gray-600 mb-8">
          Help us understand what drives you. These insights will help create a more personalized analysis.
        </p>

        <form className="space-y-6">
          <div>
            <label htmlFor="aspiration" className="block text-sm font-medium text-gray-700 mb-2">
              What are your aspirations?
            </label>
            <textarea
              id="aspiration"
              name="aspiration"
              value={userData.aspiration}
              onChange={(e) => setUserData(prev => ({ ...prev, aspiration: e.target.value }))}
              placeholder="What do you aspire to achieve in your career/life? (e.g., become a leader in technology, make a positive impact on society)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="passion" className="block text-sm font-medium text-gray-700 mb-2">
              What are you passionate about? 
            </label>
            <textarea
              id="passion"
              name="passion"
              value={userData.passion}
              onChange={(e) => setUserData(prev => ({ ...prev, passion: e.target.value }))}
              placeholder="What topics, activities, or causes excite you the most? (e.g., innovation, helping others, creative problem-solving)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              What is your purpose?
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={userData.purpose}
              onChange={(e) => setUserData(prev => ({ ...prev, purpose: e.target.value }))}
              placeholder="What is your deeper 'why'? What impact do you want to make? (e.g., contribute to sustainable technology, empower the next generation)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => { setShowAspirationStep(false); setShowIntro(true); }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleStartAssessment}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render the assessment questions section
  const renderAssessmentSection = () => {
    if (questions.length === 0 || !questions[currentQuestionIndex]) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-700 mb-4">No questions available. Please try again later.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const gradient = 'from-purple-600 via-pink-500 to-rose-500';
    const icon = '💫';

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Beautiful Header Banner */}
        <div className={`relative h-56 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {/* Decorative Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          {/* Dot Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-between px-10 py-6">
            <div className="flex-1">
              {/* Question Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-3 border border-white/30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold tracking-wider uppercase">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Category Title */}
              <h2 className="text-4xl font-black text-white mb-2 leading-tight drop-shadow-2xl">
                {currentQuestion.category}
              </h2>

              {/* Progress Info */}
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-32 bg-white/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-white/90 text-sm font-semibold">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>

            {/* Right Side: Giant Icon */}
            <div className="flex-shrink-0 relative">
              <div className="relative">
                <div className="w-32 h-32 bg-white/15 backdrop-blur-xl rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <span className="text-6xl drop-shadow-2xl">{icon}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-20" fill="white">
              <path d="M0,32 C240,96 480,96 720,64 C960,32 1200,0 1440,32 L1440,120 L0,120 Z" opacity="0.3"></path>
              <path d="M0,64 C240,32 480,32 720,48 C960,64 1200,80 1440,64 L1440,120 L0,120 Z" opacity="0.5"></path>
              <path d="M0,96 C240,80 480,64 720,80 C960,96 1200,112 1440,96 L1440,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-12 pt-8 pb-12">
          {/* Question */}
          <div className="mb-8">
            <p className="text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options && currentQuestion.options.map((option: any, index: number) => {
                const optionLetter = option.option || String.fromCharCode(97 + index);
                const questionKey = String(currentQuestion.id);  // Convert to STRING key
                const isSelected = answers[questionKey] === optionLetter;

                return (
                  <div 
                    key={`${currentQuestion.id}-${optionLetter}`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                    className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? `border-transparent bg-gradient-to-br ${gradient} shadow-lg` 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5 transition-all ${
                        isSelected 
                          ? 'bg-white/30 backdrop-blur-sm ring-2 ring-white/50' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <span className={`text-sm font-bold ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`}>
                          {optionLetter.toUpperCase()}
                        </span>
                      </div>
                      <span className={`text-base leading-relaxed ${
                        isSelected ? 'text-white font-medium' : 'text-gray-800 group-hover:text-gray-900'
                      }`}>
                        {option.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-10 mt-10 border-t-2 border-gray-200">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentQuestionIndex === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={!answers[String(currentQuestion.id)]}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${!answers[String(currentQuestion.id)] ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : `bg-gradient-to-r ${gradient} text-white hover:shadow-lg`}`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish ✔️' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the results section
  const renderResultsSection = () => {
    const gradient = 'from-purple-600 via-pink-500 to-rose-500';
    
    return (
      <div className="min-h-screen flex items-center justify-center px-0 py-12 bg-white">
        <div className="w-full">
          {/* Main Thank You Card - Enhanced */}
          <div className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-2xl p-12 text-white mb-8 relative overflow-hidden border-0`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Success Icon - Animated and Larger */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse scale-150"></div>
                  <div className="absolute inset-2 bg-white/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="relative w-32 h-32 bg-white/30 rounded-full flex items-center justify-center border-4 border-white/80 backdrop-blur-sm">
                    <svg className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Main message - Enhanced Contrast & Typography */}
              <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg" style={{textShadow: '0 6px 20px rgba(0,0,0,0.4)', letterSpacing: '-0.02em'}}>
                Assessment Complete!
              </h1>
              
              {/* Digital Twin Message - NEW */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
                <p className="text-3xl md:text-4xl font-black mb-3 drop-shadow-lg" style={{textShadow: '0 4px 12px rgba(0,0,0,0.3)'}}>
                  🚀 Your Digital Twin Creation Begins
                </p>
                <p className="text-lg md:text-xl font-semibold drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                  Your first step towards building your Digital Twin is done. We're analyzing your insights to create a personalized transformation roadmap.
                </p>
              </div>
              
              <p className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                Thank you for your thoughtful responses
              </p>
             
            </div>
          </div>
          
          {/* Completion Summary Card - Enhanced */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-0">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Questions Answered */}
              
            </div>
            
            {/* Success/Error Message */}
            {submitError && (
              <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-6 mb-8">
                <p className="text-red-900 text-lg font-bold">⚠️ {submitError}</p>
              </div>
            )}
            
            {!submitError && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-6 mb-8 shadow-lg">
                <p className="text-emerald-900 text-lg font-black">
                  ✓ Your responses have been securely stored and encrypted
                </p>              
              </div>
            )}

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-200 mb-8">
              <h3 className="text-2xl font-black text-indigo-900 mb-4">What Happens Next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-4">
                  <span className="text-2xl font-black text-indigo-600 flex-shrink-0">①</span>
                  <span className="text-gray-800 font-semibold text-lg">We analyze your unique patterns, strengths, and transformation opportunities</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl font-black text-purple-600 flex-shrink-0">②</span>
                  <span className="text-gray-800 font-semibold text-lg">We generate your personalized Digital Twin profile with actionable insights</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl font-black text-pink-600 flex-shrink-0">③</span>
                  <span className="text-gray-800 font-semibold text-lg">You receive a comprehensive transformation roadmap tailored to your vision</span>
                </li>
              </ul>
            </div>

            {/* Scoring Results Section */}
            {scoringResults ? (
              <div className="rounded-2xl p-8 mb-8">
                <h3 className="text-3xl font-black text-purple-900 mb-8">🎯 Your Digital Twin Career Snapshot</h3>
                
                {/* Score Breakdown by Dimension - with color-coded cards */}
                {scoringResults.scores && scoringResults.scores.length > 0 && (
                  <div className="space-y-4">
                    {scoringResults.scores.map((score: any, idx: number) => {
                      const colors = [
                        'from-purple-500 to-pink-500',
                        'from-blue-500 to-cyan-500',
                        'from-emerald-500 to-teal-500',
                        'from-orange-500 to-amber-500',
                        'from-rose-500 to-pink-500',
                        'from-indigo-500 to-purple-500',
                        'from-violet-500 to-fuchsia-500',
                        'from-lime-500 to-green-500',
                        'from-sky-500 to-blue-500',
                        'from-fuchsia-500 to-rose-500'
                      ];
                      const colorClass = colors[idx % colors.length];
                      const isUnanswered = score.userScore === 0 && !score.selectedOption;
                      const statusColor = isUnanswered ? 'text-gray-400' : score.userScore >= 80 ? 'text-emerald-600' : score.userScore >= 60 ? 'text-blue-600' : score.userScore >= 40 ? 'text-amber-600' : 'text-red-600';
                      
                      return (
                        <div key={idx} className={`${isUnanswered ? 'bg-gray-50 opacity-60' : 'bg-white'} rounded-lg shadow-md border-l-4 border-gradient overflow-hidden hover:shadow-lg transition-shadow`}>
                          {/* Color Breaker at Top */}
                          <div className={`h-1 bg-gradient-to-r ${isUnanswered ? 'from-gray-300 to-gray-300' : colorClass}`}></div>
                          
                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className={`text-lg font-black ${isUnanswered ? 'text-gray-500' : 'text-gray-900'}`}>
                                  Q{score.questionId}. {score.dimensionName}
                                </h4>
                                <p className="text-sm text-gray-600 font-semibold">{score.indexName}</p>
                              </div>
                              <div className="text-right">
                                <div className={`text-3xl font-black ${statusColor}`}>
                                  {isUnanswered ? '?' : `${score.userScore}`}
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{isUnanswered ? 'Not Answered' : score.scoreType}</span>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className={`w-full rounded-full h-2 overflow-hidden mb-3 ${isUnanswered ? 'bg-gray-300' : 'bg-gray-200'}`}>
                              <div 
                                className={`${isUnanswered ? 'bg-gray-300' : `bg-gradient-to-r ${colorClass}`} h-2 rounded-full transition-all`}
                                style={{width: `${isUnanswered ? 0 : score.userScore}%`}}
                              ></div>
                            </div>
                            
                            {/* Title (if available) */}
                            {!isUnanswered && score.title && (
                              <h5 className="text-base font-bold text-purple-800 mb-2">{score.title}</h5>
                            )}
                            
                            {/* Depiction (Brief Summary) */}
                            {!isUnanswered && score.depiction && (
                              <div className="text-sm text-gray-700 font-medium mb-3 italic">
                                {score.depiction}
                              </div>
                            )}
                            
                            {/* Key Insight (Detailed Analysis) */}
                            <div className={`text-sm ${isUnanswered ? 'text-gray-500 italic' : 'text-gray-700'} leading-relaxed`}>
                              {isUnanswered ? (
                                <span className="italic">✍️ Please go back and answer this question to unlock your insights.</span>
                              ) : (
                                <>
                                  <div className="whitespace-pre-line">
                                    {expandedInsights[score.dimension] 
                                      ? score.description 
                                      : (score.description && score.description.length > 400)
                                        ? `${score.description.substring(0, 400)}...` 
                                        : score.description
                                    }
                                  </div>
                                  {score.description && score.description.length > 400 && (
                                    <button
                                      onClick={() => toggleInsight(score.dimension)}
                                      className="text-white hover:text-gray-100 font-bold mt-3 inline-flex items-center gap-1 transition-colors underline decoration-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
                                    >
                                      {expandedInsights[score.dimension] ? '← Read Less' : 'Read More →'}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Micro-Actions for This Question */}
                            {!isUnanswered && score.microActions && (score.microActions.hours24 || score.microActions.days7 || score.microActions.days30) && (
                              <div className="mt-6 space-y-4">
                                <h5 className="text-base font-black text-purple-800 mb-3">🎯 Your Action Plan for This Dimension:</h5>
                                
                                {/* 24 Hours */}
                                {score.microActions.hours24 && (
                                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                                    <div className="flex items-start gap-3">
                                      <span className="text-orange-600 font-black text-lg mt-0.5">⚡</span>
                                      <div>
                                        <h6 className="text-sm font-bold text-orange-900 mb-1">Next 24 Hours:</h6>
                                        <p className="text-sm text-gray-700">{score.microActions.hours24}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 7 Days */}
                                {score.microActions.days7 && (
                                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                                    <div className="flex items-start gap-3">
                                      <span className="text-amber-600 font-black text-lg mt-0.5">📅</span>
                                      <div>
                                        <h6 className="text-sm font-bold text-amber-900 mb-1">Next 7 Days:</h6>
                                        <p className="text-sm text-gray-700">{score.microActions.days7}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 30 Days */}
                                {score.microActions.days30 && (
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                                    <div className="flex items-start gap-3">
                                      <span className="text-green-600 font-black text-lg mt-0.5">🚀</span>
                                      <div>
                                        <h6 className="text-sm font-bold text-green-900 mb-1">Next 30 Days:</h6>
                                        <p className="text-sm text-gray-700">{score.microActions.days30}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Key Insights */}
                {scoringResults.keyInsights && scoringResults.keyInsights.length > 0 && (
                  <div className="bg-white rounded-xl p-6 mb-6 shadow-md border-2 border-purple-200">
                    <h4 className="text-xl font-black text-purple-900 mb-4">💡 Key Insights</h4>
                    <ul className="space-y-2">
                      {scoringResults.keyInsights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-purple-600 font-black mt-1 text-lg">•</span>
                          <span className="text-gray-700 font-semibold">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Immediate Action Items */}
                {scoringResults.actionPlan && scoringResults.actionPlan.immediate && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 shadow-md border-2 border-orange-300">
                    <h4 className="text-xl font-black text-orange-900 mb-4">⚡ Next 24 Hours - Immediate Actions</h4>
                    <ul className="space-y-2">
                      {scoringResults.actionPlan.immediate.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-orange-600 font-black">→</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Short Term Actions */}
                {scoringResults.actionPlan && scoringResults.actionPlan.shortTerm && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 mb-6 shadow-md border-2 border-yellow-300">
                    <h4 className="text-xl font-black text-amber-900 mb-4">📅 Next 7 Days - Short Term Focus</h4>
                    <ul className="space-y-2">
                      {scoringResults.actionPlan.shortTerm.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-amber-600 font-black">→</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Long Term Actions */}
                {scoringResults.actionPlan && scoringResults.actionPlan.longTerm && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 shadow-md border-2 border-green-300">
                    <h4 className="text-xl font-black text-green-900 mb-4">🚀 Next 30 Days - Long Term Strategy</h4>
                    <ul className="space-y-2">
                      {scoringResults.actionPlan.longTerm.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-600 font-black">→</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {/* AI-Generated Report Section - Shows after generation */}
            {aiReport && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-8 shadow-lg border-3 border-amber-300">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">🤖</span>
                  <h3 className="text-2xl font-black text-amber-900">Your Personalized AI-Generated Report</h3>
                </div>
                <div 
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(aiReport) }}
                />
              </div>
            )}

            {/* AI Report Loading Indicator */}
            {loadingReport && (
              <div className="bg-blue-50 rounded-2xl p-8 mb-8 border-2 border-blue-300 shadow-md">
                <div className="flex items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-lg font-bold text-blue-900">Generating your personalized AI report...</p>
                    <p className="text-sm text-blue-700 mt-1">This typically takes 30-60 seconds</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl transition transform hover:scale-110 shadow-xl border-0 drop-shadow-lg"
            >
              Return to Home
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setShowAssessment(false);
                setShowIntro(true);
                setShowAspirationStep(false);
                setAnswers({});
                window.scrollTo(0, 0);
              }}
              className="px-10 py-5 bg-white text-indigo-700 font-black text-lg rounded-2xl transition transform hover:scale-110 shadow-xl border-3 border-indigo-600 hover:bg-indigo-50 drop-shadow-lg"
            >
              Retake Assessment
            </button>
          </div>
          
          {/* Footer Information - Enhanced */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-gradient-to-r from-indigo-600 to-pink-600">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-4">
              Your Digital Twin Journey Awaits
            </p>
            <p className="text-gray-700 font-semibold text-lg mb-4">
              We'll reach out within 24 hours with your personalized insights and transformation roadmap
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-gray-600 font-medium mb-1">Assessment ID</p>
              <p className="font-mono font-black text-gray-900 text-lg tracking-wider">{assessmentId}</p>
              <p className="text-xs text-gray-500 mt-2 font-medium">Keep this ID for your records</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN COMPONENT RETURN STATEMENT =====
  // This return is inside the CareerAssessment component
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Main content section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {showIntro && renderIntroSection()}
          {showAspirationStep && renderAspirationSection()}
          {showAssessment && renderAssessmentSection()}
          {showResults && renderResultsSection()}
        </>
      )}
    </div>
  );
};

export default CareerAssessment;

