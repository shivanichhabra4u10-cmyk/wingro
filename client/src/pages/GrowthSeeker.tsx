import React, { useState } from 'react';

/**
 * GrowthSeeker component representing the diagnostic flow for users
 * Based on the wingrox_marketplace (9).html reference
 */
const GrowthSeeker: React.FC = () => {
  // State management for the diagnostic flow
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [challengeType, setChallengeType] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [industry, setIndustry] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [desiredOutcome, setDesiredOutcome] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('90');
  const [budget, setBudget] = useState<string>('');
  
  // Calculate progress percentage for progress bar
  const progressPercentage = (currentStep / 4) * 100;
  
  // Function to handle moving to next step in diagnostic flow
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle submission/matching at final step
      generateMatches();
    }
  };
  
  // Function to handle generating architect matches
  const generateMatches = () => {
    // In a real implementation, this would make an API call
    // For now, we'll just show a success message
    alert('Thank you for completing the diagnostic. In a real implementation, we would show your matched Growth Architects here.');
  };
  
  // Helper function to check if current step can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return challengeType !== '';
      case 2:
        return true; // Pain level has a default value
      case 3:
        return industry !== '' && stage !== '';
      case 4:
        return desiredOutcome !== '' && budget !== '';
      default:
        return false;
    }
  };
  return (
    <div className="min-h-screen py-20 bg-gray-50 relative overflow-hidden">
      {/* Header section with blue gradient background */}
      <div className="relative rounded-2xl overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-8 py-12">
          {/* Visual orb elements for consistency */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-white z-10 relative">Breakthrough Your Growth Ceiling</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto z-10 relative">AI-powered expert matching for guaranteed growth outcomes</p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200 mb-1">12,847</div>
                <p className="text-sm text-blue-100">Successful Transformations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200 mb-1">4.9/5</div>
                <p className="text-sm text-blue-100">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200 mb-1">100%</div>
                <p className="text-sm text-blue-100">Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Step 1: Challenge Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">What's your biggest growth challenge?</h2>
            <div className="space-y-4">
              <select 
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value)}
              >
                <option value="">Select your primary challenge...</option>
                <option value="personal">Personal Growth & Career Reinvention</option>
                <option value="startup">Startup Growth & Scaling</option>
                <option value="business">Business Transformation</option>
                <option value="leadership">Leadership & Team Development</option>
              </select>
            </div>
            <button 
              className={`w-full py-4 px-8 text-lg font-semibold rounded-xl ${
                canProceed() ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Pain Intensity */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">How urgent is this challenge?</h2>
            <p className="mb-4 text-lg text-gray-600">Rate the pain level this challenge is causing you:</p>
            <div className="space-y-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={painLevel} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Mild Concern</span>
                <span className="font-bold">{painLevel}</span>
                <span>Keeps Me Up at Night</span>
              </div>
            </div>
            <button 
              className="w-full py-4 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl"
              onClick={nextStep}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Context */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Tell us about your situation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">What industry are you in?</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select industry...</option>
                  <option value="tech">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">What's your current stage?</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="">Select stage...</option>
                  <option value="individual">Individual Professional</option>
                  <option value="early-startup">Early Stage Startup</option>
                  <option value="growing-business">Growing Business</option>
                  <option value="established-company">Established Company</option>
                </select>
              </div>
            </div>
            <button 
              className={`w-full py-4 px-8 text-lg font-semibold rounded-xl ${
                canProceed() ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Desired Outcome */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">What would success look like?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">In 90 days, I want to...</label>
                <textarea 
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg h-32"
                  placeholder="Describe your ideal outcome in specific, measurable terms..."
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Timeline for results:</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Investment budget:</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select budget range...</option>
                  <option value="500">Under $500</option>
                  <option value="2000">$500 - $2,000</option>
                  <option value="5000">$2,000 - $5,000</option>
                  <option value="10000">$5,000 - $10,000</option>
                  <option value="20000">$10,000+</option>
                </select>
              </div>
            </div>
            <button 
              className={`w-full py-4 px-8 text-lg font-semibold rounded-xl ${
                canProceed() ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Find My Growth Architects
            </button>
          </div>
        )}
      </div>

      {/* Why WinGroX Works Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why WinGroX Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-blue-600 text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Our Growth Intelligence Engine analyzes your challenges, personality, and goals to find the perfect Growth Architect with 95% accuracy.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Outcome Guaranteed</h3>
            <p className="text-gray-600">
              Every engagement includes measurable goals and milestone-based payments. If you don't hit your targets, you don't pay.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-amber-600 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Proven Methodologies</h3>
            <p className="text-gray-600">
              Access battle-tested growth frameworks from architects who've generated over $2.3B in combined client outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthSeeker;
