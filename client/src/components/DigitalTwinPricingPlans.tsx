import React, { useState } from 'react';
import axios from 'axios';
import { saveUserPlan } from '../services/userPlanService';

interface DigitalTwinPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  priceValue?: number;
  currency?: string;
  badge?: string;
  description: string;
  features: string[];
  benefits?: string[];
  bestFor?: string;
  highlighted?: boolean;
  isFree?: boolean;
}

interface DigitalTwinPricingPlansProps {
  userId?: string;
  assessmentType?: string;
  onPlanSelect?: (planId: string) => void;
  hasCompletedAssessment?: boolean;
}

const DigitalTwinPricingPlans: React.FC<DigitalTwinPricingPlansProps> = ({ userId, assessmentType, onPlanSelect, hasCompletedAssessment }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle plan selection or enrollment
  const handleBuyPlan = async (planId: string) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // If onPlanSelect callback is provided, use it (for pre-assessment plan selection)
      if (onPlanSelect) {
        onPlanSelect(planId);
        setIsProcessing(false);
        return;
      }
      
      // Otherwise, navigate to enrollment page (for post-assessment enrollment)
      window.location.href = `/digital-twin-enrollment?plan=${planId}`;
    } catch (error) {
      alert('Unable to proceed. Please try again later.');
      setIsProcessing(false);
    }
  };

  const plans: DigitalTwinPlan[] = [
    {
      id: 'digital-twin-free',
      title: 'DIGITAL TWIN STARTER',
      subtitle: 'Discover Yourself. Begin Your Reinvention.',
      price: 'FREE',
      badge: 'Current Plan',
      description: 'This free experience helps you decode who you are today so you can start moving toward who you want to become. Get a powerful snapshot of your strengths, energy patterns, and direction.',
      features: [
        'Your personalized Digital Twin (Starter Version)',
        'Your Top Identity Theme based on your responses',
        'Your Hidden Motivation Insight',
        'One Future-Self Prediction',
        'Your Energy & Alignment Score',
        'Three micro-actions you can do immediately'
      ],
      isFree: true
    },
    {
      id: 'silver-identity',
      title: 'SILVER',
      subtitle: 'Identity Alignment Breakthrough',
      price: '₹4,999',
      priceValue: 4999,
      currency: 'INR',
      badge: 'Quick Clarity',
      description: 'Entry-level premium experience: clarity + direction + quick wins',
      features: [
        'Full Digital Twin Intelligence Report (30+ pages personalized)',
        'Top 3 Strength Signatures + 3 Growth Limiters decoded',
        'Purpose & Alignment Blueprint',
        'Micro-Action Roadmap: next 7 days + 30 days',
        'Career Path Fit Scoring — Top 3 roles suited to you'
      ],
      benefits: [
        'Know EXACTLY who you are becoming',
        'Remove confusion about your next step',
        'Build clarity, confidence & self-belief'
      ],
      bestFor: 'Fast clarity and direction seekers'
    },
    {
      id: 'gold-reinvention',
      title: 'GOLD',
      subtitle: 'Career Reinvention Accelerator',
      price: '₹24,999',
      priceValue: 24999,
      currency: 'INR',
      badge: 'Most Popular',
      highlighted: true,
      description: 'Deep guided transition into your next role or version',
      features: [
        'Everything in Silver',
        'Leadership Identity Archetype Mapping',
        'Hidden Passions + Future Self Vision Canvas',
        'Full Reinvention Plan — 90 Days Blueprint',
        '1:1 AI-driven Conversational Coaching (Bi-weekly sessions)',
        'Personalized Visibility & Influence Strategy',
        'Stress Resilience & Energy Optimization Compass',
        'Skill-Gap Analysis + Learning Pathway'
      ],
      benefits: [
        'Move from stuck → visible progress within 4–6 weeks',
        'Discover your unique market value',
        'Position yourself for promotion or pivot'
      ],
      bestFor: 'Ambitious professionals preparing a big move'
    },
    {
      id: 'platinum-mastery',
      title: 'PLATINUM',
      subtitle: 'Elite Transformation & Leadership Mastery',
      price: '₹75,000',
      priceValue: 75000,
      currency: 'INR',
      badge: 'Elite',
      description: 'Your Digital Twin evolves into your Performance Co-Pilot',
      features: [
        'Everything in Gold',
        'Leadership Brand Blueprint (3–5-year arc)',
        'Executive Presence Intelligence Training',
        'Personalized Achievement System – weekly accountability',
        'Network & Influence Activation Plan',
        '1:1 Human Expert Strategy Coaching (Month-end review)',
        'Legacy Mapping (impact, brand, future identity)',
        'LinkedIn transformation — profile + content triggers',
        'Success Dashboard showing monthly progress & mindset shift'
      ],
      benefits: [
        'Shift from employee to industry-recognized leader',
        'Gain visibility, influence & exponential career growth',
        'Future-proof your identity & earning potential'
      ],
      bestFor: 'High potentials, future CXOs, transformation seekers'
    }
  ];

  return (
    <div className="digital-twin-pricing-plans py-4 px-4">
      
      {/* Magazine Showcase - Prominent CTA */}
      <div className="mb-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              
              <h3 className="text-3xl md:text-4xl font-black mb-4 drop-shadow-lg">
                Explore Our Full Program Magazines
              </h3>
              <p className="text-lg text-purple-100 leading-relaxed max-w-3xl mx-auto mb-2">
                Dive deep into each program — see curriculum, success stories, and transformation roadmaps.
              </p>
              <p className="text-base text-yellow-300 font-bold animate-pulse">
                ⚡ Click any card below to open the complete program guide!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Silver Magazine Card */}
              <div className="group relative overflow-hidden rounded-2xl border-3 border-white/30 hover:border-white/60 transition-all bg-gradient-to-br from-gray-100 to-gray-200">
                <a
                  href="https://heyzine.com/flip-book/557e60d24e.html#page/2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 hover:shadow-2xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20 group-hover:from-gray-400/30 group-hover:to-gray-600/30 transition-all"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
                        <span className="text-3xl">🥈</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-black text-gray-800">View Magazine</span>
                      </div>
                    </div>
                    <h4 className="font-black text-2xl text-gray-900 mb-2">Silver Program</h4>
                    <p className="text-sm text-gray-700 font-semibold mb-3">Identity Alignment Breakthrough</p>
                    <p className="text-3xl font-black text-gray-800 mb-4">₹4,999</p>
                  </div>
                </a>
                <div className="relative z-10 px-6 pb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPlan('silver-identity');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold rounded-lg transition-all hover:shadow-xl text-sm"
                  >
                    🚀 Enroll Now
                  </button>
                </div>
              </div>

              {/* Gold Magazine Card - Enhanced */}
              <div className="group relative overflow-hidden rounded-2xl border-4 border-yellow-400 hover:border-yellow-300 transition-all bg-gradient-to-br from-yellow-100 to-orange-200 transform scale-105 md:scale-110">
                <div className="absolute top-3 right-3 z-20">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                    🔥 MOST POPULAR
                  </span>
                </div>
                <a
                  href="https://heyzine.com/flip-book/d9de1ac3f8.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 hover:shadow-2xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 group-hover:from-yellow-400/30 group-hover:to-orange-500/30 transition-all"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-xl ring-2 ring-yellow-300">
                        <span className="text-3xl">🥇</span>
                      </div>
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full ring-2 ring-orange-400">
                        <span className="text-xs font-black text-orange-800">View Magazine</span>
                      </div>
                    </div>
                    <h4 className="font-black text-2xl text-orange-900 mb-2">Gold Program</h4>
                    <p className="text-sm text-orange-800 font-bold mb-3">Career Reinvention Accelerator</p>
                    <p className="text-3xl font-black text-orange-900 mb-4">₹24,999</p>
                  </div>
                </a>
                <div className="relative z-10 px-6 pb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPlan('gold-reinvention');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all hover:shadow-xl hover:scale-105 text-sm"
                  >
                    🚀 Enroll Now
                  </button>
                </div>
              </div>

              {/* Platinum Magazine Card */}
              <div className="group relative overflow-hidden rounded-2xl border-3 border-white/30 hover:border-white/60 transition-all bg-gradient-to-br from-purple-100 to-pink-200">
                <a
                  href="https://heyzine.com/flip-book/6842909c74.html#page/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 hover:shadow-2xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <span className="text-3xl">💎</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-black text-purple-800">View Magazine</span>
                      </div>
                    </div>
                    <h4 className="font-black text-2xl text-purple-900 mb-2">Platinum Program</h4>
                    <p className="text-sm text-purple-700 font-semibold mb-3">Elite Transformation & Leadership</p>
                    <p className="text-3xl font-black text-purple-900 mb-4">₹75,000</p>
                  </div>
                </a>
                <div className="relative z-10 px-6 pb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPlan('platinum-mastery');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all hover:shadow-xl text-sm"
                  >
                    🚀 Enroll Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Subheading */}
      {!hasCompletedAssessment && (
        <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
          Premium Growth Pathways to Choose From
        </h3>
      </div>
      )}

      {/* Plans Grid */}
      {!hasCompletedAssessment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
              plan.highlighted
                ? 'ring-4 ring-purple-500 shadow-2xl scale-105 lg:scale-110'
                : plan.isFree
                ? 'border-2 border-gray-300 shadow-md hover:shadow-lg'
                : 'border-2 border-gray-200 shadow-md hover:shadow-xl hover:scale-105'
            } ${selectedPlan === plan.id ? 'ring-4 ring-blue-500' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {/* Badge */}
            {plan.badge && (
              <div
                className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                    : plan.isFree
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {plan.badge}
              </div>
            )}

            {/* Card Content */}
            <div
              className={`p-8 flex-grow flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'
                  : plan.isFree
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50'
                  : 'bg-white'
              }`}
            >
              {/* Title & Subtitle */}
              <div className="mb-4">
                <h3
                  className={`text-2xl font-black mb-1 ${
                    plan.highlighted
                      ? 'text-purple-900'
                      : plan.isFree
                      ? 'text-green-900'
                      : 'text-gray-900'
                  }`}
                >
                  {plan.title}
                </h3>
                <p
                  className={`text-base font-semibold ${
                    plan.highlighted
                      ? 'text-purple-700'
                      : plan.isFree
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {plan.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div
                  className={`text-5xl font-black ${
                    plan.highlighted
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
                      : plan.isFree
                      ? 'text-green-600'
                      : 'text-gray-900'
                  }`}
                >
                  {plan.price}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{plan.description}</p>

              {/* Features Section */}
              <div className="mb-6 flex-grow">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  What You Get
                </h4>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className={`mr-3 mt-0.5 flex-shrink-0 ${
                          plan.highlighted
                            ? 'text-purple-600'
                            : plan.isFree
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits Section */}
              {plan.benefits && plan.benefits.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wide flex items-center">
                    <span className="mr-2">🎯</span>
                    {plan.isFree ? 'Immediate Benefits' : 'Game-Changing Benefits'}
                  </h4>
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2 flex-shrink-0">➡</span>
                        <span className="text-blue-900 text-sm font-medium leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best For */}
              {plan.bestFor && (
                <div className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-gray-900">Perfect for:</span> {plan.bestFor}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              {!plan.isFree && (
                <button
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white hover:shadow-2xl hover:scale-105'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black hover:shadow-xl'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyPlan(plan.id);
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : (onPlanSelect ? 'Select & Continue' : 'Enroll for this')}
                </button>
              )}

              {plan.isFree && (
                <button
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    onPlanSelect 
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer hover:shadow-xl' 
                      : 'bg-green-100 text-green-800 border-2 border-green-300'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (onPlanSelect) {
                      e.stopPropagation();
                      handleBuyPlan(plan.id);
                    }
                  }}
                  disabled={isProcessing || !onPlanSelect}
                >
                  {onPlanSelect ? (isProcessing ? 'Processing...' : 'Start Free Assessment') : '✓ You\'re Viewing This Now'}
                </button>
              )}
            </div>
          </div>
          ))}
        </div>
      )}

     
    </div>
  );
};

export default DigitalTwinPricingPlans;
