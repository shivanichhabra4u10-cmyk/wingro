import React from 'react';

interface RiskNavigatorGaugeProps {
  score: number;
  maxScore?: number;
}

const RiskNavigatorGauge: React.FC<RiskNavigatorGaugeProps> = ({
  score,
  maxScore = 100
}) => {
  // Calculate which zone the score falls into
  const getZone = () => {
    if (score <= 40) return { name: 'High Risk', color: 'bg-red-500', range: '0-40 Points' };
    if (score <= 65) return { name: 'Moderate Risk', color: 'bg-yellow-500', range: '41-65 Points' };
    return { name: 'Growth Track', color: 'bg-green-500', range: '66-100 Points' };
  };

  const zone = getZone();
  
  // Format score to always show one decimal place
  const formattedScore = score.toFixed(1);
  
  // Calculate position on gauge (0-100%)
  const position = Math.max(0, Math.min(100, (score / maxScore) * 100));
  
  return (
    <div className="risk-navigator-gauge bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-center text-base text-gray-500 mb-2">Your comprehensive career health score based on 10 key dimensions</h2>
      
      <h3 className="text-center font-medium text-xl mb-4">Your Career Health Zone</h3>
      
      {/* Gauge visualization */}
      <div className="relative h-9 mb-2">
        {/* Background gradient */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/5 bg-red-500"></div>
            <div className="w-1/5 bg-red-400"></div>
            <div className="w-1/5 bg-yellow-500"></div>
            <div className="w-1/5 bg-green-400"></div>
            <div className="w-1/5 bg-green-500"></div>
          </div>
        </div>
        
        {/* Score indicator */}
        <div 
          className="absolute top-0 w-3 h-9 bg-gray-800 transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        ></div>
      </div>
      
      {/* Zone labels */}
      <div className="flex justify-between text-xs text-gray-600 px-1 mb-6">
        <div>High Risk (0-40 Points)</div>
        <div>Moderate Risk (41-65)</div>
        <div>Growth Track (66-100)</div>
      </div>
      
      {/* Score display */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-2">
        <p className="text-center text-sm">
          You're in the <span className="font-bold text-red-600">{zone.name} zone</span> with a score of <span className="font-bold">{formattedScore}</span>. This is actually an opportunity! You have clear areas to focus on for dramatic career improvement. Small changes in key areas can create significant positive momentum.
        </p>
      </div>
    </div>
  );
};

export default RiskNavigatorGauge;
