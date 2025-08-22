import React from 'react';

interface DevelopmentItem {
  title: string;
  description: string;
  icon?: string;
}

interface DevelopmentCardProps {
  opportunities?: DevelopmentItem[];
}

const DevelopmentCard: React.FC<DevelopmentCardProps> = ({ opportunities = defaultOpportunities }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
        <h3 className="text-gray-800 font-bold text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Your Top 3 Development Opportunities
        </h3>
      </div>
      
      {/* Card Body */}
      <div className="px-6 py-5">
        <div className="space-y-6">
          {opportunities.map((item, index) => (
            <div key={index} className="flex pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              {/* Icon Column */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  {item.icon ? (
                    <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
                {/* Content Column */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Default development opportunities
const defaultOpportunities: DevelopmentItem[] = [
  {
    title: 'Strategic Vision: Needs Enhancement',
    description: "Developing a clearer long-term vision would strengthen your ability to make aligned career decisions.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>'
  },
  {
    title: 'Leadership Skills: Room for Growth',
    description: "Enhancing your leadership capabilities would position you better for more senior roles and increased responsibility.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" /></svg>'
  },
  {
    title: 'Work-Life Balance: At Risk',
    description: "Your current work-life balance appears unsustainable and may lead to burnout if not addressed soon.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>'
  }
];

export default DevelopmentCard;
