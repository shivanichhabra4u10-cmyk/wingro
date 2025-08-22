import React from 'react';

const BrandingKit: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 max-w-6xl mx-auto relative overflow-hidden flex flex-col space-y-12">
    {/* Header section with blue gradient background */}
    <section className="relative rounded-2xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-8 py-12 md:py-16">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white z-10 relative text-center drop-shadow">Branding & Growth Kits</h1>
        <p className="mb-0 text-blue-100 text-lg md:text-xl z-10 relative text-center max-w-2xl mx-auto">Access ready-to-use branding assets, templates, and growth kits to elevate your business presence and accelerate your marketing.</p>
      </div>
    </section>

    {/* Kits Grid Section */}
    <section className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Available Kits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all flex flex-col">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="font-bold text-lg mb-2 text-blue-700">Logo & Visual Identity Kit</h3>
          <p className="text-gray-600 mb-4">Download logo files, color palettes, and typography guidelines to ensure a consistent brand image.</p>
          <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all flex flex-col">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="font-bold text-lg mb-2 text-blue-700">Social Media Templates</h3>
          <p className="text-gray-600 mb-4">Editable templates for Instagram, LinkedIn, and more. Make your posts stand out and drive engagement.</p>
          <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all flex flex-col">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="font-bold text-lg mb-2 text-blue-700">Pitch Deck & Presentation Kit</h3>
          <p className="text-gray-600 mb-4">Professional slide templates and pitch deck frameworks for fundraising, sales, and more.</p>
          <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all flex flex-col">
          <div className="text-3xl mb-4">🚀</div>
          <h3 className="font-bold text-lg mb-2 text-blue-700">Growth Campaign Kit</h3>
          <p className="text-gray-600 mb-4">Ready-to-launch campaign checklists, email templates, and ad creatives for rapid growth.</p>
          <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Download Kit</button>
        </div>
      </div>
    </section>

    {/* CTA Section for consistency */}
    <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center mt-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
      <p className="mb-8 max-w-2xl mx-auto">Download your kit and start building a standout brand presence today.</p>
      <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">Get Started</button>
    </section>
  </div>
);

export default BrandingKit;
