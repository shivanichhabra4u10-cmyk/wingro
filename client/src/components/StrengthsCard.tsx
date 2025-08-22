import React from 'react';

interface Strength {
  title: string;
  description: string;
  icon?: string;
}

interface StrengthsCardProps {
  strengths?: Strength[];
}

const StrengthsCard: React.FC<StrengthsCardProps> = ({ strengths = defaultStrengths }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-green-50 px-6 py-4 border-b border-green-100">
        <h3 className="text-gray-800 font-bold text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your Top 3 Strengths
        </h3>
      </div>
      
      {/* Card Body */}
      <div className="px-6 py-5">
        <div className="space-y-6">
          {strengths.map((strength, index) => (
            <div key={index} className="flex pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              {/* Icon Column */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {strength.icon ? (
                    <span dangerouslySetInnerHTML={{ __html: strength.icon }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
                {/* Content Column */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{strength.title}</h4>
                <p className="text-gray-600 text-sm">{strength.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Default strengths data
const defaultStrengths: Strength[] = [
  {
    title: 'Career Positioning: Strong Foundation',
    description: "You've built an impressive foundation for your career with clear direction and strategic understanding of your industry.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>'
  },
  {
    title: 'Technical Competence: Advanced Skills',
    description: "Your technical expertise stands out as a significant strength that differentiates you from peers in your field.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" /></svg>'
  },
  {
    title: 'Network Development: Strong Connections',
    description: "You've cultivated a valuable professional network that provides support, opportunities, and industry insights.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>'
  }
];

export default StrengthsCard;
