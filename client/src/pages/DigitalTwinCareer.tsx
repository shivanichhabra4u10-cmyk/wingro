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
import DigitalTwinPricingPlans from '../components/DigitalTwinPricingPlans';
import EnrollmentModal from '../components/EnrollmentModal';

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
  contactNo: string;
  linkedInUrl?: string;
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
  
  let html = markdown;
  
  // Convert markdown tables to HTML tables
  // First, normalize all line breaks to \n for consistent processing
  html = html.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  
  const tableRegex = /\n\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headerCells = header.split('|').filter((cell: string) => cell.trim()).map((cell: string) => 
      `<th style='padding: 8px; text-align: left; border: 1px solid #e0e0e0; font-weight: 600;'>${cell.trim()}</th>`
    ).join('');
    
    const rowsArray = rows.trim().split('\n').filter((r: string) => r.trim() && r.includes('|')).map((row: string) => {
      const cells = row.split('|').filter((cell: string, idx: number, arr: any[]) => {
        // Filter out empty cells at start/end (from leading/trailing |)
        return cell.trim() || (idx > 0 && idx < arr.length - 1);
      }).map((cell: string) => 
        `<td style='padding: 8px; border: 1px solid #e0e0e0;'>${cell.trim()}</td>`
      ).join('');
      return cells ? `<tr>${cells}</tr>` : '';
    }).filter((row: string) => row).join('');
    
    return `\n<table style='width: 100%; border-collapse: collapse; margin: 0 0 8px 0; border: 1px solid #e0e0e0; background: white;'>
      <thead><tr style='background: #f5f5f5;'>${headerCells}</tr></thead>
      <tbody>${rowsArray}</tbody>
    </table>\n`;
  });
  
  html = html
    // Headers (with proper spacing)
    .replace(/^### (.*$)/gim, '<h3 style="margin-top: 5px; margin-bottom: 12px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin-top: 5px; margin-bottom: 12px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="margin-top: 5px; margin-bottom: 12px;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #2563eb; text-decoration: underline;">$1</a>')
    // Paragraph breaks (double line break)
    .replace(/\n\n+/g, '</p><p style="margin-bottom: 16px;">')
    // Single line breaks
    .replace(/\n/g, '<br />')
    // Lists
    .replace(/^[\-•] (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/s, '<ul style="margin: 12px 0; padding-left: 24px;">$1</ul>');
  
  // Clean up spacing around tables - remove breaks and close paragraphs before tables
  html = html.replace(/(<br \/>)*\s*(<table)/g, '</p>$2');
  html = html.replace(/(<\/table>)\s*(<br \/>)*/g, '$1<p style="margin-bottom: 16px;">');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<ul') && !html.startsWith('<table')) {
    html = `<p style="margin-bottom: 16px;">${html}</p>`;
  }
  
  // Clean up any empty paragraphs or multiple breaks
  html = html.replace(/<p[^>]*><\/p>/g, '').replace(/(<br \/>)+/g, '<br />');
  
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
    contactNo: '',
    linkedInUrl: '',
    jobTitle: '',
    company: '',
    yearsExperience: '',
    aspiration: '',
    passion: '',
    purpose: ''
  });
  const [showIntro, setShowIntro] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(true);
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
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showEnrollmentConfirmation, setShowEnrollmentConfirmation] = useState(false);
  const [enrolledPlanName, setEnrolledPlanName] = useState<string>('');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentPlan, setEnrollmentPlan] = useState<string>('');
  
  // Toggle expanded state for a specific insight
  const toggleInsight = (key: string) => {
    setExpandedInsights(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle plan selection and proceed to intro
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);    
    
    // If it's the free plan, proceed directly to intro
    if (planId === 'digital-twin-free') {
      setShowPlanSelection(false);
      setShowIntro(true);
      window.scrollTo(0, 0);
    } else {
      // For paid plans: Always show modal to keep user in the flow
      console.log('Opening enrollment modal for plan:', planId);
      setEnrollmentPlan(planId);
      setShowEnrollmentModal(true);
    }
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

  // Handle moving from intro to assessment
  const handleContinueToAspiration = async () => {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.contactNo) {
      toast.error('Please fill in all required fields (First Name, Last Name, Email, and Contact Number)');
      return;
    }
    // Directly start assessment
    await handleStartAssessment();
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
      if (!userData.contactNo || !userData.contactNo.trim()) {
        toast.error('Contact number is required');
        return;
      }

      // Log the data being sent
      console.log('Sending user data to backend:', {
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim(),
        email: userData.email?.trim(),
        contactNo: userData.contactNo?.trim(),
        linkedInUrl: userData.linkedInUrl?.trim(),
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
        contactNo: userData.contactNo.trim(),
        linkedInUrl: (userData.linkedInUrl || '').trim(),
        jobTitle: (userData.jobTitle || '').trim(),
        company: (userData.company || '').trim(),
        yearsExperience: (userData.yearsExperience || '').trim(),
        aspiration: '',
        passion: '',
        purpose: '',
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
      setShowIntro(false);
      setShowAssessment(true);
    } catch (error: any) {
      console.error('Error starting digital twin:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Network error. Please check your connection and try again.');
    }
  };

  // Check for enrollment success on mount
  useEffect(() => {
    const enrollmentSuccess = sessionStorage.getItem('enrollmentSuccess');
    const enrolledPlan = sessionStorage.getItem('enrolledPlan');
    
    if (enrollmentSuccess === 'true' && enrolledPlan) {
      setEnrolledPlanName(enrolledPlan);
      setShowEnrollmentConfirmation(true);
      
      // Clear session storage
      sessionStorage.removeItem('enrollmentSuccess');
      sessionStorage.removeItem('enrolledPlan');
    }

    // Check if URL has enrolled=true parameter
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('enrolled') === 'true') {
      console.log('URL has enrolled=true parameter - enrollment modal mode enabled');
    }
  }, [location.search]);

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

  // Download report as PDF
  const downloadReportAsPDF = () => {
    // Get the entire results container
    const element = document.querySelector('.rounded-2xl.p-4.md\\:p-6.mb-4');
    if (!element) {
      toast.error('Report content not found. Please ensure results are loaded.');
      return;
    }

    // Store original expanded state
    const originalExpandedState = { ...expandedInsights };
    
    // Expand all insights before generating PDF
    const allExpanded: { [key: string]: boolean } = {};
    if (scoringResults?.scores) {
      scoringResults.scores.forEach((score: any) => {
        allExpanded[score.dimension] = true;
      });
    }
    setExpandedInsights(allExpanded);

    // Wait for state to update and DOM to re-render
    setTimeout(() => {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Digital-Twin-Career-Report-${assessmentId || 'report'}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false,
          windowWidth: 1200
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      toast.info('Generating PDF... This may take a moment.');
      
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          toast.success('PDF downloaded successfully!');
          // Restore original expanded state
          setExpandedInsights(originalExpandedState);
        })
        .catch((error: any) => {
          console.error('PDF generation error:', error);
          toast.error('Failed to generate PDF. Please try again.');
          // Restore original expanded state even on error
          setExpandedInsights(originalExpandedState);
        });
    }, 500); // Give React time to re-render with expanded content
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

          {/* Contact and LinkedIn fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input 
                type="tel"
                id="contactNo"
                name="contactNo"
                value={userData.contactNo}
                onChange={handleUserDataChange}
                required
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URL</label>
              <input 
                type="url"
                id="linkedInUrl"
                name="linkedInUrl"
                value={userData.linkedInUrl}
                onChange={handleUserDataChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company/Organization/School/College</label>
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
              Begin Assessment
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render the plan selection section (shown first)
  const renderPlanSelectionSection = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative rounded-2xl shadow-lg p-4">
          <div className="absolute inset-0 border-2 border-gray-300 rounded-2xl"></div>
          <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl">🚀</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 leading-normal" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}>
                  Build Your Digital Twin
                </h1>
              </div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                Select the plan that best fits your transformation goals. Complete the assessment after choosing your plan.
              </p>
              <button 
                onClick={() => handlePlanSelection('digital-twin-free')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <span>Start Free Assessment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <DigitalTwinPricingPlans 
          userId={assessmentId} 
          assessmentType="digital-twin-individual"
          onPlanSelect={handlePlanSelection}
        />

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-3xl mx-auto border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">What Happens Next?</h3>
            <ul className="text-left space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="text-2xl">①</span>
                <span className="font-semibold">Select your preferred plan above</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">②</span>
                <span className="font-semibold">Complete the 10-question Digital Twin assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">③</span>
                <span className="font-semibold">Receive your personalized insights and transformation roadmap</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">④</span>
                <span className="font-semibold">Access your selected plan benefits and coaching</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Need a Custom Solution Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-black text-white">Need a custom solution?</h3>
                <p className="text-purple-100 mt-2 leading-relaxed">
                  Our growth specialists can help design a program that fits your exact needs. 
                  Reach out for a free consultation and learn how we can tailor our approach to your unique transformation journey.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right md:pl-4">
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="bg-white text-purple-900 py-3 px-6 rounded-xl hover:bg-purple-50 hover:shadow-xl transition-all font-bold text-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
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
      <div className="min-h-screen flex items-center justify-center px-4 py-4 bg-white">
        <div className="w-full max-w-6xl mx-auto">
          {/* Main Thank You Card - Enhanced */}
          <div className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-2xl p-6 md:p-8 text-white mb-4 relative overflow-hidden border-0`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <p className="text-sm md:text-base font-semibold mb-1 drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                ✓ Responses Saved
              </p>
              <button 
                onClick={() => {
                  const reportSection = document.getElementById('career-snapshot-section');
                  if (reportSection) {
                    reportSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg cursor-pointer underline hover:no-underline transition-all bg-transparent border-none"
                style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}
              >
                View your Digital Twin Career Snapshot! 🚀
              </button>             
            </div>
          </div>
          
          {/* Success/Error Message */}
          {submitError && (
            <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-6 mb-4">
              <p className="text-red-900 text-lg font-bold">⚠️ {submitError}</p>
            </div>
          )}
          
          {/* Digital Twin Pricing Plans Section */}
          <div className="mb-4">
            <DigitalTwinPricingPlans 
              userId={assessmentId} 
              assessmentType="digital-twin-individual"
              onPlanSelect={handlePlanSelection}
              hasCompletedAssessment={true}
            />
          </div>

          {/* Scoring Results Section */}
          {scoringResults ? (
              <div className="rounded-2xl p-4 md:p-6 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h3 id="career-snapshot-section" className="text-3xl font-black text-purple-900">🎯 Your Digital Twin Career Snapshot</h3>
                  <button
                    onClick={downloadReportAsPDF}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Your Digital Twin PDF
                  </button>
                </div>
                
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
                                  {score.dimensionName}
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
                                  <div 
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                      __html: convertMarkdownToHTML(
                                        expandedInsights[score.dimension] 
                                          ? score.description 
                                          : (score.description && score.description.length > 400)
                                            ? `${score.description.substring(0, 400)}...` 
                                            : score.description
                                      )
                                    }}
                                  />
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

          {/* Action Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl transition transform hover:scale-110 shadow-xl border-0 drop-shadow-lg"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.href = '/digital-twin'}
              className="px-10 py-5 bg-white text-indigo-700 font-black text-lg rounded-2xl transition transform hover:scale-110 shadow-xl border-3 border-indigo-600 hover:bg-indigo-50 drop-shadow-lg"
            >
              Retake Assessment
            </button>
          </div>
          
          {/* Need a Custom Solution Section */}
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0">
                  <h3 className="text-2xl md:text-3xl font-black text-white">Need a custom solution?</h3>
                  <p className="text-purple-100 mt-2 leading-relaxed">
                    Our growth specialists can help design a program that fits your exact needs. 
                    Reach out for a free consultation and learn how we can tailor our approach to your unique transformation journey.
                  </p>
                </div>
                <div className="md:w-1/3 md:text-right md:pl-4">
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="bg-white text-purple-900 py-3 px-6 rounded-xl hover:bg-purple-50 hover:shadow-xl transition-all font-bold text-lg"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Information - Enhanced */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-gradient-to-r from-indigo-600 to-pink-600">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-4">
              Your Digital Twin Journey Awaits
            </p>
            <p className="text-gray-700 font-semibold text-lg mb-4">
              We'll reach out to you with your personalized insights and transformation roadmap
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

      {/* Enrollment Confirmation Dialog */}
      {showEnrollmentConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative animate-fadeIn">
            {/* Decorative elements */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl">🎉</span>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-4">
                Enrollment Successful!
              </h2>
              <p className="text-lg text-gray-700 mb-6 font-semibold">
                You have been successfully enrolled in:
              </p>
              
              {/* Enrolled Plan Display */}
              <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 rounded-2xl p-6 mb-6 border-2 border-purple-300">
                <p className="text-2xl font-black text-purple-900">{enrolledPlanName}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
                <div className="flex items-start gap-3 text-left">
                  <span className="text-3xl">💼</span>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2 text-lg">What happens next?</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>✓ Our team will reach out to you</li>
                      <li>✓ We'll share payment details and onboarding instructions</li>
                      <li>✓ Your personalized transformation journey will begin!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                <p className="text-lg font-bold text-green-900 mb-3">
                  Meanwhile, would you like to continue with the FREE Basic Assessment?
                </p>
                <p className="text-sm text-green-700 mb-4">
                  Get immediate insights into your career alignment and discover your Digital Twin profile at no cost!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowEnrollmentConfirmation(false);
                    navigate('/');
                  }}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all"
                >
                  No, Thanks
                </button>
                <button
                  onClick={() => {
                    setShowEnrollmentConfirmation(false);
                    setSelectedPlan('digital-twin-free');
                    setShowPlanSelection(false);
                    setShowIntro(true);
                    window.scrollTo(0, 0);
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  🚀 Yes, Start Free Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {showPlanSelection && renderPlanSelectionSection()}
          {showIntro && renderIntroSection()}
          {showAssessment && renderAssessmentSection()}
          {showResults && renderResultsSection()}
        </>
      )}

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        selectedPlan={enrollmentPlan}
      />
    </div>
  );
};

export default CareerAssessment;

