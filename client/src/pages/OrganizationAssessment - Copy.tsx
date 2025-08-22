import { calculateScoresByType, getRecommendationsByType, generateSummaryReport } from '../services/assessmentScoringService';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import earlyStartupQuestions from '../data/early-startup-questions.json';
import establishedStartupQuestions from '../data/established-startup-questions.json';
import RiskNavigatorGauge from '../components/RiskNavigatorGauge';
import { submitOrganizationAssessment } from '../services/organizationAssessmentApi';
import { Radar } from 'react-chartjs-2';
import '../chartjs-setup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Dummy recommendations and strengths logic for demonstration
const getRecommendations = (categoryScores: Record<string, number>) => {
  // Example: Recommend improvement for lowest scoring category
  const sorted = Object.entries(categoryScores).sort((a, b) => a[1] - b[1]);
  if (sorted.length === 0) return [];
  return [
    {
      title: `Focus on ${sorted[0][0]}`,
      description: `Your lowest score is in ${sorted[0][0]}. Consider targeted strategies to improve this area.`
    }
  ];
};
const getStrengths = (categoryScores: Record<string, number>) => {
  // Example: Strength is highest scoring category
  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return [];
  return [
    {
      title: `Strength: ${sorted[0][0]}`,
      description: `You scored highest in ${sorted[0][0]}. Leverage this strength for growth.`
    }
  ];
};
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




  // ...existing code...

  // export default OrganizationAssessment; // Commented out to avoid duplicate export







