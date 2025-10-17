import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GrowthLinkProviderMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const toggleExpanded = (challengeId: string) => {
    setExpandedChallenge(expandedChallenge === challengeId ? null : challengeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-200">
            WinGrox AI GrowthLink™
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Provider Challenge Marketplace</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 font-medium">
            "Real Problems. Real Budgets. Real Impact. Intelligence-Verified."
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">🎯 Verified Challenges</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">💰 Real Budgets</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">🤝 Trust Ledger™ Verified</span>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Gateway to Meaningful Growth</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-blue-700">For Solution Providers</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Discover <strong>verified problem statements</strong> from real organizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Access <strong>Pain Signatures™</strong> — distilled unmet needs & impact scope</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>See <strong>transparent budget ranges</strong> and realistic timelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Get <strong>AI-powered matching</strong> based on your proven capabilities</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-purple-700">Your Growth Journey</h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  <span>Browse verified challenges by domain expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  <span>Submit proposals through Provider Intelligence Questionnaire</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  <span>Get shortlisted by AI Matchmaker Engine</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  <span>Collaborate via Trust Ledger™ verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Clusters */}
      <section className="max-w-6xl mx-auto py-8 px-4 md:px-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Active Challenge Clusters</h3>
        
        {/* Healthcare Cluster - Featured Challenge */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border-l-8 border-blue-500">
          <div className="p-8">
            {/* Challenge Header */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <span className="text-4xl">🧩</span>
                <div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">PAIN SIGNATURE™</span>
                  <h4 className="text-sm text-gray-500 mt-1">HEALTHCARE CLUSTER</h4>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">₹25 – ₹50 L</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">4 months</span>
              </div>
            </div>

            <h5 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              🏥 Smart OPD Queue & Slot Optimization System
            </h5>

            <div className="text-gray-600 mb-6">
              <span className="font-semibold text-blue-700">Cluster:</span> Health & Well-Being
            </div>

            {/* Pain Context Preview */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <h6 className="font-semibold text-red-800 mb-2">Critical Pain Context</h6>
              <p className="text-red-700">
                Multi-city hospital chain faces OPD scheduling chaos. Despite 60% online bookings, 
                show rates fluctuate drastically causing doctor idle time and evening queues. 
                <strong> Average wait: 72 minutes, 25% slots underutilized daily.</strong>
              </p>
            </div>

            {/* Expandable Details */}
            <button
              onClick={() => toggleExpanded('healthcare-opd')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold mb-6 transition-all duration-200"
            >
              {expandedChallenge === 'healthcare-opd' ? 'Show Less Details' : 'View Full Challenge Details'}
            </button>

            {expandedChallenge === 'healthcare-opd' && (
              <div className="space-y-6 mt-6 border-t pt-6">
                {/* Impact Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h6 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      ⚠️ Current Impact on Organization
                    </h6>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Doctor utilization dropped 18%, affecting revenue targets</li>
                      <li>• Patient satisfaction: NPS declined from 4.4 → 3.8</li>
                      <li>• Billing irregularities from last-minute cancellations</li>
                      <li>• Corporate HQ lacks real-time visibility across centers</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h6 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      🚫 What has Been Tried and Failed
                    </h6>
                    <ul className="space-y-2 text-gray-700">
                      <li>• SMS/email reminders (no behavioral prediction)</li>
                      <li>• Excel-based prioritization (inconsistent, subjective)</li>
                      <li>• ₹1 Cr ERP customization (no predictive algorithms)</li>
                      <li>• Basic chatbot (confirmations only, no rescheduling)</li>
                    </ul>
                  </div>
                </div>

                {/* Desired Outcome */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <h6 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    🎯 Desired Transformation
                  </h6>
                  <p className="text-green-700 mb-4 text-lg font-medium">
                    An AI-powered scheduling intelligence system that predicts no-shows, 
                    reallocates slots dynamically, and provides real-time visibility across all hospital branches.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-green-700">
                      <li>✓ Integrate with current HIS/CRM/WhatsApp APIs</li>
                      <li>✓ Auto-recommend optimal patient queue using probabilistic models</li>
                    </ul>
                    <ul className="space-y-2 text-green-700">
                      <li>✓ Reduce OPD idle time by 30% within 60 days</li>
                      <li>✓ Real-time cross-branch analytics dashboard</li>
                    </ul>
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h6 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    ⭐ Ideal Provider Profile
                  </h6>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-blue-700">
                      <li>✅ Proven AI scheduling or hospital workflow projects</li>
                      <li>✅ Low-code customization capabilities per department</li>
                    </ul>
                    <ul className="space-y-2 text-blue-700">
                      <li>✅ Role-based dashboards (admin, doctor, corporate)</li>
                      <li>✅ HIPAA/NDHM interoperability experience</li>
                    </ul>
                  </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Hospital Workflow', 'Predictive Scheduling', 'Process Optimization', 'HealthTech', 'Operations Intelligence'].map((tag) => (
                    <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl mt-6">
              <h6 className="font-bold text-gray-800 mb-3 text-lg">Ready to Transform Healthcare Operations?</h6>
              <p className="text-gray-700 mb-4">
                Have you built smart scheduling, queue management, or predictive analytics systems? 
                Attach a short concept note or video demo — shortlisted proposals receive verified onboarding through WinGrox AI Trust Ledger™.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/programs/provider-intelligence')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  🟩 Submit Solution Proposal
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200">
                  Learn More About Trust Ledger™
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More Clusters Coming Soon */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">🚀 Enterprise AI Cluster</h4>
            <p className="text-gray-600 text-sm">Digital transformation challenges from Fortune 500 companies</p>
            <span className="text-purple-500 text-sm font-semibold">Coming Soon</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <h4 className="font-bold text-green-700 mb-2">🌱 AgriTech Innovation</h4>
            <p className="text-gray-600 text-sm">Smart farming and agricultural optimization challenges</p>
            <span className="text-green-500 text-sm font-semibold">Coming Soon</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">🎓 EduTech Evolution</h4>
            <p className="text-gray-600 text-sm">Educational technology and learning experience challenges</p>
            <span className="text-blue-500 text-sm font-semibold">Coming Soon</span>
          </div>
        </div>
      </section>

      {/* Provider Benefits */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8">Why Top Providers Choose GrowthLink™</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold text-xl mb-3">Precision Matching</h4>
              <p className="text-blue-100">AI-powered algorithm matches your expertise with the right challenges, increasing your success rate by 3x</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="font-bold text-xl mb-3">Trust & Verification</h4>
              <p className="text-blue-100">Every engagement is Trust Ledger™ verified, ensuring secure payments and professional collaboration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="font-bold text-xl mb-3">Growth Acceleration</h4>
              <p className="text-blue-100">Access to enterprise clients and government projects that scale your business exponentially</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto py-12 px-4 md:px-8 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Unlock Your Growth Potential?</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Join the intelligence-verified marketplace where your expertise meets real-world impact
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/programs/provider-intelligence')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200"
            >
              Become a Provider
            </button>
            <button 
              onClick={() => navigate('/programs/provider-intelligence')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200"
            >
              Submit Your First Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500">
        <p className="text-sm">WinGrox AI — Engineering a World Where Growth Is Measured by Impact, Not Noise.</p>
      </footer>
    </div>
  );
};

export default GrowthLinkProviderMarketplace;