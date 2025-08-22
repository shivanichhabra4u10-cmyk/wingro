import React from 'react';

interface ProfileResultsCardProps {
  profile: any;
  dimensionScores: any;
  recommendations: any[];
}

const ProfileResultsCard: React.FC<ProfileResultsCardProps> = ({ 
  profile, 
  dimensionScores,
  recommendations 
}) => {
  if (!profile) {
    return null;
  }

  // Get top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-3 rounded-full text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Your Profile: {profile.name}</h3>
          <p className="text-gray-600">{profile.description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Dimension Scores</h4>
        <div className="space-y-2">
          {Object.entries(dimensionScores).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">{value.dimensionName}</span>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      value.level === 'high' ? 'bg-green-500' : 
                      value.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${value.percentageScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-gray-600">{value.percentageScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {topRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Top Recommendations</h4>
          <ul className="space-y-2">
            {topRecommendations.map(recommendation => (
              <li key={recommendation.id} className="flex items-start">
                <div className={`flex-shrink-0 w-5 h-5 mt-0.5 mr-2 rounded-full flex items-center justify-center ${
                  recommendation.priority === 'high' ? 'bg-red-100 text-red-500' :
                  recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">{recommendation.title}</span>
                  <span className="block text-xs text-gray-500">{recommendation.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileResultsCard;
