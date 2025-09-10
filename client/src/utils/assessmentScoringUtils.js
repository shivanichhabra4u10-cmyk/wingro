/**
 * Utility functions for creating assessment scoring services for different assessment types
 */

import student910QuestionsData from '../data/student-9-10-questions.json';

// Template for new assessment scorers
// Default to student910QuestionsData if no assessmentData is provided
export const createAssessmentScorer = (assessmentData = student910QuestionsData) => {
  /**
   * Calculate scores for each dimension based on user responses
   * @param {Object} responses - Object with question IDs as keys and selected option letters as values
   * @returns {Object} Calculated scores and profile results
   */
  const calculateScores = (responses) => {
    if (!responses || Object.keys(responses).length === 0) {
      return {
        error: 'No responses provided'
      };
    }

    try {
      const { questions, assessmentMetadata } = assessmentData;
      const { scoringDimensions, resultProfiles } = assessmentMetadata;
      
      // Initialize dimension scores
      const dimensionScores = {};
      scoringDimensions.forEach(dimension => {
        dimensionScores[dimension.id] = {
          rawScore: 0,
          maxPossibleScore: 0,
          percentageScore: 0,
          level: 'low', // default
          dimensionName: dimension.name,
          dimensionDescription: dimension.description
        };
      });
      
      // Calculate raw scores for each dimension
      questions.forEach(question => {
        const { id, dimensionId, options } = question;
        const responseOption = responses[id];
        
        // Skip if no answer for this question
        if (!responseOption) return;
        
        // Find the selected option
        const selectedOption = options.find(opt => opt.option === responseOption);
        if (!selectedOption) return;
        
        // Add to dimension score
        if (dimensionScores[dimensionId]) {
          dimensionScores[dimensionId].rawScore += selectedOption.score;
          
          // Add maximum possible score for this question
          const maxScoreForQuestion = Math.max(...options.map(opt => opt.score));
          dimensionScores[dimensionId].maxPossibleScore += maxScoreForQuestion;
        }
      });
      
      // Calculate percentage scores and levels for each dimension
      Object.keys(dimensionScores).forEach(dimensionId => {
        const dimension = dimensionScores[dimensionId];
        const dimensionMetadata = scoringDimensions.find(d => d.id === dimensionId);
        
        if (dimension.maxPossibleScore > 0) {
          dimension.percentageScore = Math.round((dimension.rawScore / dimension.maxPossibleScore) * 100);
        }
        
        // Determine level based on thresholds
        if (dimensionMetadata) {
          if (dimension.percentageScore >= dimensionMetadata.thresholds.high) {
            dimension.level = 'high';
          } else if (dimension.percentageScore >= dimensionMetadata.thresholds.medium) {
            dimension.level = 'medium';
          } else {
            dimension.level = 'low';
          }
        }
      });
      
      // Determine matching result profiles
      const matchingProfiles = resultProfiles.filter(profile => {
        // Check if the profile conditions match the user's scores
        return Object.entries(profile.conditions).every(([dimensionId, requiredLevel]) => {
          const userLevel = dimensionScores[dimensionId]?.level;
          
          // Handle combined levels like "low-medium"
          if (requiredLevel.includes('-')) {
            const acceptableLevels = requiredLevel.split('-');
            return acceptableLevels.includes(userLevel);
          }
          
          return userLevel === requiredLevel;
        });
      });
      
      // Find primary profile (first match)
      const primaryProfile = matchingProfiles.length > 0 ? matchingProfiles[0] : null;
      
      return {
        dimensionScores,
        primaryProfile,
        allMatchingProfiles: matchingProfiles,
        responseCount: Object.keys(responses).length,
        totalQuestions: questions.length,
        completionPercentage: Math.round((Object.keys(responses).length / questions.length) * 100)
      };
    } catch (error) {
      console.error('Error calculating assessment scores:', error);
      return {
        error: 'Failed to calculate scores',
        details: error.message
      };
    }
  };

  /**
   * Get recommended next steps based on assessment results
   * @param {Object} scores - The calculated scores from calculateScores
   * @returns {Array} Array of recommendation objects
   */
  const getRecommendations = (scores) => {
    if (!scores || scores.error) return [];
    
    const { dimensionScores, primaryProfile } = scores;
    const recommendations = [];
    
    // Generic recommendations based on dimension scores
    Object.entries(dimensionScores).forEach(([dimensionId, dimension]) => {
      if (dimension.level === 'low') {
        recommendations.push({
          id: `rec-${dimensionId}-low`,
          type: 'improvement',
          title: `${dimension.dimensionName} Development`,
          description: `Focus on improving your ${dimension.dimensionName.toLowerCase()} skills with our targeted resources.`,
          priority: 'high'
        });
      }
      
      if (dimension.level === 'medium') {
        recommendations.push({
          id: `rec-${dimensionId}-medium`,
          type: 'enhancement',
          title: `Enhance ${dimension.dimensionName}`,
          description: `Build on your foundation in ${dimension.dimensionName.toLowerCase()} to reach an advanced level.`,
          priority: 'medium'
        });
      }
      
      if (dimension.level === 'high') {
        recommendations.push({
          id: `rec-${dimensionId}-high`,
          type: 'mastery',
          title: `${dimension.dimensionName} Mastery`,
          description: `Share your expertise in ${dimension.dimensionName.toLowerCase()} and consider mentoring others.`,
          priority: 'low'
        });
      }
    });
    
    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations;
  };

  /**
   * Generate a summary report based on assessment results
   * @param {Object} scores - The calculated scores from calculateScores
   * @returns {Object} Summary report
   */
  const generateSummaryReport = (scores) => {
    if (!scores || scores.error) {
      return { error: scores?.error || 'Invalid scores' };
    }
    
    const { dimensionScores, primaryProfile, completionPercentage } = scores;
    
    // Generate strengths and areas for improvement
    const strengths = Object.values(dimensionScores)
      .filter(dimension => dimension.level === 'high')
      .map(dimension => ({
        area: dimension.dimensionName,
        description: dimension.dimensionDescription,
        score: dimension.percentageScore
      }));
    
    const improvements = Object.values(dimensionScores)
      .filter(dimension => dimension.level === 'low')
      .map(dimension => ({
        area: dimension.dimensionName,
        description: dimension.dimensionDescription,
        score: dimension.percentageScore
      }));
    
    // Get recommendations
    const recommendations = getRecommendations(scores);
    
    return {
      summary: primaryProfile ? primaryProfile.description : 'Assessment completed. See detailed results below.',
      profileName: primaryProfile ? primaryProfile.name : 'Custom Profile',
      completionPercentage,
      dimensionScores,
      strengths,
      improvementAreas: improvements,
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      allRecommendations: recommendations
    };
  };

  return {
    calculateScores,
    getRecommendations,
    generateSummaryReport
  };
};

// Create scoring systems for other assessment types
// These can be implemented when corresponding scoring data is available
export const createScoring1112 = (scoringData) => {
  // Return a scoring service for 11-12 grade assessments
  return createAssessmentScorer(scoringData);
};

export const createScoringProfessional = (scoringData) => {
  // Return a scoring service for professional assessments
  return createAssessmentScorer(scoringData);
};

export default {
  createAssessmentScorer,
  createScoring1112,
  createScoringProfessional
};
