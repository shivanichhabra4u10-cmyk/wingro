import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Who We Are
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              WinGroX AI is the world's first Growth Intelligence Studio, founded on the belief that every human has untapped potential waiting to be systematically unlocked.
            </p>
          </div>
          {/* Visual element resembling an AI orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        </div>
      </section>

      {/* Our Pillars Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Our Foundation</h2>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-10">
          We combine cutting-edge artificial intelligence with deep human psychology to create personalized growth journeys for individuals, startups, and organizations across every life stage.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">🎯</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Our Mission</h3>
            <p className="text-gray-600">To engineer systematic breakthroughs for every human being, replacing random growth with intelligent, predictable transformation.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">🔬</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Our Approach</h3>
            <p className="text-gray-600">We decode patterns from 10M+ growth journeys, predict challenges before they happen, and deliver actionable blueprints—not just advice.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">🌟</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Our Vision</h3>
            <p className="text-gray-600">A world where every person—from age 5 to 65—has access to their personalized growth intelligence and the tools to act on it.</p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Makes Us Different</h2>
        <p className="text-lg text-center max-w-2xl mx-auto mb-10 text-gray-300">
          We don't believe in one-size-fits-all solutions or generic motivational content.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">💡</div>
            <h4 className="text-xl font-semibold text-cyan-400 mb-3">Human-Centric AI</h4>
            <p className="text-gray-300">Technology that amplifies human potential rather than replacing it</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">📊</div>
            <h4 className="text-xl font-semibold text-cyan-400 mb-3">Execution Focus</h4>
            <p className="text-gray-300">Blueprints and tools, not just insights</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">🔄</div>
            <h4 className="text-xl font-semibold text-cyan-400 mb-3">Lifecycle Coverage</h4>
            <p className="text-gray-300">From childhood to retirement</p>
          </div>
        </div>
      </section>      {/* Our Team Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Our Team</h2>
        <p className="text-center max-w-2xl mx-auto mb-10 text-gray-600">
          We bring together experts in artificial intelligence, psychology, business strategy, and data science to create the most comprehensive growth intelligence platform.
        </p>
        
        {/* Team members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all text-center">
            <img src="/images/VijayJagannathan.jpg" alt="Vijay Jagannathan" className="w-24 h-24 mx-auto rounded-full object-cover mb-4" />
            <h3 className="font-bold text-lg mb-1">Vijay Jagannathan</h3>
            <p className="text-cyan-600 text-sm mb-3">Advisor</p>
            <p className="text-gray-600 text-sm">Brief description about the team member and their expertise in AI, psychology or business growth.</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all text-center">
            <img src="/images/KiranMakkar.jpg" alt="Kiran Makkar" className="w-24 h-24 mx-auto rounded-full object-cover mb-4" />
            <h3 className="font-bold text-lg mb-1">Kiran Makkar</h3>
            <p className="text-cyan-600 text-sm mb-3">Manager</p>
            <p className="text-gray-600 text-sm">Brief description about the team member and their expertise in AI, psychology or business growth.</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all text-center">
            <img src="/images/RavinderSoni.jpg" alt="Ravinder Soni" className="w-24 h-24 mx-auto rounded-full object-cover mb-4" />
            <h3 className="font-bold text-lg mb-1">Ravinder Soni</h3>
            <p className="text-cyan-600 text-sm mb-3">Position</p>
            <p className="text-gray-600 text-sm">Brief description about the team member and their expertise in AI, psychology or business growth.</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-blue-100 mb-4"></div>
            <h3 className="font-bold text-lg mb-1">Team Member</h3>
            <p className="text-cyan-600 text-sm mb-3">Position</p>
            <p className="text-gray-600 text-sm">Brief description about the team member and their expertise in AI, psychology or business growth.</p>
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Want to Learn More About WinGroX?</h2>
        <p className="mb-8 max-w-2xl mx-auto text-center">Have questions about our approach or how we can help you? Get in touch with our team.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/contact" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Contact Us
          </a>
          <a href="/how-it-works" className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Learn How It Works
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
