
import React, { useState } from 'react';

const DiagnosticTool: React.FC = () => {
  // Multi-step state
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    challenge: '',
    timeline: '',
    digitalMaturity: '',
    teamSize: '',
    budget: '',
    aiInterest: '',
    innovationCulture: '',
    leadershipSupport: '',
    customerFocus: '',
    dataDriven: '',
    changeManagement: '',
    techStack: '',
    learningCulture: '',
    feedbackLoops: '',
    crossFunctional: '',
    marketAdaptability: '',
    riskTaking: '',
    sustainability: '',
    immersiveExperience: '',
    immersionInterest: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Backend API call to save diagnostic result
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      if (!response.ok) throw new Error('Failed to save diagnostic');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 max-w-4xl mx-auto relative overflow-hidden flex flex-col space-y-12">
      {/* Header section with blue gradient background */}
      <section className="relative rounded-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-8 py-12 md:py-16">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white z-10 relative text-center drop-shadow">Growth Diagnostic Tool</h1>
          <p className="mb-0 text-blue-100 text-lg md:text-xl z-10 relative text-center max-w-2xl mx-auto">Assess your business or personal growth readiness in minutes. Answer a few questions and get a personalized report with actionable recommendations.</p>
        </div>
      </section>

      {/* Assessment Form Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Start Your Assessment</h2>
        {!submitted ? (
          <form className="space-y-6 max-w-xl mx-auto" onSubmit={step === 4 ? handleSubmit : e => { e.preventDefault(); setStep(step + 1); }}>
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What is your primary growth goal?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.goal} onChange={e => setAnswers(a => ({ ...a, goal: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Increase Revenue</option>
                    <option>Build Brand</option>
                    <option>Expand Team</option>
                    <option>Launch New Product</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What is your biggest challenge?</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Describe your challenge..." value={answers.challenge} onChange={e => setAnswers(a => ({ ...a, challenge: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How soon do you want to see results?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.timeline} onChange={e => setAnswers(a => ({ ...a, timeline: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Immediately</option>
                    <option>1-3 months</option>
                    <option>3-6 months</option>
                    <option>6+ months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your organization's digital maturity?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.digitalMaturity} onChange={e => setAnswers(a => ({ ...a, digitalMaturity: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.teamSize} onChange={e => setAnswers(a => ({ ...a, teamSize: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201+</option>
                  </select>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Digital Transformation Budget</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.budget} onChange={e => setAnswers(a => ({ ...a, budget: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Less than $10,000</option>
                    <option>$10,000 - $50,000</option>
                    <option>$50,000 - $250,000</option>
                    <option>More than $250,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Are you interested in using AI tools for growth?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.aiInterest} onChange={e => setAnswers(a => ({ ...a, aiInterest: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How would you describe your organization's innovation culture?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.innovationCulture} onChange={e => setAnswers(a => ({ ...a, innovationCulture: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Traditional</option>
                    <option>Open to Change</option>
                    <option>Proactive Innovators</option>
                    <option>Disruptors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How strong is leadership support for digital initiatives?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.leadershipSupport} onChange={e => setAnswers(a => ({ ...a, leadershipSupport: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Weak</option>
                    <option>Moderate</option>
                    <option>Strong</option>
                    <option>Visionary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How customer-focused is your organization?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.customerFocus} onChange={e => setAnswers(a => ({ ...a, customerFocus: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>World-class</option>
                  </select>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How data-driven are your decision processes?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.dataDriven} onChange={e => setAnswers(a => ({ ...a, dataDriven: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Not at all</option>
                    <option>Somewhat</option>
                    <option>Mostly</option>
                    <option>Fully</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How effective is change management in your organization?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.changeManagement} onChange={e => setAnswers(a => ({ ...a, changeManagement: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Poor</option>
                    <option>Average</option>
                    <option>Good</option>
                    <option>Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How modern is your technology stack?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.techStack} onChange={e => setAnswers(a => ({ ...a, techStack: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Legacy</option>
                    <option>Mixed</option>
                    <option>Modern</option>
                    <option>Cutting-edge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How strong is your organization's learning culture?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.learningCulture} onChange={e => setAnswers(a => ({ ...a, learningCulture: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Weak</option>
                    <option>Developing</option>
                    <option>Strong</option>
                    <option>Exceptional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How frequent are feedback loops in your organization?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.feedbackLoops} onChange={e => setAnswers(a => ({ ...a, feedbackLoops: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Rare</option>
                    <option>Occasional</option>
                    <option>Regular</option>
                    <option>Continuous</option>
                  </select>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How cross-functional are your teams?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.crossFunctional} onChange={e => setAnswers(a => ({ ...a, crossFunctional: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Not at all</option>
                    <option>Somewhat</option>
                    <option>Mostly</option>
                    <option>Fully</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How adaptable is your organization to market changes?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.marketAdaptability} onChange={e => setAnswers(a => ({ ...a, marketAdaptability: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Poor</option>
                    <option>Average</option>
                    <option>Good</option>
                    <option>Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How open is your organization to risk-taking?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.riskTaking} onChange={e => setAnswers(a => ({ ...a, riskTaking: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Not at all</option>
                    <option>Somewhat</option>
                    <option>Mostly</option>
                    <option>Fully</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How important is sustainability in your growth strategy?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.sustainability} onChange={e => setAnswers(a => ({ ...a, sustainability: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Not important</option>
                    <option>Somewhat important</option>
                    <option>Important</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Would you be interested in immersive growth experiences (e.g., workshops, simulations)?</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={answers.immersionInterest} onChange={e => setAnswers(a => ({ ...a, immersionInterest: e.target.value }))} required>
                    <option value="">Select...</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Maybe</option>
                  </select>
                </div>
              </>
            )}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold" onClick={() => setStep(step - 1)}>
                  Previous
                </button>
              )}
              <button type="submit" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all text-lg" disabled={loading}>
                {loading ? 'Submitting...' : step === 4 ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Thank you for completing the diagnostic!</h2>
            <p className="text-lg text-gray-700 mb-2">Our team will review your responses and reach out with a personalized roadmap.</p>
            <a href="/career-assessment" className="inline-block mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800">Try Full Assessment</a>
          </div>
        )}
      </section>

      {/* CTA Section for consistency */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want a Deeper Assessment?</h2>
        <p className="mb-8 max-w-2xl mx-auto">Try our full AI-powered assessment for a comprehensive growth roadmap.</p>
        <a href="/career-assessment" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">Try Full Assessment</a>
      </section>
    </div>
  );
};

export default DiagnosticTool;