const OrganizationAssessment: React.FC = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [orgData, setOrgData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    industry: '',
    companySize: '',
    companyAge: '',
    role: '',
  });
  const [overallScore, setOverallScore] = useState(0);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<any[]>([]);
  const [summaryReport, setSummaryReport] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'early-startup') {
      setQuestions(earlyStartupQuestions as Question[]);
    } else if (type === 'established') {
      setQuestions(establishedStartupQuestions as Question[]);
    } else {
      setQuestions([]);
    }
  }, [location.search]);

  // Calculate scores
  // Use the same scoring logic as 9-10 assessment
  const calculateScores = () => {
  // Prepare answers in the format expected by assessmentScoringService
  const formattedAnswers: Record<number, string> = answers;
  // Use 'organization' as assessmentType for now
  const scoring: any = calculateScoresByType('organization', formattedAnswers);
  setDimensionScores(scoring.dimensionScores || {});
  setOverallScore(scoring.overallScore || 0);
  setRecommendations(getRecommendationsByType('organization', scoring));
  setStrengths(scoring.strengths || []);
  const summaryObj = generateSummaryReport(scoring) as { summary?: string };
  setSummaryReport(summaryObj.summary || '');
  return { dimensionScores: scoring.dimensionScores, overallScore: scoring.overallScore };
  };

  // Handlers
  const handleOrgDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAnswerSelect = (questionId: number, optionLetter: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionLetter }));
  };
  const handleStartAssessment = () => {
    setShowIntro(false);
    setShowAssessment(true);
  };
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of assessment
      setIsSubmitting(true);
      setSubmitError('');
      try {
        const { dimensionScores, overallScore } = calculateScores();
        // Prepare payload
        const payload = {
          ...orgData,
          answers,
          dimensionScores,
          overallScore,
          assessmentType: 'organization',
          completedAt: new Date().toISOString(),
        };
        await submitOrganizationAssessment(payload);
        toast.success('Assessment submitted successfully!');
        setShowAssessment(false);
        setShowResults(true);
      } catch (err: any) {
        setSubmitError('Failed to submit assessment. Please try again.');
        toast.error('Failed to submit assessment.');
      } finally {
        setIsSubmitting(false);
      }
    }
    window.scrollTo(0, 0);
  };
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  // UI sections
  const renderIntroSection = () => (
    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Organization Assessment</h2>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleStartAssessment(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input type="text" name="companyName" value={orgData.companyName} onChange={handleOrgDataChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
            <input type="text" name="contactName" value={orgData.contactName} onChange={handleOrgDataChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
            <input type="email" name="contactEmail" value={orgData.contactEmail} onChange={handleOrgDataChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input type="text" name="contactPhone" value={orgData.contactPhone} onChange={handleOrgDataChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input type="text" name="industry" value={orgData.industry} onChange={handleOrgDataChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
            <select name="companySize" value={orgData.companySize} onChange={handleOrgDataChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select Size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501+">501+</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Age</label>
            <input type="text" name="companyAge" value={orgData.companyAge} onChange={handleOrgDataChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
            <input type="text" name="role" value={orgData.role} onChange={handleOrgDataChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <button type="submit" className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Start Assessment</button>
      </form>
    </div>
  );

  const renderAssessmentSection = () => {
    if (questions.length === 0 || !questions[currentQuestionIndex]) {
      return <div className="text-center p-8">No questions available.</div>;
    }
    const q = questions[currentQuestionIndex];
    const selected = answers[q.id];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto mt-8">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="text-sm text-gray-600">{progress}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="mb-2 text-blue-700 font-semibold">{q.category}</div>
        <div className="mb-4 text-lg font-medium text-blue-900">{q.question}</div>
        <div className="space-y-2 mb-8">
          {q.options.map((opt, idx) => {
            const letter = opt.option || String.fromCharCode(97 + idx);
            const isSelected = selected === letter;
            return (
              <label key={letter} className={`flex items-center p-3 rounded-lg border cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={letter}
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(q.id, letter)}
                  className="mr-3"
                />
                <span>{opt.text}</span>
              </label>
            );
          })}
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">Previous</button>
          <button type="button" onClick={handleNext} disabled={!selected} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    );
  };

  const renderResultsSection = () => {
    // Radar chart data by dimension
    const radarData = {
      labels: Object.keys(dimensionScores),
      datasets: [
        {
          label: 'Dimension Score',
          data: Object.values(dimensionScores),
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        },
      ],
    };
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Assessment Results</h2>
        <div className="mb-8">
          <RiskNavigatorGauge score={overallScore} />
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Dimension Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(dimensionScores).map(([dim, score]) => (
              <div key={dim} className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <span className="font-medium text-blue-800">{dim}</span>
                <span className="font-bold text-blue-700">{score}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Dimension Radar</h3>
          <div className="w-full md:w-[520px] mx-auto">
            <Radar data={radarData} options={{
              scales: {
                r: {
                  beginAtZero: true,
                  min: 0,
                  max: 100,
                  ticks: { stepSize: 20, backdropColor: 'transparent', display: true, font: { size: 12 } },
                  pointLabels: { font: { size: 14 }, padding: 10 }
                }
              },
              plugins: { legend: { display: false } },
              maintainAspectRatio: false
            }} height={340} width={520} />
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
            {strengths.length === 0 ? <span>No strengths identified.</span> : strengths.map((s, i) => (
              <div key={i} className="mb-2">
                <div className="font-medium text-green-700">{s.title}</div>
                <div className="text-green-600 text-sm">{s.description}</div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Development Recommendations</h4>
            {recommendations.length === 0 ? <span>No recommendations available.</span> : recommendations.map((r, i) => (
              <div key={i} className="mb-2">
                <div className="font-medium text-yellow-700">{r.title}</div>
                <div className="text-yellow-600 text-sm">{r.description}</div>
              </div>
            ))}
          </div>
        </div>
        {summaryReport && <div className="bg-blue-50 p-4 rounded mb-4 text-blue-900">{summaryReport}</div>}
        {submitError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{submitError}</div>}
        <div className="text-center">
          <a href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">Back to Home</a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {showIntro && renderIntroSection()}
      {showAssessment && renderAssessmentSection()}
      {showResults && renderResultsSection()}
    </div>
  );
};

export default OrganizationAssessment;
// Stray closing button tag removed
