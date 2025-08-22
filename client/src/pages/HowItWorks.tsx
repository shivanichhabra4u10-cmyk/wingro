import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {

  return (
    <div className="bg-white min-h-screen flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
              How WinGroX AI Works
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Our systematic approach combines AI-driven insights with personalized execution plans to unlock your growth potential
            </p>
          </div>
          {/* Visual element resembling an AI orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        </div>
      </section>

      {/* The Process Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800">Our 4-Step Growth Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all relative">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Diagnose with WinGroX Navigator</h3>
            <p className="text-gray-600">Begin by uncovering your growth blockers—career, startup, business, or clarity through AI self-assessment and pain point mapping.</p>
            {/* Connection line to next step (visible on desktop) */}
            <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-cyan-600"></div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all relative">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Map Challenges with Pain Intelligence Hub</h3>
            <p className="text-gray-600">Built on 10M+ real-world friction points from startups, careers, and businesses with pattern identification and predictive failure alerts.</p>
            {/* Connection line to next step (visible on desktop) */}
            <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-cyan-600"></div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all relative">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Predict Best Pathways</h3>
            <p className="text-gray-600">AI doesn't just guess—it simulates persona-aligned roadmaps, GTM blueprints, and strategic frameworks tailored to your unique situation.</p>
            {/* Connection line to next step (visible on desktop) */}
            <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-cyan-600"></div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">4</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Execute with Precision</h3>
            <p className="text-gray-600">From clarity to conversion without delay through pre-built blueprints, automated guides, and real-time feedback loops.</p>
          </div>
        </div>

        {/* Process visualization */}
        <div className="mt-16 p-6 bg-blue-50 rounded-xl">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Our Intelligent Growth Cycle</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Assessment</h4>
              <p className="text-sm text-gray-600">AI-powered discovery of growth blockers and opportunities</p>
            </div>
            
            <div className="h-0 md:h-px w-12 md:w-12 bg-blue-300 rotate-0 md:rotate-0 my-4 md:my-0"></div>
            
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-green-400 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Blueprint</h4>
              <p className="text-sm text-gray-600">Personalized growth roadmap with step-by-step action plans</p>
            </div>
            
            <div className="h-0 md:h-px w-12 md:w-12 bg-blue-300 rotate-0 md:rotate-0 my-4 md:my-0"></div>
            
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-400 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Execution</h4>
              <p className="text-sm text-gray-600">Guided implementation with feedback loops and intelligent adaptations</p>
            </div>
          </div>
        </div>
      </section>      {/* Platform Features */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">WinGroX AI Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
              <h3 className="font-bold text-lg">AI Assessment Engine</h3>
            </div>
            <p className="text-gray-600">Sophisticated diagnostic tools that identify your unique growth blockers with prescriptive accuracy</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M9.5 2.672a.5.5 0 1 1 1 0V5.5a.5.5 0 0 1-.5.5H5.693l3.608 3.608a.5.5 0 1 1-.708.708L4.5 6.723V9.5a.5.5 0 1 1-1 0V6.5a.5.5 0 0 1 .5-.5h4.193L4.585 2.392a.5.5 0 1 1 .708-.708L9.5 5.891V2.672z"/>
              </svg>
              <h3 className="font-bold text-lg">Growth Navigator</h3>
            </div>
            <p className="text-gray-600">Interactive roadmaps that adapt to your progress with personalized next steps and milestone tracking</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9h-5v5h5v-5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z"/>
              </svg>
              <h3 className="font-bold text-lg">Blueprint Library</h3>
            </div>
            <p className="text-gray-600">Curated collection of proven frameworks, templates, and strategies for immediate implementation</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
              <h3 className="font-bold text-lg">Smart Execution Dashboard</h3>
            </div>
            <p className="text-gray-600">Visual progress tracking with intelligent reminders and adaptive recommendations</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
              </svg>
              <h3 className="font-bold text-lg">Growth Architect Sessions</h3>
            </div>
            <p className="text-gray-600">Personalized 1:1 guidance with expert coaches who help translate insights into real-world results</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-4 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                <path d="M7 7V1.414a1 1 0 0 1 2 0V2h5a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L14.8 5.6a1 1 0 0 1-.8.4H9v10H7v-5H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7h5zm1 3V8H2l-.75 1L2 10h6zm0-5h6l.75-1L14 3H8v2z"/>
              </svg>
              <h3 className="font-bold text-lg">Intelligent Community</h3>
            </div>
            <p className="text-gray-600">Matched peer groups and mentors based on your growth profile for targeted networking and support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience Growth Intelligence?</h2>
        <p className="mb-8 max-w-2xl mx-auto">Take our free assessment to discover your unique growth profile and personalized recommendations.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">          <Link to="/contact" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Contact Us
          </Link><Link to="/products" className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Explore Our Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
