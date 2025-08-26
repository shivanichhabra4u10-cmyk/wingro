import React, { useState } from 'react';
import axios from 'axios';
import { saveUserPlan } from '../services/userPlanService';

interface Plan {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  recommended?: boolean;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'outlined';
}

interface TieredPlansProps {
  plans?: Plan[];
  userId?: string;
  assessmentType?: string;
}

const TieredPlans: React.FC<TieredPlansProps> = ({ plans = defaultPlans, userId, assessmentType }) => {
  // Stripe checkout handler
  const handleBuyPlan = async (planId: string) => {
    try {
      // Save user plan before redirecting to Stripe
      if (userId && assessmentType) {
        await saveUserPlan(userId, planId, assessmentType);
      }
      // Use correct backend port and endpoint for plan checkout
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/plan-session`;
      const response = await axios.post(apiUrl, { planId });
      // Backend returns { url: session.url }
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      alert('Unable to start checkout. Please try again later.');
    }
  };
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  return (
    <div className="tiered-plans py-8">
      <h2 className="text-3xl font-bold mb-4">Select Your Growth Path</h2>
      <p className="text-gray-600 mb-8">Choose the plan that best fits your career goals and development needs.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`rounded-lg border overflow-hidden h-full flex flex-col ${
              plan.recommended ? 'border-yellow-400 shadow-md' : 'border-gray-200'
            } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.recommended && (
              <div className="bg-yellow-50 text-center py-2 font-medium text-yellow-800">
                Recommended
              </div>
            )}
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-center mb-4">
                {plan.id === 'silver' && (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    ★
                  </div>
                )}
                {plan.id === 'gold' && (
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                )}
                {plan.id === 'diamond' && (
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                    ◆
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2">{plan.title}</h3>
              <p className="text-gray-500 text-center mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 rounded-lg transition-colors ${
                  plan.recommended ? 
                  'bg-yellow-500 hover:bg-yellow-600 text-white' : 
                  plan.id === 'diamond' ?
                  'bg-purple-600 hover:bg-purple-700 text-white' :
                  'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleBuyPlan(plan.id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contact Us Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-800">Need a custom solution?</h3>
            <p className="text-gray-600 mt-2">
              Our growth specialists can help design a program that fits your exact needs. 
              Reach out for a free consultation and learn how we can tailor our approach to your unique situation.
            </p>
          </div>
          <div className="md:w-1/3 md:text-right md:pl-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:shadow-md transition-all font-medium">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default plan data
const defaultPlans: Plan[] = [
  {
    id: 'silver',
    title: 'Silver Plan',
    description: 'Foundation Building',
    features: [
      'AI-guided self-assessment',
      'Basic skill roadmap',
      'Community access',
      'Email support',
      'Digital resource library'
    ],
    icon: 'star',
    buttonText: 'Get Started'
  },
  {
    id: 'gold',
    title: 'Gold Plan',
    description: 'Accelerated Growth',
    features: [
      'Everything in Silver Plan',
      '1:1 AI coaching sessions',
      'Personalized learning path',
      'Priority support',
      'Monthly progress tracking'
    ],
    icon: 'bolt',
    recommended: true,
    buttonText: 'Select Plan'
  },
  {
    id: 'diamond',
    title: 'Diamond Plan',
    description: 'Elite Transformation',
    features: [
      'Everything in Gold Plan',
      'Executive AI mentorship',
      'Custom growth strategy',
      'VIP network access',
      'Quarterly career roadmapping'
    ],
    icon: 'diamond',
    buttonText: 'Upgrade Now'
  }
];

export default TieredPlans;
