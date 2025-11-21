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
import { 
  generateSummaryReport,
  calculateScoresByType,
  getRecommendationsByType
} from '../services/assessmentScoringService';
import { Question as AssessmentQuestion, AssessmentScoringResult } from '../types/assessment';
import { AssessmentData } from '../types/assessment';

import professionalQuestions from '../data/survey-questions.json';

// Dynamic assessment import: assessments are loaded based on assessmentType
import RiskNavigatorGauge from '../components/RiskNavigatorGauge';

import DevelopmentCard from '../components/DevelopmentCard';

import ProfileResultsCard from '../components/ProfileResultsCard';

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

const ASSESSMENT_TYPES = {
  STUDENT_9_10: 'student-9-10',
  STUDENT_11_12: 'student-11-12',
  PROFESSIONAL: 'professional'
  // Custom user assessments are loaded dynamically based on username pattern: {username}-advanced
};



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
  dimensionId?: string;
  scoringLogic?: string;
  // gautam assessment fields
  type?: 'multiple-choice' | 'scale' | 'open-ended';
  responseFormat?: 'textarea' | 'short-text' | '1-10';
  followUp?: string;
  topicId?: string;
  // Scenario and reflection fields
  scenario?: string;
  title?: string;
  prompt?: string;
}

// Temporary fallbacks for student question sets (not in use - student assessments removed)
const student910Questions: Question[] = [];
const student1112Questions: Question[] = [];

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  schoolName?: string;
  jobTitle?: string;
  company?: string;
  yearsExperience?: string;
  linkedinUrl?: string;
  linkedinProfileData?: string;
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


// Define the transformProfessionalQuestions function
const transformProfessionalQuestions = (data: any): Question[] => {
  return data.questions.map((q: any) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    dimensionId: q.dimensionId,
    scoringLogic: q.scoringLogic,
  }));
};

// Cluster visual configuration - icons and colors for each cluster
const getClusterVisuals = (clusterKey: string): { icon: string; gradient: string; bgPattern: string } => {
  const clusterNum = (() => {
    const match = /Cluster\s*(\d+)/i.exec(clusterKey);
    return match ? parseInt(match[1], 10) : 0;
  })();

  const visuals: Record<number, { icon: string; gradient: string; bgPattern: string }> = {
    1: { icon: '🎯', gradient: 'from-purple-500 via-pink-500 to-rose-500', bgPattern: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)' },
    2: { icon: '📈', gradient: 'from-blue-500 via-cyan-500 to-teal-500', bgPattern: 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(20, 184, 166, 0.12) 0%, transparent 50%)' },
    3: { icon: '🚀', gradient: 'from-indigo-500 via-purple-500 to-pink-500', bgPattern: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)' },
    4: { icon: '🧘', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', bgPattern: 'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)' },
    5: { icon: '⚡', gradient: 'from-amber-500 via-orange-500 to-red-500', bgPattern: 'radial-gradient(circle at 50% 20%, rgba(251, 191, 36, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)' },
    6: { icon: '💥', gradient: 'from-violet-500 via-fuchsia-500 to-pink-500', bgPattern: 'radial-gradient(circle at 35% 35%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 65% 65%, rgba(217, 70, 239, 0.12) 0%, transparent 50%)' },
    7: { icon: '🏢', gradient: 'from-slate-500 via-gray-500 to-zinc-500', bgPattern: 'radial-gradient(circle at 20% 80%, rgba(100, 116, 139, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(113, 113, 122, 0.12) 0%, transparent 50%)' },
    8: { icon: '💰', gradient: 'from-green-500 via-emerald-500 to-teal-500', bgPattern: 'radial-gradient(circle at 45% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 55% 70%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)' },
    9: { icon: '⚖️', gradient: 'from-sky-500 via-blue-500 to-indigo-500', bgPattern: 'radial-gradient(circle at 30% 60%, rgba(14, 165, 233, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)' },
    10: { icon: '🤝', gradient: 'from-cyan-500 via-blue-500 to-purple-500', bgPattern: 'radial-gradient(circle at 25% 75%, rgba(6, 182, 212, 0.12) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.12) 0%, transparent 50%)' },
    11: { icon: '💻', gradient: 'from-blue-600 via-indigo-600 to-violet-600', bgPattern: 'radial-gradient(circle at 40% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)' },
    12: { icon: '🌈', gradient: 'from-pink-500 via-rose-500 to-red-500', bgPattern: 'radial-gradient(circle at 35% 45%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(circle at 65% 55%, rgba(239, 68, 68, 0.12) 0%, transparent 50%)' },
    13: { icon: '🎖️', gradient: 'from-orange-500 via-red-500 to-pink-500', bgPattern: 'radial-gradient(circle at 50% 30%, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)' },
    14: { icon: '🏠', gradient: 'from-teal-500 via-cyan-500 to-sky-500', bgPattern: 'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)' },
    15: { icon: '🔄', gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500', bgPattern: 'radial-gradient(circle at 40% 60%, rgba(217, 70, 239, 0.12) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)' },
    16: { icon: '🌟', gradient: 'from-yellow-500 via-amber-500 to-orange-500', bgPattern: 'radial-gradient(circle at 25% 50%, rgba(234, 179, 8, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)' },
    17: { icon: '👨‍👩‍👧‍👦', gradient: 'from-lime-500 via-green-500 to-emerald-500', bgPattern: 'radial-gradient(circle at 45% 45%, rgba(132, 204, 22, 0.12) 0%, transparent 50%), radial-gradient(circle at 55% 55%, rgba(16, 185, 129, 0.12) 0%, transparent 50%)' },
    18: { icon: '💼', gradient: 'from-violet-600 via-purple-600 to-fuchsia-600', bgPattern: 'radial-gradient(circle at 35% 60%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(circle at 65% 40%, rgba(192, 38, 211, 0.15) 0%, transparent 50%)' },
    19: { icon: '⚖️', gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', bgPattern: 'radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 60%, rgba(217, 70, 239, 0.12) 0%, transparent 50%)' },
    20: { icon: '🔮', gradient: 'from-indigo-600 via-blue-600 to-cyan-600', bgPattern: 'radial-gradient(circle at 30% 70%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(8, 145, 178, 0.15) 0%, transparent 50%)' },
    21: { icon: '🎨', gradient: 'from-pink-600 via-rose-600 to-red-600', bgPattern: 'radial-gradient(circle at 40% 30%, rgba(219, 39, 119, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)' },
    22: { icon: '✨', gradient: 'from-purple-600 via-indigo-600 to-blue-600', bgPattern: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.10) 25%, transparent 75%)' }
  };

  return visuals[clusterNum] || visuals[1];
};

