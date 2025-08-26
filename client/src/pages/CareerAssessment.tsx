import React, { useEffect, useState, useCallback } from 'react';
// For PDF export
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
// Import with type assertion for student 9-10 questions
import student910QuestionsRaw from '../data/student-9-10-questions.json';
import { Question as AssessmentQuestion, AssessmentScoringResult } from '../types/assessment';
import { AssessmentData } from '../types/assessment';
import student1112Questions from '../data/student-11-12-questions.json';
import professionalQuestions from '../data/professional-questions.json';
import RiskNavigatorGauge from '../components/RiskNavigatorGauge';
import StrengthsCard from '../components/StrengthsCard';
import DevelopmentCard from '../components/DevelopmentCard';
import TieredPlans from '../components/TieredPlans';
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
  options: Option[];
  dimensionId: string;
  scoringLogic?: string;
}
// ...existing code...
const student910Questions = (student910QuestionsRaw as AssessmentData).questions;

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
}



const CareerAssessment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentType, setAssessmentType] = useState<string>('');
  const [isOrgAssessment, setIsOrgAssessment] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    schoolName: '',
    jobTitle: '',
    company: '',
    yearsExperience: '',
    linkedinUrl: ''
  });
  const [showIntro, setShowIntro] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [overallScore, setOverallScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [dimensionScores, setDimensionScores] = useState<any>({});
  const [primaryProfile, setPrimaryProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  // Handle user data input changes
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle answer selection for assessment questions
  const handleAnswerSelect = (questionId: number, optionLetter: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
  };

  // Handle starting the assessment (move from intro to assessment)
  const handleStartAssessment = async () => {
    try {
      const mockAssessmentId = `mock-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      setAssessmentId(mockAssessmentId);
      toast.success('Assessment started successfully!');
      setShowIntro(false);
      setShowAssessment(true);
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast.error('Network error. Please check your connection and try again.');
      const mockAssessmentId = `mock-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      setAssessmentId(mockAssessmentId);
      setShowIntro(false);
      setShowAssessment(true);
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
    // Determine the assessment type from the URL or localStorage
    const category = localStorage.getItem('category') || '';
    const orgAssessment = localStorage.getItem('isOrgAssessment') === 'true' || location.pathname.includes('organization');
    let assessType = '';

    if (location.pathname.includes('student-9-10')) {
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
      // Default to professional assessment
      assessType = ASSESSMENT_TYPES.PROFESSIONAL;
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
      questionsData = professionalQuestions as Question[];
    }
    setQuestions(questionsData);
    setIsLoading(false);
  }, [location.pathname]);

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // End of assessment
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
  // Submit the completed assessment to the database
  const submitCompletedAssessment = async (assessmentId: string, responseData: any) => {
    try {
      // For mock IDs, just simulate a successful save since we know the backend isn't fully implemented
      if (assessmentId.startsWith('mock-')) {
        console.log('Mock ID detected, simulating successful assessment save');
        // Save to local storage as a backup
        try {
          localStorage.setItem(`assessment-${assessmentId}`, JSON.stringify({
            responseData,
            timestamp: new Date().toISOString(),
            userData: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email
            },
            isOrgAssessment
          }));
          console.log('Assessment data saved to local storage as fallback');
        } catch (localStorageError) {
          console.error('Could not save to local storage:', localStorageError);
        }
        return true;
      }

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
      
      // Add timeout to axios request to prevent long hanging requests
      const response = await axios.put(
        `${API_URL}/assessment/${assessmentEndpoint}/${assessmentId}`, 
        { responseData: enhancedResponseData },
        { timeout: 8000 } // 8 second timeout
      );
      
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
      // setIsSubmitting(true); // removed unused state
      setSubmitError('');
      
  // Calculate the scores using normalized (0-100) scale
  const categoryScores = calculateCategoryScores();
  const overallScore = calculateOverallScore(categoryScores); // This is now 0-100

  setCategoryScores(categoryScores);
  setOverallScore(overallScore);
      
      // 2. Enhanced scoring using assessment scoring service
      let advancedScoring: AssessmentScoringResult | null = null;
      let scoringRecommendations = [];
      let scoringSummary = null;
      
      try {
        // Attempt to use enhanced scoring for any assessment type
        console.log('Attempting enhanced scoring for assessment type:', assessmentType);
        advancedScoring = calculateScoresByType(assessmentType, answers) as AssessmentScoringResult;
        
        if (!advancedScoring || advancedScoring.error) {
          console.log('Enhanced scoring not available, falling back to basic scoring:', 
            advancedScoring?.error || 'No scoring implementation');
        } else {
          // Enhanced scoring succeeded
          scoringRecommendations = getRecommendationsByType(assessmentType, advancedScoring);
          scoringSummary = generateSummaryReport(advancedScoring);
          
          // Set state with the advanced scoring results
          setDimensionScores(advancedScoring.dimensionScores || {});
          setPrimaryProfile(advancedScoring.primaryProfile || null);
          setRecommendations(scoringRecommendations || []);
           // setSummaryReport(scoringSummary || null); // removed unused state
          
          console.log('Enhanced scoring results:', advancedScoring);
          console.log('Recommendations:', scoringRecommendations);
          console.log('Summary report:', scoringSummary);
        }
      } catch (scoringError) {
        console.error('Error applying advanced scoring:', scoringError);
        // Continue with basic scoring if advanced scoring fails
      }
      
      // Get stored question scores if available
      let questionScores = {};
      try {
        questionScores = JSON.parse(localStorage.getItem('assessment-question-scores') || '{}');
      } catch (e) {
        console.error('Could not retrieve stored question scores:', e);
      }

      // Prepare the response data - unified for all assessment types
      const responseData = {
        answers: answers,
        questionScores: questionScores, // Include individual question scores
        categories: categoryScores,
        overallScore: overallScore,
        completedAt: new Date().toISOString(),
        assessmentType: assessmentType,
        // Include advanced scoring results if available
        ...(advancedScoring && !(advancedScoring as any).error ? {
          dimensionScores: (advancedScoring as any).dimensionScores,
          primaryProfile: (advancedScoring as any).primaryProfile,
          recommendations: scoringRecommendations,
          summaryReport: scoringSummary
        } : {})
      };
      
      // Only submit to server if we have a valid assessment ID
      if (assessmentId) {
        console.log('Submitting assessment answers:', responseData);
        
        // Try to save assessment data
        try {
          const result = await submitCompletedAssessment(assessmentId, responseData);
          
          if (result) {
            // setIsAssessmentSaved(true); // removed unused state
            toast.success('Your assessment has been successfully saved!');
          } else {
            // Even if the API call fails, we'll show results from local calculations
            toast.info('Your assessment results are available below, but could not be saved to our server.');
            setSubmitError('Your results are available below. You may want to save or screenshot this page for your records.');
          }
        } catch (submissionError) {
          console.error('Error in submission process:', submissionError);
          toast.info('Your assessment results are available below, but could not be saved to our server.');
          setSubmitError('Your results are available below. You may want to save or screenshot this page for your records.');
        }
      } else {
        console.log('No assessment ID available, answers will not be stored in database');
        setSubmitError('Your results are available below. You may want to save or screenshot this page for your records.');
      }
      
      // setIsSubmitting(false); // removed unused state
    } catch (error) {
      console.error('Error processing assessment answers:', error);
      // setIsSubmitting(false); // removed unused state
      setSubmitError('Your results are available below. You may want to save or screenshot this page for your records.');
    } finally {
      // Show results section regardless of server submission success
      setShowAssessment(false);
      setShowResults(true);
      window.scrollTo(0, 0);
    }
  };

  // Calculate category scores
  const calculateCategoryScores = useCallback(() => {
    // Group by category, use max score per question, never exceed 100%
    const categoryScoresRaw: Record<string, { raw: number; max: number }> = {};
    const questionScores: Record<number, number> = {};

    questions.forEach(question => {
      const answer = answers[question.id];
      if (!answer) return;
      const cat = question.category;
      if (!categoryScoresRaw[cat]) categoryScoresRaw[cat] = { raw: 0, max: 0 };
      // Find selected option
      const selectedOption = question.options.find(opt => opt.option === answer);
      const score = selectedOption && typeof selectedOption.score === 'number' ? selectedOption.score : 0;
      questionScores[question.id] = score;
      categoryScoresRaw[cat].raw += score;
      // Max for this question is the highest score among its options
      const maxForQ = Math.max(...question.options.map(opt => typeof opt.score === 'number' ? opt.score : 0));
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

  // Progress percentage for the assessment
  const progressRaw = (currentQuestionIndex / (questions.length - 1)) * 100;
  const progressPercentage = Number.isFinite(progressRaw) ? Number(progressRaw.toFixed(2)) : 0;

  // Render the introduction section
  const renderIntroSection = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">
          {isOrgAssessment ? (
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
        
        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {isOrgAssessment ? (
              assessmentType.includes('student')
                ? 'This assessment will help you understand student college and career readiness across your organization and provide strategic recommendations.'
                : 'This assessment will evaluate career readiness across your organization and provide tailored strategic recommendations for organizational growth.'
            ) : (
              assessmentType.includes('student')
                ? 'This assessment will help you understand your college and career readiness and provide personalized recommendations.'
                : 'This assessment will evaluate your career readiness across key dimensions and provide tailored recommendations for your professional growth.'
            )}
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">What to expect</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>The assessment contains {questions.length} questions and takes about {isOrgAssessment ? '15-20' : '10-15'} minutes to complete.</li>
              <li>Your responses are confidential and will be used to generate {isOrgAssessment ? 'organizational insights' : 'personalized insights'}.</li>
              <li>You'll receive immediate results with actionable recommendations{isOrgAssessment ? ' for your organization' : ''}.</li>
              {isOrgAssessment && <li>You can use these results to develop targeted improvement strategies across your organization.</li>}
            </ul>
          </div>
        </div>
        
        <form className="space-y-6">
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
          
          {isOrgAssessment ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                  <input 
                    type="text"
                    id="company"
                    name="company"
                    value={userData.company}
                    onChange={handleUserDataChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Your Role/Position *</label>
                  <input 
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={userData.jobTitle}
                    onChange={handleUserDataChange}
                    required
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
          
          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleStartAssessment}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {isOrgAssessment ? 'Start Organization Assessment' : 'Start Assessment'}
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

    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question category */}
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          {currentQuestion.category}
        </div>
        
        {/* Question text */}
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>
          {/* Options - 2 column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const optionLetter = String.fromCharCode(97 + index); // a, b, c, etc.
            const isSelected = answers[currentQuestion.id] === optionLetter;
            
            return (
              <div 
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                className={`p-4 border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg cursor-pointer transition-all h-full`}
              >
                <div className="flex items-start h-full">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center mr-3 mt-0.5`}>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {optionLetter.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800">{option.text}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 ${currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 font-medium rounded-md transition-colors`}
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestion.id]}
            className={`px-6 py-3 ${!answers[currentQuestion.id] ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition-colors`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
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

  // Render the results section
  const renderResultsSection = () => {
    // Build a mapping from category to concise label for radar chart labels
    const categoryLabelMap: Record<string, string> = {};
    questions.forEach(q => {
      if (q.category) {
        // Use only the part before ':' for concise label
        const conciseLabel = q.category.includes(':') ? q.category.split(':')[0].trim() : q.category.trim();
        categoryLabelMap[q.category] = conciseLabel;
      }
    });

    // Sort scores by value
    const sortedScores = Object.entries(categoryScores)
      .map(([key, score]) => ({ key, score }))
      .sort((a, b) => b.score - a.score);

    // Top 3 strengths (highest scores)
    const strengths = sortedScores.slice(0, 3);
    // Top 3 opportunities (lowest scores)
    const weaknesses = sortedScores.slice(-3).reverse();

    // Radar chart: each axis is a concise label, value is the normalized score (0-100)
    const radarData = {
      labels: sortedScores.map(item => {
        // Use concise label from categoryLabelMap, fallback to key
        return categoryLabelMap[item.key] || item.key;
      }),
      datasets: [
        {
          label: 'Your Score',
          data: sortedScores.map(item => item.score),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 4,
        }
      ]
    };
    
    return (
      <div id="assessment-results-section">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Download PDF
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isOrgAssessment ? 'Organization Career Health Score' : 'Career Health Score'}
        </h2>
        {isOrgAssessment && (
          <p className="text-gray-600 mt-2">
            This score represents the aggregate career readiness across your organization
          </p>
        )}
        {/* Risk Navigator Gauge - Moved to the top */}
        <div className="mb-8">
          {/* Gauge and Growth Track now use normalized overallScore (0-100) */}
          <RiskNavigatorGauge score={overallScore} maxScore={100} />
          <div className="mt-4 text-center">
            {overallScore >= 71 && (
              <span className="text-green-600 font-bold">You're in the Strength Track zone with a score of <b>{overallScore}</b>. This is a competitive advantage!</span>
            )}
            {overallScore >= 41 && overallScore < 71 && (
              <span className="text-yellow-600 font-bold">You're in the Growth Track zone with a score of <b>{overallScore}</b>. Focus on key areas for improvement.</span>
            )}
            {overallScore < 41 && (
              <span className="text-red-600 font-bold">You're in the High-Risk zone with a score of <b>{overallScore}</b>. Immediate attention is needed in several areas.</span>
            )}
          </div>
        </div>
        {/* Advanced Profile Results - Show when available for any assessment type */}
        {primaryProfile && Object.keys(dimensionScores).length > 0 && (
          <ProfileResultsCard 
            profile={primaryProfile}
            dimensionScores={dimensionScores}
            recommendations={recommendations}
          />
        )}
        {/* Career Health Radar - Reduced size with description */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Career Dimensions Radar
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Increased chart width for better label fit */}
            <div className="w-full md:w-[520px] mx-auto flex-shrink-0">
              <Radar 
                data={radarData} 
                options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      min: 0,
                      max: 100,
                      ticks: {
                        stepSize: 20,
                        backdropColor: 'transparent',
                        display: true,
                        font: {
                          size: 12
                        }
                      },
                      pointLabels: {
                        font: {
                          size: 14
                        },
                        padding: 10
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  maintainAspectRatio: false
                }} 
                height={340}
                width={520}
              />
            </div>
            {/* Description panel */}
            <div className="md:max-w-sm p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 text-sm mb-2">Understanding Your Score</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-red-400 rounded-full mt-1 mr-2"></span>
                  <span><strong>0-40:</strong> High-risk areas needing immediate attention</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mt-1 mr-2"></span>
                  <span><strong>41-70:</strong> Developing areas with improvement needed</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-green-400 rounded-full mt-1 mr-2"></span>
                  <span><strong>71-100:</strong> Strength areas that give you competitive advantage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Strengths and Development Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="h-full">
            <StrengthsCard 
              strengths={strengths.map(item => ({
                title: categoryLabelMap[item.key] || item.key,
                description: `${item.score}% - ${item.score >= 80 ? 'Exceptional' : item.score >= 70 ? 'Strong' : 'Solid'} performance in this area gives you a competitive advantage.`,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
              }))}
            />
          </div>
          <div className="h-full">
            <DevelopmentCard 
              opportunities={weaknesses.map(item => ({
                title: categoryLabelMap[item.key] || item.key,
                description: `${item.score}% - This area requires focused attention and strategic improvement to reduce career risk.`,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>'
              }))}
            />
          </div>
        </div>
        {/* Growth Path Selection */}
        <div className="mb-12 bg-white p-8 rounded-lg shadow-sm">
          <TieredPlans />
        </div>
        {/* Call to action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {isOrgAssessment ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Schedule an Organization Consultation</h3>
                <p className="text-gray-600 mb-4">
                  Get expert guidance on implementing organization-wide career development strategies.
                </p>
                <button 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Request Consultation
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Enterprise Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Access our full suite of organizational development tools and leadership training resources.
                </p>
                <button 
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                >
                  Explore Enterprise Solutions
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Schedule a Career Coaching Session</h3>
                <p className="text-gray-600 mb-4">
                  Get personalized guidance from our expert career coaches to accelerate your growth.
                </p>
                  <button 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    onClick={() => navigate('/marketplace')}
                  >
                    Book a Coach
                  </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Access Premium Resources</h3>
                <p className="text-gray-600 mb-4">
                  Unlock our library of curated career development tools, courses, and materials.
                </p>
                  <button 
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                    onClick={() => navigate('/products')}
                  >
                    Explore Resources
                  </button>
              </div>
            </>
          )}
        </div>
        {/* Disclaimer */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 text-center">
          {isOrgAssessment ? (
            <>
              This assessment provides organizational insights based on responses and is meant to be a starting point 
              for strategic career development initiatives. Results should be considered alongside other organizational 
              data and professional feedback when making decisions.
            </>
          ) : (
            <>
              This assessment provides insights based on your responses and is meant to be a starting point 
              for your career development journey. Results should be considered alongside other professional 
              feedback and personal reflection.
            </>
          )}
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
      {/* Banner/Header section - Home page style */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            {isOrgAssessment ? (
              assessmentType.includes('9-10')
                ? '9-10 Grade Student Organization Risk Assessment'
                : assessmentType.includes('11-12')
                ? '11-12 Grade Student Organization Risk Assessment'
                : 'Professional Organization Career Risk Assessment'
            ) : (
              assessmentType.includes('9-10')
                ? '9-10 Grade Student Risk Assessment'
                : assessmentType.includes('11-12')
                ? '11-12 Grade Student Risk Assessment'
                : 'Professional Career Risk Assessment'
            )}
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            {isOrgAssessment ? (
              assessmentType.includes('professional')
                ? 'Evaluate career readiness across your organization and get strategic recommendations.'
                : 'Evaluate college and career readiness across your student body and get actionable insights.'
            ) : (
              assessmentType.includes('professional')
                ? 'Discover your career readiness and get personalized recommendations for your professional growth.'
                : 'Discover your college and career readiness and get personalized recommendations for your future.'
            )}
          </p>
        </div>
        {/* Visual element resembling an AI orb */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>

      {/* Main content section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {showIntro && renderIntroSection()}
          {showAssessment && renderAssessmentSection()}
          {showResults && renderResultsSection()}
        </>
      )}
    </div>
  );
};

export default CareerAssessment;
