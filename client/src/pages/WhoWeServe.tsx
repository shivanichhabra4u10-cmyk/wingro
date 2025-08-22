import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WhoWeServe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individuals' | 'enterprises'>('individuals');

  return (
    <div className="flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200">
            Who We Serve
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Tailored growth intelligence for individuals and enterprises at every stage of their journey
          </p>
          
          {/* Tab switches at the hero level */}
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-lg">
            <button 
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'individuals' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('individuals')}
            >
              For Individuals
            </button>
            <button 
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'enterprises' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('enterprises')}
            >
              For Enterprises
            </button>
          </div>
        </div>
        {/* Visual elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>      {/* Main Content Section with Tabs */}
      <section className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300`}>
        {/* Individual Profile Cards - Visible when individuals tab is active */}
        <div className={`${activeTab === 'individuals' ? 'block' : 'hidden'}`}>
          <div className="p-8 bg-gradient-to-b from-indigo-50 to-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-800">Individual Growth Journeys</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
              Our personalized approach meets you where you are—whether you're looking for career advancement, personal development, or life transitions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🧒
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Curious Child (5–14 yrs)</h3>
                <p className="text-gray-600 mb-4">Addressing tantrums, screen addiction, imagination loss, and building foundational growth mindsets</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Attention and focus development</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Learning enthusiasm acceleration</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🧑‍🎓
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Teen (Grades 9–10)</h3>
                <p className="text-gray-600 mb-4">Resolving stream confusion, identity crises, and establishing direction during formative years</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Career path exploration</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Personal identity development</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🎓
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Schooler (Grades 11–12)</h3>
                <p className="text-gray-600 mb-4">Navigating career fog, exam burnout, and college/university transition challenges</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">College preparation strategy</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Academic performance optimization</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  👨‍💼
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Young Adult (18–30)</h3>
                <p className="text-gray-600 mb-4">Finding ROI on education, career direction, and addressing early professional challenges</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Career launch acceleration</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Professional skill development</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🧑‍🦳
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Mid-Life (30–60)</h3>
                <p className="text-gray-600 mb-4">Resolving identity crisis, career stagnation, and navigating significant life transitions</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Career pivots and advancement</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Leadership capability development</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  👴
                </div>
                <h3 className="font-bold text-xl mb-3 text-indigo-700">Post-Retirement (60+)</h3>
                <p className="text-gray-600 mb-4">Addressing loneliness, loss of meaning, and finding new purpose in later life stages</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Purpose rediscovery framework</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Legacy planning and fulfillment</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-t from-indigo-50 to-white border-t border-indigo-100">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">Individual Growth Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-lg mb-3 text-indigo-600">Career Professionals</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Unlock targeted career advancement strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Identify and overcome workplace growth blockers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Build leadership capabilities with personalized roadmaps</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-lg mb-3 text-indigo-600">Entrepreneurs</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Navigate from idea to scalable business model</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Access proven frameworks for early-stage growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Avoid common pitfalls with predictive intelligence</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-lg mb-3 text-indigo-600">Personal Growth Seekers</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Develop clear vision and purpose alignment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Build better habits with AI-driven accountability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Overcome personal blockers with targeted strategies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enterprise Profile Cards - Visible when enterprises tab is active */}
        <div className={`bg-gradient-to-r from-slate-900 to-indigo-900 ${activeTab === 'enterprises' ? 'block' : 'hidden'}`}>
          <div className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-cyan-400">Enterprise Growth Solutions</h2>
            <p className="text-blue-100 text-center max-w-3xl mx-auto mb-10">
              Comprehensive growth intelligence systems designed for teams, organizations and enterprises of all sizes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🚀
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Early-Stage Startups</h3>
                <p className="text-blue-100 mb-4">Finding product-market fit clarity, implementing survival blueprints, and establishing growth foundations</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Product-market fit acceleration frameworks</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Founder team alignment and capability mapping</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  📈
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Growth-Stage SMEs</h3>
                <p className="text-blue-100 mb-4">Scaling operations without chaos, maintaining culture, and implementing sustainable growth models</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Operational scaling and team expansion blueprints</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Market expansion strategy optimization</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🏢
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Established Businesses</h3>
                <p className="text-blue-100 mb-4">Reinvention strategies, innovation capabilities, and adaptation to changing market conditions</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Innovation capability development programs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Team performance optimization frameworks</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🏆
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Enterprise Teams</h3>
                <p className="text-blue-100 mb-4">Leadership development, talent retention strategies, and cross-functional innovation programs</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Leadership development frameworks</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Talent retention and engagement systems</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  📚
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Educational Institutions</h3>
                <p className="text-blue-100 mb-4">Student growth frameworks, faculty development programs, and innovation curricula development</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Student success measurement systems</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Curriculum modernization frameworks</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all border border-gray-700">
                <div className="bg-blue-900/50 text-cyan-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl">
                  🏥
                </div>
                <h3 className="font-bold text-xl mb-3 text-cyan-400">Healthcare Organizations</h3>
                <p className="text-blue-100 mb-4">Staff wellbeing programs, patient-centered innovation, and operational efficiency improvements</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Staff burnout prevention frameworks</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-blue-100">Patient experience optimization systems</span>
                  </div>
                </div>
                <Link to="/assessment-selection" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg inline-block w-full text-center transition-all">
                  Explore Solutions
                </Link>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-blue-900/30 rounded-xl border border-blue-800/50">
              <h3 className="font-bold text-xl mb-4 text-center text-cyan-400">Enterprise Growth Solutions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 p-5 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-3 text-cyan-400">WinGroX Teams</h4>
                  <p className="text-blue-100 mb-4">
                    Collaborative growth intelligence platform for entire departments and organizations, with role-based insights and team alignment tools.
                  </p>
                  <Link to="/contact" className="inline-block px-5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all">
                    Request Demo
                  </Link>
                </div>
                
                <div className="bg-gray-800/40 p-5 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-3 text-cyan-400">WinGroX Enterprise API</h4>
                  <p className="text-blue-100 mb-4">
                    Integrate our growth intelligence capabilities directly into your existing workflow platforms and enterprise systems.
                  </p>
                  <Link to="/contact" className="inline-block px-5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Special Focus Areas - Updated with modern design */}
      <section className="bg-gradient-to-b from-white to-indigo-50 rounded-xl p-8 md:p-10 shadow-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 bg-gradient-to-r from-transparent to-indigo-200 flex-grow"></div>
            <h2 className="text-2xl md:text-3xl font-bold px-6 text-center text-gray-800">Special Focus Areas</h2>
            <div className="h-0.5 bg-gradient-to-l from-transparent to-indigo-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-indigo-700">Students & Young Professionals</h3>
              <p className="text-gray-600 mb-6">
                Early career navigation, skill development prioritization, and competitive advantage building through personalized growth intelligence frameworks tailored for emerging talent.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Career Mapping</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Skill Development</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Professional Identity</span>
              </div>
              <Link to="/assessment-selection" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-violet-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-violet-700">Educational Institutions</h3>
              <p className="text-gray-600 mb-6">
                Empower students with growth intelligence tools, predictive career pathing, and systematic skill development frameworks that complement academic curricula and prepare graduates for real-world success.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">Institution Programs</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">Student Support</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">Faculty Development</span>
              </div>
              <Link to="/assessment-selection" className="inline-flex items-center text-violet-600 font-medium hover:text-violet-800 transition-colors">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>      {/* Assessment CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-violet-900/10 opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Find your personalized growth path
              </h2>
              <p className="text-blue-100 mb-6">
                Take our free assessment to identify your unique growth challenges and get tailored recommendations for your specific situation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/assessment-selection" 
                  className="px-6 py-3 bg-white text-indigo-700 hover:bg-blue-50 hover:shadow-lg font-bold rounded-lg transition-all flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Take Free Assessment
                </Link>
                <Link 
                  to="/products" 
                  className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-medium rounded-lg transition-all flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                  Explore Products
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="px-6 py-3 bg-indigo-800/50 hover:bg-indigo-800/70 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How It Works
                </Link>
              </div>
            </div>
            <div className="hidden md:block w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-3xl"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-white opacity-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeServe;
