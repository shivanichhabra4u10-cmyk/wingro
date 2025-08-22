
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJS, RadialLinearScale, LinearScale, CategoryScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import RiskNavigatorGauge from '../components/RiskNavigatorGauge';
import StrengthsCard from '../components/StrengthsCard';
import DevelopmentCard from '../components/DevelopmentCard';
import TieredPlans from '../components/TieredPlans';
import earlyStartupQuestions from '../data/early-startup-questions.json';
import establishedStartupQuestions from '../data/established-startup-questions.json';

// For PDF export
import html2pdf from 'html2pdf.js';

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

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
}
interface OrganizationData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  companySize: string;
  companyAge: string;
  role: string;
  organizationType?: string;
  category?: string;
  assessmentType?: string;
  linkedinUrl?: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.wingrox.com/api'
  : 'http://localhost:3001/api';

const OrganizationAssessment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [assessmentType, setAssessmentType] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData>({} as OrganizationData);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const companyAges = [
    'Less than 1 year', '1-3 years', '4-7 years', '8-15 years', '16+ years'
  ];
  const roles = [
    'Founder/CEO', 'COO/Operations', 'CFO/Finance', 'CTO/Technology', 'CMO/Marketing', 'HR/People', 'Other'
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const category = localStorage.getItem('category') || '';
    let type = '';
    if (typeParam === 'early-startup' || category === 'organization-early-startup') {
      type = 'organization-early-startup';
    } else if (typeParam === 'established' || category === 'organization-established') {
      type = 'organization-established';
    } else {
      navigate('/assessment-selection', { replace: true });
      return;
    }
    setAssessmentType(type);
    loadQuestions(type);
    setIsLoading(false);
  }, [location, navigate]);

  const loadQuestions = (type: string) => {
    let questionData: Question[] = [];
    if (type === 'organization-early-startup') {
      questionData = earlyStartupQuestions as unknown as Question[];
    } else if (type === 'organization-established') {
      questionData = establishedStartupQuestions as unknown as Question[];
    }
    setQuestions(questionData);
  };

  const handleSelectOption = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id]) {
      toast.warning('Please select an answer before proceeding.');
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setShowAssessment(false);
    setShowResults(true);
    window.scrollTo(0, 0);
    setSubmitting(true);
    setError(null);
    const assessmentData = {
      type: assessmentType,
      organization: organizationData,
      answers: Object.entries(answers).map(([questionId, option]) => ({
        questionId: parseInt(questionId),
        option
      }))
    };
    try {
      if (!assessmentId) {
        setError('Assessment ID is missing. Please try starting the assessment again.');
        toast.error('Assessment ID is missing.');
        setSubmitting(false);
        return;
      }
      await axios.put(`${API_URL}/assessment/organization/${assessmentId}`, { responseData: assessmentData });
    } catch (err: any) {
      setError('Failed to submit assessment. Please try again later.');
      toast.error(err.response?.data?.message || 'Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartAssessment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const orgData: OrganizationData = {
      companyName: formData.get('companyName') as string,
      contactName: formData.get('contactName') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      industry: formData.get('industry') as string,
      companySize: formData.get('companySize') as string,
      companyAge: formData.get('companyAge') as string,
      role: formData.get('role') as string,
      linkedinUrl: formData.get('linkedinUrl') as string || ''
    };
    setOrganizationData(orgData);
    try {
      const response = await axios.post(`${API_URL}/assessment/organization`, orgData);
      if (response.data && response.data.success) {
        if (response.data.data && response.data.data._id) {
          setAssessmentId(response.data.data._id);
        }
        setShowIntro(false);
        setShowAssessment(true);
        setCurrentQuestionIndex(0);
        toast.success('Organization info saved successfully!');
      } else {
        setError('Failed to create assessment. Please try again.');
        toast.error('Failed to create assessment.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create assessment. Please try again later.');
      toast.error(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateCategoryScores = useCallback(() => {
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    questions.forEach(question => {
      const answer = answers[question.id];
      if (!answer) return;
      const mainCategory = question.category.split(':')[0].trim();
      if (!categoryScores[mainCategory]) categoryScores[mainCategory] = 0;
      if (!categoryCounts[mainCategory]) categoryCounts[mainCategory] = 0;
      const optionIndex = 'abcdef'.indexOf(answer.toLowerCase());
      if (optionIndex !== -1) {
        categoryScores[mainCategory] += (5 - optionIndex);
        categoryCounts[mainCategory] += 1;
      }
    });
    return Object.entries(categoryScores).reduce((finalScores: Record<string, number>, [category, score]) => {
      const maxPossible = categoryCounts[category] * 5;
      finalScores[category] = Math.round((score / maxPossible) * 100);
      return finalScores;
    }, {});
  }, [questions, answers]);

  const calculateOverallScore = useCallback((categoryScores: Record<string, number>) => {
    const categories = Object.values(categoryScores);
    const totalScore = categories.reduce((sum, score) => sum + score, 0);
    return categories.length ? Math.round(totalScore / categories.length) : 0;
  }, []);

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[300px]">
      <span className="text-blue-700 text-lg font-semibold">Loading...</span>
    </div>
  );

  const renderIntroSection = () => (
  <form className="w-full max-w-none bg-white rounded-2xl shadow-sm p-8 md:p-12 mx-auto" onSubmit={handleStartAssessment}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Organization Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Name</label>
          <input name="companyName" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Contact Name</label>
          <input name="contactName" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Contact Email</label>
          <input name="contactEmail" type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
          <input name="contactPhone" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Industry</label>
          <input name="industry" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Size</label>
          <input name="companySize" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Age</label>
          <select name="companyAge" required className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select</option>
            {companyAges.map(age => <option key={age} value={age}>{age}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <select name="role" required className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">LinkedIn URL (optional)</label>
          <input name="linkedinUrl" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
      </div>
      <button type="submit" className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition" disabled={submitting}>
        {submitting ? 'Saving...' : 'Start Assessment'}
      </button>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
    </form>
  );

  const renderAssessmentSection = () => {
    if (!questions.length) return null;
    const question = questions[currentQuestionIndex];
    // 2-column grid for options, full-width layout, match CareerAssessment look
    return (
      <div className="bg-white w-full max-w-none shadow-sm p-0 md:p-12 rounded-none">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%` }}
            ></div>
          </div>
        </div>
        {/* Category */}
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          {question.category}
        </div>
        {/* Question text */}
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {question.question}
        </h3>
        {/* Options - 2 column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {question.options.map((opt, idx) => {
            const optionLetter = opt.option || String.fromCharCode(97 + idx);
            const isSelected = answers[question.id] === optionLetter;
            return (
              <div
                key={optionLetter}
                onClick={() => handleSelectOption(question.id, optionLetter)}
                className={`p-4 border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg cursor-pointer transition-all h-full`}
              >
                <div className="flex items-start h-full">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center mr-3 mt-0.5`}>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>{optionLetter.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-800">{opt.text}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 ${currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 font-medium rounded-md transition-colors`}
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!answers[question.id]}
            className={`px-6 py-3 ${!answers[question.id] ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition-colors`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const renderResultsSection = () => {
    // PDF download handler
    const handleDownloadPDF = () => {
      toast.dismiss(); // Close all toasts to prevent removalReason error
      setTimeout(() => {
        const element = document.getElementById('org-assessment-results');
        if (element) {
          html2pdf().from(element).set({
            margin: [0.75, 0.5, 0.75, 0.5], // top, right, bottom, left (inches)
            filename: 'organization-assessment-report.pdf',
            html2canvas: { scale: 2, useCORS: true },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          }).save();
        }
      }, 300); // Wait a moment for toasts to close
    };
    const categoryScores = calculateCategoryScores();
    const overallScore = calculateOverallScore(categoryScores);
    // Build concise label map for radar chart axes
  const categoryLabelMap: Record<string, string> = {};
    questions.forEach(q => {
      if (q.category) {
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
      labels: sortedScores.map(item => categoryLabelMap[item.key] || item.key),
      datasets: [
        {
          label: 'Score',
          data: sortedScores.map(item => item.score),
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(37, 99, 235, 1)'
        }
      ]
    };
    // Recommendations logic (simple placeholder, can be improved)
    const generateRecommendations = () => {
      const recommendations = [];
      if (overallScore < 50) {
        recommendations.push('Focus on strengthening foundational business operations and team alignment.');
        recommendations.push('Consider external mentorship or consulting for rapid improvement.');
      } else {
        recommendations.push('Your organization shows strong potential. Explore growth and scaling opportunities.');
        recommendations.push('Continue investing in your strengths and address any weak areas.');
      }
      weaknesses.forEach(({ key }) => {
        recommendations.push(`Develop a focused improvement plan for ${categoryLabelMap[key] || key}.`);
      });
      return recommendations;
    };
    const recommendations = generateRecommendations();
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return (
  <div id="org-assessment-results">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Organization Health Score</h2>
          <button
            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
        <div className="mb-8">
          <RiskNavigatorGauge score={overallScore} maxScore={100} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Organization Dimensions Radar
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-4">
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
                        font: { size: 12 }
                      },
                      pointLabels: {
                        font: { size: 14 },
                        padding: 10
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  },
                  maintainAspectRatio: false
                }}
                height={340}
                width={520}
              />
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="h-full">
            <StrengthsCard 
              strengths={strengths.map(item => ({
                title: categoryLabelMap[item.key] || item.key,
                description: `${item.score}% - ${item.score >= 80 ? 'Exceptional' : item.score >= 70 ? 'Strong' : 'Solid'} performance in this area gives your organization a competitive advantage.`,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
              }))}
            />
          </div>
          <div className="h-full">
            <DevelopmentCard 
              opportunities={weaknesses.map(item => ({
                title: categoryLabelMap[item.key] || item.key,
                description: `${item.score}% - This area requires focused attention and strategic improvement to reduce organizational risk.`,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>'
              }))}
            />
          </div>
        </div>
        <div className="mb-12 bg-white p-8 rounded-lg shadow-sm">
          <TieredPlans />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Strategic Recommendations
          </h3>
          <ul className="space-y-3 pl-2">
            {recommendations.map((recommendation, index) => (
              <li key={`rec-${index}`} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Schedule a Business Consulting Session</h3>
            <p className="text-gray-600 mb-4">Get personalized guidance from our expert business consultants to accelerate your growth.</p>
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              onClick={() => navigate('/marketplace')}
            >Book a Consultant</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Access Premium Resources</h3>
            <p className="text-gray-600 mb-4">Unlock our library of curated business development tools, courses, and materials.</p>
            <button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
              onClick={() => navigate('/products')}
            >Explore Resources</button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center mb-6">
          <p className="text-sm text-gray-500">
            Assessment completed on {reportDate} • Reference ID: {assessmentId && typeof assessmentId === 'string' ? assessmentId.slice(-8).toUpperCase() : 'PENDING'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
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
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            {assessmentType.includes('early-startup') 
              ? 'Early-Stage Startup Risk Assessment' 
              : 'Established Organization Risk Assessment'}
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Evaluate your organization's readiness and identify strategic growth opportunities
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
      {isLoading ? renderLoadingState() : (
        <>
          {showIntro && renderIntroSection()}
          {showAssessment && renderAssessmentSection()}
          {showResults && renderResultsSection()}
        </>
      )}
    </div>
  );
};

export default OrganizationAssessment;
