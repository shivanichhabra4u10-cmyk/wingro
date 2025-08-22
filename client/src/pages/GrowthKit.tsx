import React from 'react';

const GrowthKit: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 max-w-4xl mx-auto relative overflow-hidden">
    {/* Header section with blue gradient background */}
    <div className="relative rounded-2xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-8 py-10">
        {/* Visual orb elements for consistency */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        <h1 className="text-3xl font-bold mb-4 text-white z-10 relative">Growth Kits</h1>
        <p className="mb-0 text-blue-100 text-lg z-10 relative">Explore curated toolkits and resources to accelerate your business and personal growth. Download actionable guides, templates, and checklists.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-b from-gray-50 to-blue-50 rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Startup Growth Kit</h2>
        <p className="text-gray-600 mb-4">Everything you need to scale your startup: growth experiments, OKR templates, and more.</p>
        <button className="mt-auto bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition-all">Download Kit</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Personal Productivity Kit</h2>
        <p className="text-gray-600 mb-4">Boost your productivity with daily planners, habit trackers, and focus tools.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Team Collaboration Kit</h2>
        <p className="text-gray-600 mb-4">Templates and guides for effective meetings, project management, and team alignment.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Marketing Launch Kit</h2>
        <p className="text-gray-600 mb-4">Step-by-step launch plans, email templates, and campaign checklists for your next big launch.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
      </div>
    </div>
  </div>
);

export default GrowthKit;
