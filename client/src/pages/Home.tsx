import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
              WinGroX AI
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-5 text-blue-100">
              Your AI-Powered Growth Partner
            </h2>
            <p className="text-base md:text-lg mb-8 text-blue-100 max-w-xl mx-auto leading-relaxed">
              Unlock your potential with the world's first
              <span className="font-medium text-cyan-300"> Growth Intelligence Studio</span>.
              We create your personalized path to success.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <Link to="/assessment-selection" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  Start Free Assessment
                </Link>
                <Link to="/products" className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  Explore Our Products
                </Link>
                <Link to="/marketplace" className="bg-transparent border-2 border-cyan-500 hover:bg-cyan-900/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                  Meet Growth Architects
                </Link>
              </div>
            </div>
          </div>
          {/* Visual element resembling an AI orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        </div>
      </section>

      {/* Why WinGroX AI Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Why Choose WinGroX AI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">AI-Powered Intelligence</h3>
            <p className="text-gray-600">Our advanced algorithms analyze your unique situation to provide personalized growth strategies.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Proven Methodologies</h3>
            <p className="text-gray-600">Built on data from 10M+ growth journeys with pattern identification and predictive analytics.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Actionable Outcomes</h3>
            <p className="text-gray-600">Go beyond insights to executable blueprints and step-by-step guidance for real results.</p>
          </div>
        </div>
      </section>

      {/* Featured By Section - Social Proof */}
      <section className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Trusted By Industry Leaders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <div className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="h-8 bg-gray-200 rounded-md w-32"></div>
          </div>
          <div className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="h-8 bg-gray-200 rounded-md w-32"></div>
          </div>
          <div className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="h-8 bg-gray-200 rounded-md w-32"></div>
          </div>
          <div className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="h-8 bg-gray-200 rounded-md w-32"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Ready to Transform Your Growth Journey?</h2>
        <p className="mb-8 max-w-2xl mx-auto text-center">
          Discover your personalized roadmap with our AI-powered assessment and unlock insights 
          that will guide your next breakthrough.
        </p>        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment-selection" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
              Take Individual Assessment
            </Link>
            <Link to="/products" className="bg-blue-900 text-white hover:bg-blue-800 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
              Explore Our Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
