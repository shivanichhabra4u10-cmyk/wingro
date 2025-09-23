import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type CategoryType = 'individual' | 'organization' | null;

const AssessmentSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleCategoryChange = (category: CategoryType) => {
    if (category === null) {
      // Animate out before changing state
      setIsAnimatingOut(true);
      setTimeout(() => {
        setSelectedCategory(category);
        setIsAnimatingOut(false);
      }, 300);
    } else {
      setSelectedCategory(category);
    }
  };

  // Handle selection of assessment type
  const { isAuthenticated } = useAuth();
  const handleAssessmentSelection = (category: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/assessment-selection' } });
      return;
    }
    // Store the selected category in localStorage for reference
    localStorage.setItem('category', category);
    // Navigate to the appropriate assessment page
    switch (category) {
      case 'individual-grade-9-10':
        navigate('/student-9-10');
        break;
      case 'individual-grade-11-12':
        navigate('/student-11-12');
        break;
      case 'individual-professional':
        navigate('/professional');
        break;
      case 'organization-early-startup':
        navigate('/organization?type=early-startup');
        break;
      case 'organization-established':
        navigate('/organization?type=established');
        break;
      default:
        // Default to home if invalid selection
        navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
      {/* Banner Section - Home page style */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Select Your Assessment Type
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Choose the assessment that best matches your current situation to receive a personalized risk evaluation and growth recommendations.
          </p>
        </div>
        {/* Visual element resembling an AI orb */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
        
        {/* Main Category Selection Buttons - Only visible when no category is selected */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {/* Individual Button */}
            <button 
              onClick={() => handleCategoryChange('individual')}
              className="flex flex-col items-center justify-center p-8 rounded-xl transition bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Individual Assessment</h2>
              <p className="text-center opacity-80">For students and working professionals</p>
            </button>
            
            {/* Organization Button */}
            <button 
              onClick={() => handleCategoryChange('organization')}
              className="flex flex-col items-center justify-center p-8 rounded-xl transition bg-white hover:bg-amber-50 text-amber-600 border-2 border-amber-200 hover:border-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Organization Assessment</h2>
              <p className="text-center opacity-80">For startups and established businesses</p>
            </button>
          </div>
        )}
        
        {/* Display assessments based on selected category */}
        {selectedCategory === 'individual' && (
          <div className={`transition-all duration-500 ease-in-out transform ${isAnimatingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Individual Assessments
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These assessments are designed for individual students and professionals to evaluate personal skills and career readiness.
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Categories
                </button>
              </div>
            </header>
            
            {/* Individual Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Individual Assessments */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-blue-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-semibold">Grades 9-10 Students</h2>
                  <p className="text-blue-100">For high school freshmen and sophomores</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Assess your early high school readiness and identify areas for growth to prepare for college applications and career planning.
                  </p>
                  <ul className="text-sm text-gray-700 mb-8 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Early college preparation strategies
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Academic strengths and growth areas
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Initial career exploration guidance
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleAssessmentSelection('individual-grade-9-10')}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
                  >
                    Start 9-10 Grade Assessment
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-purple-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-semibold">Grades 11-12 Students</h2>
                  <p className="text-purple-100">For high school juniors and seniors</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Evaluate your college and career readiness as you prepare for graduation and post-secondary planning.
                  </p>
                  <ul className="text-sm text-gray-700 mb-8 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      College application readiness
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Career path alignment assessment
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced academic & life skills evaluation
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleAssessmentSelection('individual-grade-11-12')}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition"
                  >
                    Start 11-12 Grade Assessment
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-green-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-semibold">Working Professionals</h2>
                  <p className="text-green-100">For individuals in the workforce</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Assess your career readiness, identify growth opportunities, and plan your next professional development steps.
                  </p>
                  <ul className="text-sm text-gray-700 mb-8 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Professional skills gap analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Career advancement opportunities
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Leadership and industry readiness
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleAssessmentSelection('individual-professional')}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
                  >
                    Start Professional Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedCategory === 'organization' && (
          <div className="animate-fadeIn transition-all duration-500 ease-in-out transform">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Organization Assessments
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These assessments help organizations evaluate their readiness, identify risks, and discover growth opportunities.
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className="px-4 py-2 text-amber-600 hover:text-amber-800 flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Categories
                </button>
              </div>
            </header>
            
            {/* Organization Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Organization Assessments */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-amber-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-semibold">Early-Stage Organizations</h2>
                  <p className="text-amber-100">For startups and new businesses</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Evaluate your startup's foundational elements and identify key areas for early growth and investment.
                  </p>
                  <ul className="text-sm text-gray-700 mb-8 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Startup risk evaluation
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Team development needs
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Growth opportunity identification
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleAssessmentSelection('organization-early-startup')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition"
                  >
                    Start Early-Stage Assessment
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-indigo-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-semibold">Established Organizations</h2>
                  <p className="text-indigo-100">For mature businesses seeking growth</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Assess your established organization's strengths and growth opportunities to take your business to the next level.
                  </p>
                  <ul className="text-sm text-gray-700 mb-8 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Organizational efficiency analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Scaling and expansion readiness
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Leadership and innovation capacity
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleAssessmentSelection('organization-established')}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition"
                  >
                    Start Established Business Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show instruction when no category is selected */}
        {!selectedCategory && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Please select an assessment category above to see available assessments.
            </p>
          </div>
        )}
      </div>
  );
};

export default AssessmentSelection;