const CareerAssessment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentType, setAssessmentType] = useState<string>('');
  const [isOrgAssessment, setIsOrgAssessment] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [clusterMode, setClusterMode] = useState<boolean>(false);
  const [currentClusterIndex, setCurrentClusterIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string | number, string | string[]>>({});
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    schoolName: '',
    jobTitle: '',
    company: '',
    yearsExperience: '',
    linkedinUrl: '',
    linkedinProfileData: '',
    aspiration: '',
    passion: '',
    purpose: ''
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showAspirationStep, setShowAspirationStep] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [overallScore, setOverallScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [dimensionScores, setDimensionScores] = useState<any>({});
  const [primaryProfile, setPrimaryProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);
  // Premium gating: AI deep report only after purchase
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  
  // Handle user data input changes
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle answer selection for assessment questions
  const handleAnswerSelect = (questionId: number, optionLetter: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      const currentArray = Array.isArray(current) ? current : [];
      
      if (currentArray.includes(optionLetter)) {
        // Remove if already selected
        return { ...prev, [questionId]: currentArray.filter(opt => opt !== optionLetter) };
      } else {
        // Add to selection
        return { ...prev, [questionId]: [...currentArray, optionLetter] };
      }
    });
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

      // Create FormData to include file upload
      const formData = new FormData();
      formData.append('firstName', userData.firstName.trim());
      formData.append('lastName', userData.lastName.trim());
      formData.append('email', userData.email.trim());
      formData.append('jobTitle', (userData.jobTitle || '').trim());
      formData.append('company', (userData.company || '').trim());
      formData.append('yearsExperience', (userData.yearsExperience || '').trim());
      formData.append('grade', (userData.grade || '').trim());
      formData.append('schoolName', (userData.schoolName || '').trim());
      formData.append('linkedinUrl', (userData.linkedinUrl || '').trim());
      formData.append('linkedinProfileData', (userData.linkedinProfileData || '').trim());
      formData.append('aspiration', (userData.aspiration || '').trim());
      formData.append('passion', (userData.passion || '').trim());
      formData.append('purpose', (userData.purpose || '').trim());
      formData.append('individualType', assessmentType);
      formData.append('category', localStorage.getItem('digitalTwinCategory') || '');
      formData.append('assessmentType', 'digital-twin-individual');
      
      if (profileFile) {
        formData.append('profileUpload', profileFile);
      }

      // Submit user data to backend
      const response = await axios.post(`${API_URL}/assessment/individual`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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

  useEffect(() => {
    // Determine the assessment type from the URL, localStorage, or custom user login
    const category = localStorage.getItem('category') || '';
    const orgAssessment = localStorage.getItem('isOrgAssessment') === 'true' || location.pathname.includes('organization');
    
    // Check if user logged in via custom login (gautam, Varsha, etc.)
    const customUserData = localStorage.getItem('customUser');
    let assessType = '';

    if (customUserData) {
      // Custom user logged in - use their assessment type
      try {
        const user = JSON.parse(customUserData);
        assessType = user.assessmentType;
        console.log('Loaded custom user assessment type:', assessType);
        
        // Pre-fill user data if available
        setUserData(prev => ({
          ...prev,
          firstName: user.fullName.split(' ')[0] || '',
          lastName: user.fullName.split(' ')[1] || '',
          email: user.email || ''
        }));
      } catch (e) {
        console.error('Error parsing custom user data:', e);
        assessType = ASSESSMENT_TYPES.PROFESSIONAL;
      }
    } else if (location.pathname.includes('student-9-10')) {
      assessType = ASSESSMENT_TYPES.STUDENT_9_10;
    } else if (location.pathname.includes('student-11-12')) {
      assessType = ASSESSMENT_TYPES.STUDENT_11_12;
    } else if (location.pathname.includes('professional')) {
      assessType = ASSESSMENT_TYPES.PROFESSIONAL;
    } else if (category.includes('individual-grade-9-10') || category.includes('organization-grade-9-10')) {
      assessType = ASSESSMENT_TYPES.STUDENT_9_10;
    } else if (category.includes('individual-grade-11-12') || category.includes('organization-grade-11-12')) {
      assessType = ASSESSMENT_TYPES.STUDENT_11_12;
    } else if (category.includes('individual-professional') || category.includes('organization-professional')) {
      assessType = ASSESSMENT_TYPES.PROFESSIONAL;
    } else {
      // For URL paths like /gautam, /varsha, /newuser, etc.
      // Extract username from URL and generate assessment type
      const pathMatch = location.pathname.match(/\/([a-z]+)(?:\/|$)/);
      if (pathMatch && pathMatch[1] !== 'pages') {
        const userName = pathMatch[1];
        assessType = `${userName}-advanced`;
      } else {
        // Default to professional assessment
        assessType = ASSESSMENT_TYPES.PROFESSIONAL;
      }
    }

    setIsOrgAssessment(orgAssessment);
    setAssessmentType(assessType);

    // Load appropriate questions based on assessment type
    let questionsData: Question[] = [];
    if (assessType === ASSESSMENT_TYPES.STUDENT_9_10) {
      questionsData = student910Questions as Question[];
    } else if (assessType === ASSESSMENT_TYPES.STUDENT_11_12) {
      questionsData = student1112Questions as Question[];
    } else if (assessType === ASSESSMENT_TYPES.PROFESSIONAL) {
      questionsData = transformProfessionalQuestions(professionalQuestions);
    } else {
      // For custom user assessments
      // Dynamically load the assessment JSON file
      try {
        // Extract username from assessmentType (e.g., 'gautam-advanced' -> 'gautam')
        const userNameMatch = assessType.match(/^([a-z]+)-advanced$/);
        if (userNameMatch) {
          const userName = userNameMatch[1];
          // Dynamically require: e.g., gautam-assessment.json, varsha-assessment.json
          // This works with webpack bundling
          const customAssessment = require(`../data/${userName}-assessment.json`);
          questionsData = [
            ...customAssessment.questions,
            ...(customAssessment.scenarioQuestions || []),
            ...(customAssessment.reflectionPrompts || [])
          ] as Question[];
        }
      } catch (error) {
        console.error(`Failed to load assessment for type: ${assessType}`, error);
        // Fall back to professional assessment
        questionsData = transformProfessionalQuestions(professionalQuestions);
      }
    }
    setQuestions(questionsData);
    // Disable cluster mode for User specific assessments (questions are not in clusters)
    setClusterMode(!orgAssessment && assessType === ASSESSMENT_TYPES.PROFESSIONAL);
    setIsLoading(false);
  }, [location.pathname]);

  // Initialize and persist premium unlock (dev toggle + persistence)
  useEffect(() => {
    // Load persisted premium flag
    try {
      const saved = localStorage.getItem('premiumUnlocked');
      if (saved === 'true') {
        setPremiumUnlocked(true);
      }
    } catch (e) {
      console.error('Could not read premiumUnlocked from localStorage:', e);
    }

    // Dev unlock via query param: ?unlockPremium=1
    try {
      const params = new URLSearchParams(location.search);
      if (params.get('unlockPremium') === '1') {
        setPremiumUnlocked(true);
        // If results are already visible and we have an ID, generate immediately
        if (assessmentId && showResults) {
          generateAIReport(assessmentId);
        }
      }
    } catch (e) {
      console.error('Error parsing query params for premium unlock:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, assessmentId, showResults]);

  useEffect(() => {
    // Persist premium flag
    try {
      localStorage.setItem('premiumUnlocked', premiumUnlocked ? 'true' : 'false');
    } catch (e) {
      console.error('Could not persist premiumUnlocked to localStorage:', e);
    }
  }, [premiumUnlocked]);

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
  // Cluster navigation handlers
  const handleNextCluster = () => {
    if (currentClusterIndex < clusterKeys.length - 1) {
      setCurrentClusterIndex(currentClusterIndex + 1);
      window.scrollTo(0, 0);
    } else {
      showAssessmentResults();
    }
  };
  const handlePrevCluster = () => {
    if (currentClusterIndex > 0) {
      setCurrentClusterIndex(currentClusterIndex - 1);
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
          linkedinUrl: userData.linkedinUrl,
          ...(assessmentType.includes('student') ? {
            grade: userData.grade,
            schoolName: userData.schoolName
          } : {
            jobTitle: userData.jobTitle,
            company: userData.company,
            yearsExperience: userData.yearsExperience
          })
        },
        isOrgAssessment
      };

      // Determine the correct endpoint based on assessment type
      const assessmentEndpoint = isOrgAssessment ? 'organization' : 'individual';

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
          linkedinUrl: userData.linkedinUrl,
          ...(assessmentType.includes('student') ? {
            grade: userData.grade,
            schoolName: userData.schoolName
          } : {
            jobTitle: userData.jobTitle,
            company: userData.company,
            yearsExperience: userData.yearsExperience
          })
        },
        isOrgAssessment
      };
      
      // Determine the correct endpoint based on assessment type
      const assessmentEndpoint = isOrgAssessment ? 'organization' : 'individual';
      
      console.log(`Making PUT request to /assessment/${assessmentEndpoint}/${assessmentId}`);
      
      // Add timeout to axios request to prevent long hanging requests
      const response = await axios.put(
        `${API_URL}/assessment/${assessmentEndpoint}/${assessmentId}`, 
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
      
      // Prepare the response data with just the answers
      const responseData = {
        answers: answers,
        completedAt: new Date().toISOString(),
        assessmentType: assessmentType
      };
      
      // Submit to server
      if (assessmentId) {
        console.log('Submitting assessment answers:', responseData);
        
        try {
          const result = await submitCompletedAssessment(assessmentId, responseData);
          
          if (result) {
            toast.success('Thank you for completing the assessment!');
          } else {
            console.error('Failed to save assessment');
            setSubmitError('Assessment submission failed. Please try again.');
          }
        } catch (submissionError) {
          console.error('Error submitting assessment:', submissionError);
          setSubmitError('Assessment submission failed. Please try again.');
        }
      } else {
        console.log('No assessment ID available');
        setSubmitError('Assessment submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing assessment:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      // Show thank you page
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
      console.log('Assessment type:', isOrgAssessment ? 'organization' : 'individual');
      
      const response = await axios.post(
        `${API_URL}/assessment/generate-report/${id}`,
        { type: isOrgAssessment ? 'organization' : 'individual' },
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

  // Calculate category scores
  const calculateCategoryScores = useCallback(() => {
    // Group by category, use max score per question, never exceed 100%
    const categoryScoresRaw: Record<string, { raw: number; max: number }> = {};
    const questionScores: Record<number, number> = {};

    questions.forEach(question => {
      const answer = answers[question.id];
      if (!answer || !question.options) return; // Skip if no answer or no options (gautam questions)
      const cat = question.category;
      if (!categoryScoresRaw[cat]) categoryScoresRaw[cat] = { raw: 0, max: 0 };
      // Find selected option
      const selectedOption = question.options.find(opt => opt.option === answer);
      const score = selectedOption && typeof selectedOption.score === 'number' ? selectedOption.score : 0;
      questionScores[question.id] = score;
      categoryScoresRaw[cat].raw += score;
      // Max for this question is the highest score among its options
      const maxForQ = question.options ? Math.max(...question.options.map(opt => typeof opt.score === 'number' ? opt.score : 0)) : 0;
      categoryScoresRaw[cat].max += maxForQ;
    });

    // Store question scores in localStorage for reference
    try {
      localStorage.setItem('assessment-question-scores', JSON.stringify(questionScores));
    } catch (err) {
      console.error('Could not store question scores:', err);
    }

    // Calculate category percentages (0-100, never above 100)
    const categoryScores: Record<string, number> = {};
    Object.keys(categoryScoresRaw).forEach(cat => {
      const { raw, max } = categoryScoresRaw[cat];
      categoryScores[cat] = max > 0 ? Math.round((raw / max) * 100) : 0;
    });
    return categoryScores;
  }, [questions, answers]);

  // Calculate overall score
  const calculateOverallScore = useCallback((categoryScores: Record<string, number>) => {
    const categoryValues = Object.values(categoryScores);
    if (categoryValues.length === 0) return 0;
    
    const sum = categoryValues.reduce((total, score) => total + score, 0);
    return Math.round(sum / categoryValues.length);
  }, []);

  // Build clusters (category groups) for professional assessment
  const clusters = useMemo(() => {
    if (!clusterMode) return {} as Record<string, Question[]>;
    const byCategory: Record<string, Question[]> = {};
    (questions || []).forEach(q => {
      if (!byCategory[q.category]) byCategory[q.category] = [];
      byCategory[q.category].push(q);
    });
    // Ensure each cluster's questions are sorted by id
    Object.keys(byCategory).forEach(cat => {
      byCategory[cat].sort((a, b) => a.id - b.id);
    });
    return byCategory;
  }, [clusterMode, questions]);
  const clusterKeys = useMemo(() => clusterMode ? Object.keys(clusters) : [], [clusterMode, clusters]);
  // Progress percentage for the assessment (question-mode baseline)
  const progressRaw = (currentQuestionIndex / (questions.length - 1)) * 100;
  const questionProgressPercentage = Number.isFinite(progressRaw) ? Math.round(progressRaw) : 0;
  // In cluster mode, progress is based on clusters
  const clusterProgress = useMemo(() => {
    if (!clusterMode) return 0;
    const total = Math.max(1, clusterKeys.length - 1);
    const raw = (currentClusterIndex / total) * 100;
    return Number.isFinite(raw) ? Math.round(raw) : 0;
  }, [clusterMode, clusterKeys.length, currentClusterIndex]);
  const progressPercentage = clusterMode ? clusterProgress : questionProgressPercentage;

  // Render the introduction section
  const renderIntroSection = () => {
    const isCustomUserAssessment = assessmentType && assessmentType.endsWith('-advanced') && !assessmentType.includes('student');
    const isgautam = assessmentType === 'gautam-advanced'; // For specific gautam messaging
    
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">
          {isgautam ? (
            'Gautam Ganglani\'s Transformation Digital Twin'
          ) : isOrgAssessment ? (
            assessmentType.includes('9-10')
              ? '9-10 Grade Student Organization Assessment'
              : assessmentType.includes('11-12')
              ? '11-12 Grade Student Organization Assessment'
              : 'Professional Organization Assessment'
          ) : (
            assessmentType.includes('9-10')
              ? '9-10 Grade Student Assessment Information'
              : assessmentType.includes('11-12')
              ? '11-12 Grade Student Assessment Information'
              : 'Professional Career Assessment Information'
          )}
        </h2>
        
        {isgautam && (
          <p className="text-lg text-purple-600 font-semibold mb-6">
            Personal Transformation & Ecosystem Design
          </p>
        )}
        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {isgautam ? (
              'This comprehensive 45-question assessment is designed specifically to map your transformation journey across 22 dimensions of leadership, legacy, and personal evolution. Through open-ended questions, complex scenarios, and deep reflection prompts, we will create a detailed blueprint for your Right Selection 3.0 ecosystem.'
            ) : isOrgAssessment ? (
              assessmentType.includes('student')
                ? 'This assessment will help you understand student college and career readiness across your organization and provide strategic recommendations.'
                : 'This assessment will evaluate career readiness across your organization and provide tailored strategic recommendations for organizational growth.'
            ) : (
              assessmentType.includes('student')
                ? 'This assessment will help you understand your college and career readiness and provide personalized recommendations.'
                : 'This assessment will evaluate your career readiness across key dimensions and provide tailored recommendations for your professional growth.'
            )}
          </p>
          
          <div className={`${isgautam ? 'bg-purple-50 border-purple-500' : 'bg-blue-50 border-blue-500'} border-l-4 p-4 mb-4`}>
            <h3 className={`text-lg font-semibold ${isgautam ? 'text-purple-800' : 'text-blue-800'} mb-2`}>What to expect</h3>
            <ul className={`list-disc list-inside ${isgautam ? 'text-purple-700' : 'text-blue-700'} space-y-1`}>
              {isgautam ? (
                <>
                  <li>The assessment contains {questions.length} thoughtful questions covering 22 topical dimensions of transformation.</li>
                  <li>The journey takes approximately 25-30 minutes and includes 5 complex decision scenarios and 5 deep reflection prompts.</li>
                  <li>Your responses will generate a personalized Digital Transformation Blueprint tailored to your vision.</li>
                  <li>The blueprint will include ecosystem design recommendations for your Right Selection 3.0 model and a 12-month action roadmap.</li>
                  <li>All responses are confidential and will be used exclusively to create your personalized transformation insights.</li>
                </>
              ) : (
                <>
                  <li>The assessment contains {questions.length} questions and takes about {isOrgAssessment ? '15-20' : '10-15'} minutes to complete.</li>
                  <li>Your responses are confidential and will be used to generate {isOrgAssessment ? 'organizational insights' : 'personalized insights'}.</li>
                  <li>You'll receive immediate results with actionable recommendations{isOrgAssessment ? ' for your organization' : ''}.</li>
                  {isOrgAssessment && <li>You can use these results to develop targeted improvement strategies across your organization.</li>}
                </>
              )}
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
          
          {/* For gautam assessment, we can skip organizational fields and go straight to optional LinkedIn profile */}
          {!isgautam && isOrgAssessment ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input 
                    type="text"
                    id="company"
                    name="company"
                    value={userData.company}
                    onChange={handleUserDataChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Your Role/Position</label>
                  <input 
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={userData.jobTitle}
                    onChange={handleUserDataChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {assessmentType.includes('student') ? (
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">School/Institution Name</label>
                  <input 
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={userData.schoolName}
                    onChange={handleUserDataChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">Organization Size</label>
                  <select
                    id="yearsExperience"
                    name="yearsExperience"
                    value={userData.yearsExperience}
                    onChange={(e) => setUserData({...userData, yearsExperience: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            assessmentType.includes('student') ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Current Grade</label>
                    <select
                      id="grade"
                      name="grade"
                      value={userData.grade}
                      onChange={(e) => setUserData({...userData, grade: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {assessmentType.includes('9-10') ? (
                        <>
                          <option value="9">Grade 9</option>
                          <option value="10">Grade 10</option>
                        </>
                      ) : (
                        <>
                          <option value="11">Grade 11</option>
                          <option value="12">Grade 12</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input 
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={userData.schoolName}
                      onChange={handleUserDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )
          )}
          
          <div className="border-t border-purple-200 pt-6 mt-6 hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional: Enhanced Digital Twin Profile</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URL</label>
                <input 
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={userData.linkedinUrl}
                  onChange={handleUserDataChange}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="linkedinProfileData" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile Details (Optional - For Personalized AI Report)
                  <span className="ml-2 text-xs text-gray-500 font-normal">Paste your LinkedIn headline, about section, experience, and recent posts here</span>
                </label>
                <textarea
                  id="linkedinProfileData"
                  name="linkedinProfileData"
                  value={userData.linkedinProfileData || ''}
                  onChange={handleUserDataChange}
                  rows={6}
                  placeholder="Example:&#10;Headline: AI Product Manager | Building the future of education tech&#10;&#10;About: Passionate about leveraging AI to transform learning experiences...&#10;&#10;Experience: Product Manager at EdTech Co (2022-Present) - Led AI integration...&#10;&#10;Recent Post: Excited to share insights on AI in education..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
                />
                <p className="mt-2 text-xs text-gray-500">
                  💡 <strong>Pro tip:</strong> The more details you provide (headline, about section, work experience, posts), the more personalized your AI-powered Digital Twin report will be!
                </p>
              </div>
              
              <div>
                <label htmlFor="profileUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume/Profile (PDF)</label>
                <input 
                  type="file"
                  id="profileUpload"
                  name="profileUpload"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {profileFile && <p className="mt-1 text-sm text-gray-600">Selected: {profileFile.name}</p>}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
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

    // Cluster-mode rendering: show both questions from the current cluster together
    if (clusterMode && clusterKeys.length > 0) {
      const clusterKey = clusterKeys[currentClusterIndex];
      const clusterQuestions = clusters[clusterKey] || [];
      // Compute cluster completion: all questions in this cluster must be answered
      const clusterComplete = clusterQuestions.every(q => !!answers[q.id]);
      const clusterIndexLabel = (() => {
        const match = /Cluster\s*(\d+)/i.exec(clusterKey);
        return match ? parseInt(match[1], 10) : currentClusterIndex + 1;
      })();
      // Extract category name from clusterKey (remove "Cluster X" part)
      const categoryName = clusterKey.replace(/:\s*Cluster\s*\d+/i, '').trim();
      // Calculate current question position in cluster
      const totalQuestionsInCluster = clusterQuestions.length;
      const answeredQuestionsInCluster = clusterQuestions.filter(q => !!answers[q.id]).length;
      const currentQuestionInCluster = Math.min(answeredQuestionsInCluster + 1, totalQuestionsInCluster);
      
      const clusterVisuals = getClusterVisuals(clusterKey);
      return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Large Hero Banner with Integrated Design */}
          <div className={`relative h-72 bg-gradient-to-br ${clusterVisuals.gradient} overflow-hidden`}>
            {/* Decorative Background Elements */}
            <div className="absolute inset-0">
              {/* Gradient Orbs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-xl"></div>
            </div>
            
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>

            {/* Main Content Container */}
            <div className="relative h-full flex items-center justify-between px-12 py-8">
              {/* Left Side: Text Content */}
              <div className="flex-1 max-w-2xl">
                {/* Section Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-4 border border-white/30 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-bold tracking-wider uppercase">
                    Section {clusterIndexLabel} of 22
                  </span>
                </div>

                {/* Category Title */}
                <h2 className="text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                  {categoryName}
                </h2>

                {/* Progress Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 bg-white/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${(currentQuestionInCluster / totalQuestionsInCluster) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white/90 text-sm font-semibold">
                      Question {currentQuestionInCluster} of {totalQuestionsInCluster}
                    </span>
                  </div>
                </div>

                {/* Assessment Type Badge - Hidden for now */}
                {/* <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
                    Professional Career Assessment
                  </span>
                </div> */}
              </div>

              {/* Right Side: Giant Icon with Effects */}
              <div className="flex-shrink-0 relative">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-125 animate-pulse"></div>
                
                {/* Main Icon Container */}
                <div className="relative">
                  {/* Icon Background Card */}
                  <div className="w-56 h-56 bg-white/15 backdrop-blur-xl rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <span className="text-9xl drop-shadow-2xl">{clusterVisuals.icon}</span>
                  </div>
                  
                  {/* Decorative Corner Accents */}
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full border-3 border-white/40 shadow-lg"></div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border-3 border-white/40 shadow-lg"></div>
                  
                  {/* Floating Particles Effect */}
                  <div className="absolute top-1/4 -left-6 w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                  <div className="absolute top-1/2 -right-4 w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
                  <div className="absolute bottom-1/4 -left-4 w-2.5 h-2.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
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

          {/* Content Area with Better Spacing */}
          <div className="px-12 pt-6 pb-12">
            {/* Overall Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Overall Assessment Progress</span>
                <span className="text-sm font-black text-gray-900">{Math.round((currentQuestionInCluster / totalQuestionsInCluster) * 100)}% of Section Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className={`h-full bg-gradient-to-r ${clusterVisuals.gradient} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
                  style={{ width: `${(currentQuestionInCluster / totalQuestionsInCluster) * 100}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

          {/* Render all questions in this cluster */}
          <div className="space-y-6 relative z-10">
            {clusterQuestions.map((q, qIndex) => (
              <div key={q.id} className="space-y-3">
                <div className="relative border border-gray-200 rounded-xl p-6 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-5 relative z-10">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${clusterVisuals.gradient} flex items-center justify-center text-white font-black text-base shadow-md`}>
                      {qIndex + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{q.category}</div>
                      <div className="text-xl font-bold text-gray-900 leading-relaxed">{q.question}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options && q.options.map((option, index) => {
                      const optionLetter = option.option === 'other' ? 'other' : String.fromCharCode(97 + index);
                      const selectedOptions = Array.isArray(answers[q.id]) ? answers[q.id] as string[] : [];
                      const isSelected = selectedOptions.includes(optionLetter);
                      return (
                        <div 
                          key={index}
                          onClick={() => handleAnswerSelect(q.id, optionLetter)}
                          className={`group p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 h-full ${
                            isSelected 
                              ? `border-transparent bg-gradient-to-br ${clusterVisuals.gradient} shadow-lg` 
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start h-full">
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all ${
                              isSelected 
                                ? 'bg-white/30 backdrop-blur-sm ring-2 ring-white/50' 
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <span className={`text-xs font-bold ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`}>
                                {optionLetter === 'other' ? '✎' : optionLetter.toUpperCase()}
                              </span>
                            </div>
                            <span className={`text-sm leading-relaxed ${
                              isSelected ? 'text-white font-medium' : 'text-gray-800 group-hover:text-gray-900'
                            }`}>{option.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes('other') && (
                  <textarea
                    value={(answers as Record<string, any>)[`${q.id}-other-text`] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [`${q.id}-other-text`]: e.target.value }))}
                    placeholder="Please specify..."
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-8 border-t-2 border-gray-200 mt-10 relative z-10">
            <div className="flex gap-2">
              <button
                onClick={handlePrevCluster}
                disabled={currentClusterIndex === 0}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentClusterIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md'
                }`}
              >
                ← Previous Section
              </button>
              <button
                onClick={saveAssessmentProgress}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md hidden"
              >
                💾 Save Progress
              </button>
            </div>
            <button
              onClick={handleNextCluster}
              disabled={!clusterComplete}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                !clusterComplete 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : `bg-gradient-to-r ${clusterVisuals.gradient} text-white hover:shadow-xl hover:scale-105 transform`
              }`}
            >
              {currentClusterIndex === clusterKeys.length - 1 ? 'Finish Assessment ✔️' : 'Next Section →'}
            </button>
          </div>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    // Determine if this is an open-ended question (for gautam assessment)
    const isOpenEnded = currentQuestion.type === 'open-ended' || currentQuestion.responseFormat === 'textarea' || currentQuestion.responseFormat === 'short-text';
    const isScaleQuestion = currentQuestion.type === 'scale' && currentQuestion.responseFormat === '1-10';
    const isMultipleChoice = currentQuestion.type === 'multiple-choice' || currentQuestion.options;

    // Get cluster visuals for styling consistency
    const questionCluster = currentQuestion.category || '';
    const clusterVisuals = getClusterVisuals(questionCluster);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm font-black text-gray-900">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full bg-gradient-to-r ${clusterVisuals.gradient} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Question category */}
        <div className={`inline-block px-4 py-1 bg-gradient-to-r ${clusterVisuals.gradient} text-white rounded-full text-xs font-bold mb-4 uppercase tracking-wider shadow-md`}>
          {currentQuestion.category}
        </div>
        
        {/* Question title (for scenarios/reflections) */}
        {currentQuestion.title && (
          <h2 className="text-xl font-black text-gray-900 mb-3">
            {currentQuestion.title}
          </h2>
        )}
        
        {/* Question text */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question || currentQuestion.prompt}
        </h3>
        
        {/* Scenario description (if present) */}
        {currentQuestion.scenario && (
          <div className="bg-gray-50 border-l-4 border-purple-500 p-5 mb-6 rounded-lg shadow-sm">
            <p className="text-gray-800 italic leading-relaxed">
              <strong className="text-gray-900">Scenario:</strong> {currentQuestion.scenario}
            </p>
          </div>
        )}
        
        {/* Response input - Multiple choice or Open-ended */}
        <div className="mb-8">
          {isOpenEnded ? (
            // Open-ended text response
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              placeholder={currentQuestion.type === 'open-ended' ? 'Share your thoughts, experience, or insights...' : 'Enter your response...'}
              rows={currentQuestion.responseFormat === 'textarea' ? 7 : 4}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans text-base leading-relaxed"
            />
          ) : isScaleQuestion ? (
            // 1-10 scale question
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-wide px-1">
                <span>1 (Not at all)</span>
                <span>10 (Extremely)</span>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: num.toString() }))}
                    className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 text-sm shadow-md hover:shadow-lg ${
                      answers[currentQuestion.id] === num.toString()
                        ? `bg-gradient-to-r ${clusterVisuals.gradient} text-white ring-2 ring-offset-2 ring-purple-400`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ) : isMultipleChoice ? (
            // Multiple choice options
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options && currentQuestion.options.map((option, index) => {
                  const optionLetter = option.option === 'other' ? 'other' : String.fromCharCode(97 + index);
                  const selectedOptions = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] as string[] : [];
                  const isSelected = selectedOptions.includes(optionLetter);
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                      className={`group p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 h-full shadow-md hover:shadow-lg ${
                        isSelected 
                          ? `border-transparent bg-gradient-to-br ${clusterVisuals.gradient}` 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start h-full">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all font-bold text-sm ${
                          isSelected 
                            ? 'bg-white/30 backdrop-blur-sm ring-2 ring-white/50 text-white' 
                            : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                        }`}>
                          {optionLetter === 'other' ? '✎' : optionLetter.toUpperCase()}
                        </div>
                        <span className={`text-sm leading-relaxed font-medium ${
                          isSelected ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'
                        }`}>{option.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).includes('other') && (
                <textarea
                  value={(answers as Record<string, any>)[`${currentQuestion.id}-other-text`] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [`${currentQuestion.id}-other-text`]: e.target.value }))}
                  placeholder="Please specify..."
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              )}
            </div>
          ) : null}
        </div>
        
        {/* Follow-up note (if present) */}
        {currentQuestion.followUp && (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-lg">
            <p className="text-sm text-purple-800 leading-relaxed">
              <strong className="text-purple-900">Follow-up:</strong> {currentQuestion.followUp}
            </p>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t-2 border-gray-200 gap-4">
          <div className="flex gap-2">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md'}`}
            >
              ← Previous
            </button>
            <button
              onClick={saveAssessmentProgress}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md"
            >
              💾 Save Progress
            </button>
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestion.id]}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${!answers[currentQuestion.id] ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : `bg-gradient-to-r ${clusterVisuals.gradient} text-white hover:shadow-lg`}`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish ✔️' : 'Next →'}
          </button>
        </div>
      </div>
    );
  };
  // PDF download handler
  const handleDownloadPDF = () => {
    // Dismiss any toasts to avoid overlay in PDF
    toast.dismiss();
    const element = document.getElementById('assessment-results-section');
    if (element) {
      html2pdf().from(element).set({
        margin: [0.75, 0.5, 0.75, 0.5], // top, right, bottom, left (inches)
        filename: 'career-assessment-report.pdf',
        html2canvas: { scale: 2, useCORS: true },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }).save();
    } else {
      toast.error('Could not find results section to export.');
    }
  };

  // Render the results section - ENHANCED thank you page with gradient styling
  const renderResultsSection = () => {
    const gradient = assessmentType === 'gautam-advanced' 
      ? 'from-purple-600 via-pink-500 to-rose-500'
      : 'from-indigo-600 via-purple-600 to-pink-600';
    
    const totalQuestions = Object.keys(answers).length;
    
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-3xl w-full">
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
              <p className="text-lg font-semibold drop-shadow-lg opacity-95" style={{textShadow: '0 2px 6px rgba(0,0,0,0.3)'}}>
                Your insights have been securely saved and will guide your transformation journey
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
                <p className="text-emerald-800 text-sm font-semibold mt-2">
                  Our AI team will analyze your insights within 24 hours
                </p>
              </div>
            )}

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-200">
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
  // Main return statement
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

