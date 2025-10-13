import React from 'react';

const GrowthLink: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-12 lg:px-32 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 mb-2">WinGrox AI GrowthLink</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">“Where Problems Find Their Perfect Solutions — Intelligently.”</h2>
          <p className="text-lg text-gray-600">The Future of Intelligent Matchmaking</p>
          <p className="text-md text-gray-500">“Don’t hunt for vendors. Diagnose your pain — and let intelligence find your perfect match.”</p>
          <p className="text-md text-gray-500">GrowthLink by WinGrox AI is the Intelligence-First Exchange connecting <span className="font-semibold text-blue-600">Seekers</span> and <span className="font-semibold text-indigo-600">Providers</span> through Pain Signatures and Capability Signatures.</p>
          <div className="flex gap-4 mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow" onClick={() => window.location.href = 'http://localhost:3000/programs/growth-link/pain-discovery'}>Post a Challenge →</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow" onClick={() => window.location.href = 'http://localhost:3000/programs/join-as-provider'}>Pitch Your Solution →</button>
          </div>
        </div>
        {/* Visual Split Animation Idea */}
        <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-gray-200 via-blue-100 to-white animate-pulse rounded-l-2xl z-0"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-yellow-100 via-indigo-100 to-white animate-pulse rounded-r-2xl z-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 rounded-full p-8 shadow-xl animate-pulse">
              <span className="text-white text-2xl font-bold">GrowthLink<br/>Powered by WinGrox AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">The Problem — A World of Broken Connections</h3>
          <p className="text-md text-gray-600 mb-2">“The innovation economy runs on noise, not intelligence.”</p>
          <p className="text-md text-gray-500 mb-2">Every week thousands of RFPs fly out and millions of cold emails come in — but 95% of matches fail. Not because ideas are bad — but because Seekers and Providers don’t understand each other.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-xl shadow">
              <h4 className="font-semibold text-blue-700 mb-1">For Seekers</h4>
              <ul className="list-disc ml-4 text-sm text-gray-700">
                <li>Endless pitches, no clarity</li>
                <li>Hard to verify who’s credible</li>
                <li>Projects derail mid-way</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl shadow">
              <h4 className="font-semibold text-indigo-700 mb-1">For Providers</h4>
              <ul className="list-disc ml-4 text-sm text-gray-700">
                <li>No access to real problems</li>
                <li>Hard to get noticed by decision-makers</li>
                <li>Brilliant ideas die unseen</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold shadow">Trust • Context • Clarity — Missing</span>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-blue-800 mb-2">The WinGrox Solution — GrowthLink</h3>
        <p className="text-md text-gray-700 mb-2">“Where Credibility Meets Opportunity.”</p>
        <p className="text-md text-gray-500 mb-2">GrowthLink™ is the intelligence layer that transforms chaos into clarity. Every match follows our verified 4-brain framework:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-col gap-2">
            <span className="font-bold text-blue-700">1️⃣ Pain Discovery Engine</span>
            <span className="text-sm text-gray-700">Finds the real root of a challenge</span>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow flex flex-col gap-2">
            <span className="font-bold text-indigo-700">2️⃣ Persona Navigator</span>
            <span className="text-sm text-gray-700">Understands the people involved</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-col gap-2">
            <span className="font-bold text-blue-700">3️⃣ Pain Intelligence Hub</span>
            <span className="text-sm text-gray-700">Maps fit providers from a global database</span>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow flex flex-col gap-2">
            <span className="font-bold text-indigo-700">4️⃣ Trust Ledger</span>
            <span className="text-sm text-gray-700">Verifies every milestone and outcome</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow inline-block text-center" onClick={() => window.location.href = 'http://localhost:3000/programs/growth-link/pain-discovery'}>Start Your Pain Discovery →</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow inline-block text-center" onClick={() => window.location.href = 'http://localhost:3000/programs/join-as-provider'}>Join as Verified Provider →</button>
        </div>
      </section>

      {/* Intelligence Flow Section */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-2">How the Intelligence Flow Works</h3>
        <ol className="list-decimal ml-6 text-gray-700">
          <li>Pain Discovery (from Seeker)</li>
          <li>Pain Intelligence Hub (decodes root cause)</li>
          <li>AI Matchmaker Engine (scores fit & trust)</li>
          <li>Provider Engagement (curated solution shortlist)</li>
          <li>Smart Contract + Trust Ledger (validates milestones)</li>
          <li>Outcome Verified → Monetization Triggered</li>
        </ol>
        <div className="mt-4 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold shadow">“Stop guessing. Start matching — intelligently.”</span>
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow" onClick={() => window.location.href = 'http://localhost:3000/programs/growth-link/pain-discovery'}>Post a Challenge →</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow inline-block text-center" onClick={() => window.location.href = 'http://localhost:3000/programs/join-as-provider'}>Join as Provider →</button>
        </div>
      </section>

      {/* Seekers & Providers Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-blue-100">
          <h4 className="text-lg font-bold text-blue-700 mb-2">FOR SEEKERS — Describe Your Challenge. Get Precision Matches.</h4>
          <p className="text-md text-gray-600 mb-2">“Turn your pain into a Pain Signature — and let intelligence find your cure.”</p>
          <ol className="list-decimal ml-6 text-gray-700 mb-2">
            <li>Post Your Challenge (Free Diagnostic)</li>
            <li>AI Diagnostic & Pain Signature Creation</li>
            <li>Intelligent Matchmaking</li>
            <li>Smart Contract + Trust Ledger™</li>
          </ol>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow self-start" onClick={() => window.location.href = 'http://localhost:3000/programs/growth-link/pain-discovery'}>Post a Challenge → Free AI Diagnostic</button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-indigo-100">
          <h4 className="text-lg font-bold text-indigo-700 mb-2">FOR PROVIDERS — Pitch with Intelligence, Not Guesswork.</h4>
          <p className="text-md text-gray-600 mb-2">“Be discovered not because you shout louder — but because you fit smarter.”</p>
          <ol className="list-decimal ml-6 text-gray-700 mb-2">
            <li>Create Your Capability Signature™</li>
            <li>Get Matched to Real Problems</li>
            <li>Deliver & Earn with Trust</li>
          </ol>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow self-start inline-block text-center" onClick={() => window.location.href = 'http://localhost:3000/programs/join-as-provider'}>Join as Verified Provider →</button>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-blue-700 mb-2">The GrowthLink Advantage & Global Impact Vision</h3>
        <p className="text-md text-gray-600 mb-2">“Where Every Challenge Finds Its Precise Solver.”</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow" onClick={() => window.location.href = 'http://localhost:3000/programs/growth-link/pain-discovery'}>Post a Challenge →</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow" onClick={() => window.location.href = 'http://localhost:3000/programs/join-as-provider'}>Join as Provider →</button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow">Become Sponsor →</button>
        </div>
        <p className="mt-6 text-xs text-gray-400">WinGrox AI — Engineering a World Where Growth Is Measured by Impact, Not Noise.</p>
      </section>
    </div>
  );
};

export default GrowthLink;
