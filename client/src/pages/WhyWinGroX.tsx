import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WhyWinGroX: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    import('../data/testimonials.json').then((mod) => setTestimonials(mod.default || mod));
  }, []);

  return (
    <div className="flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
            Why Choose WinGroX AI?
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Breakthroughs aren't random—they're engineered. Discover how our Growth Intelligence Studio systematically transforms your potential into achievement.
          </p>
        </div>
        {/* Visual element resembling an AI orb */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>

      {/* Key Benefits Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Our Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Personalized Recommendations</h3>
            <p className="text-gray-600">Tailored to your career, business, or organizational needs</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <div className="text-3xl mb-4">🧭</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Predictive Growth Roadmaps</h3>
            <p className="text-gray-600">Forecast challenges before they happen</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <div className="text-3xl mb-4">🧩</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Plug-and-Play Solutions</h3>
            <p className="text-gray-600">Pre-built strategic frameworks and execution templates</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <div className="text-3xl mb-4">♾️</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Lifecycle Intelligence</h3>
            <p className="text-gray-600">Supports every life stage—from school to startup to retirement</p>
          </div>
        </div>
      </section>

      {/* Why Growth Needs Intelligence Section */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Growth Needs Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <div className="text-xl italic mb-4 text-cyan-300">"I'm stuck in my career."</div>
            <div className="font-semibold mb-2">Not failure, but a lack of Growth Intelligence.</div>
            <p className="text-gray-300">Our Pain Intelligence Engine finds your personalized path.</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <div className="text-xl italic mb-4 text-cyan-300">"My startup has funding but no direction."</div>
            <div className="font-semibold mb-2">Capital without clarity leads to chaos.</div>
            <p className="text-gray-300">Our Clarity Engines convert money into momentum.</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <div className="text-xl italic mb-4 text-cyan-300">"We've scaled but lost culture."</div>
            <div className="font-semibold mb-2">Growth should amplify purpose—not dilute it.</div>
            <p className="text-gray-300">Our Archetype Maps bring meaning back to your mission.</p>
          </div>
        </div>
      </section>      {/* What Makes WinGroX Powerful */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">What Makes WinGroX AI Powerful?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-3 text-cyan-600">Human-Centric Intelligence</h3>
            <p className="text-gray-600">Personalized growth maps for each life stage, blending emotional intelligence with machine precision</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-3 text-cyan-600">Execution Over Advice</h3>
            <p className="text-gray-600">Real implementation with dashboards, coaching, and actionable blueprints—not just recommendations</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-3 text-cyan-600">AI with Soul</h3>
            <p className="text-gray-600">Technology that understands context, purpose, and human nuance in every growth journey</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section (Optional) */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
              {t.type === 'comment' ? (
                <>
                  <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-600">{t.role}</p>
                    </div>
                  </div>
                </>
              ) : t.type === 'video' ? (
                <>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <iframe
                      src={t.videoUrl}
                      title={t.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-48 rounded"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-600">{t.role}</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Accelerate Your Growth?</h2>
        <p className="mb-8 max-w-2xl mx-auto">Take the first step with our AI-powered assessment and discover your personalized growth path.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/assessment" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Start Free Assessment
          </Link>
          <Link to="/growth-plans" className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg inline-block transition-all duration-300">
            Explore Growth Plans
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WhyWinGroX;
