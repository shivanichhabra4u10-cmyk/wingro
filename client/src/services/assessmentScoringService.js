/**
 * Assessment Scoring Service
 * This module handles scoring logic for all assessment types
 * Currently implemented for 9-10 grade students
 * Can be extended for 11-12 grade and professional assessments
 */

import assessmentData from '../data/student-9-10-questions-with-scoring.json';
import { createAssessmentScorer } from '../utils/assessmentScoringUtils';

// Import other assessment data when available
// import student1112Data from '../data/student-11-12-questions-with-scoring.json';
// import professionalData from '../data/professional-questions-with-scoring.json';

/**
 * Calculate scores for each dimension based on user responses
 * @param {Object} responses - Object with question IDs as keys and selected option letters as values
 * @returns {Object} Calculated scores and profile results
 */
export const calculateAssessmentScores = (responses) => {
  if (!responses || Object.keys(responses).length === 0) {
    return {
      error: 'No responses provided'
    };
  }

  try {
    const { questions, assessmentMetadata } = assessmentData;
    const { scoringDimensions, resultProfiles } = assessmentMetadata;
    
    // Group and score by category instead of dimensionId
    const categoryScores = {};
    const categoryMeta = {};
    questions.forEach(question => {
      const { id, category, options, scoringLogic = 'sum' } = question;
      const responseOption = responses[id];
      if (!responseOption) return;
      const selectedOption = options.find(opt => opt.option === responseOption);
      if (!selectedOption) return;
      if (!categoryScores[category]) {
        categoryScores[category] = { rawScore: 0, maxPossibleScore: 0 };
        // Try to find matching dimension metadata by category
        const meta = scoringDimensions.find(dim => category.toLowerCase().includes(dim.name.toLowerCase()));
        categoryMeta[category] = meta || null;
      }
      switch (scoringLogic) {
        case 'sum':
        default:
          categoryScores[category].rawScore += selectedOption.score;
          const maxScoreForQuestion = Math.max(...options.map(opt => opt.score));
          categoryScores[category].maxPossibleScore += maxScoreForQuestion;
          break;
      }
    });

    // Calculate percentage scores and levels for each category
    const dimensionScores = {};
    Object.keys(categoryScores).forEach(category => {
      const { rawScore, maxPossibleScore } = categoryScores[category];
      const meta = categoryMeta[category];
      let percentageScore = maxPossibleScore > 0 ? Math.round((rawScore / maxPossibleScore) * 100) : 0;
      let level = 'low';
      if (meta) {
        if (percentageScore >= meta.thresholds.high) {
          level = 'high';
        } else if (percentageScore >= meta.thresholds.medium) {
          level = 'medium';
        }
      }
      dimensionScores[category] = {
        rawScore,
        maxPossibleScore,
        percentageScore,
        level,
        dimensionName: category,
        dimensionDescription: meta ? meta.description : ''
      };
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
 * @param {Object} scores - The calculated scores from calculateAssessmentScores
 * @returns {Array} Array of recommendation objects
 */
export const getRecommendations = (scores) => {
  if (!scores || scores.error) return [];
  
  const { dimensionScores, primaryProfile } = scores;
  const recommendations = [];
  
  // Recommendations based on dimension scores
  if (dimensionScores.clarity && dimensionScores.clarity.level === 'low') {
    recommendations.push({
      id: 'rec-1',
      type: 'activity',
      title: 'Career Exploration Workshop',
      description: 'Take our career exploration workshop to discover careers that match your interests and strengths.',
      priority: 'high'
    });
  }
  
  if (dimensionScores.confidence && dimensionScores.confidence.level === 'low') {
    recommendations.push({
      id: 'rec-2',
      type: 'resource',
      title: 'Stream Selection Guide',
      description: 'Read our comprehensive guide to selecting the right academic stream after 10th grade.',
      priority: 'high'
    });
  }
  
  if (dimensionScores.exploration && dimensionScores.exploration.level === 'low') {
    recommendations.push({
      id: 'rec-3',
      type: 'activity',
      title: 'Career Shadowing',
      description: 'Participate in our career shadowing program to gain first-hand experience in different fields.',
      priority: 'medium'
    });
  }
  
  if (dimensionScores.resilience && dimensionScores.resilience.level === 'low') {
    recommendations.push({
      id: 'rec-4',
      type: 'workshop',
      title: 'Building Academic Resilience',
      description: 'Join our workshop on developing resilience and coping with academic challenges.',
      priority: 'medium'
    });
  }
  
  // Profile-based recommendations
  if (primaryProfile) {
    switch (primaryProfile.id) {
      case 'career-explorer':
        recommendations.push({
          id: 'rec-5',
          type: 'assessment',
          title: 'Career Aptitude Test',
          description: 'Take our detailed career aptitude test to identify specific fields that match your strengths.',
          priority: 'high'
        });
        break;
        
      case 'focused-planner':
        recommendations.push({
          id: 'rec-6',
          type: 'resource',
          title: 'Academic Roadmap',
          description: 'Create a personalized academic roadmap to achieve your career goals.',
          priority: 'medium'
        });
        break;
        
      case 'resilient-learner':
        recommendations.push({
          id: 'rec-7',
          type: 'coaching',
          title: 'Career Coaching',
          description: 'Schedule a one-on-one career coaching session to help develop a clearer direction.',
          priority: 'high'
        });
        break;
        
      case 'needs-guidance':
        recommendations.push({
          id: 'rec-8',
          type: 'program',
          title: 'Structured Career Guidance Program',
          description: 'Enroll in our 8-week career guidance program designed for students who need more direction.',
          priority: 'high'
        });
        break;
        
      default:
        recommendations.push({
          id: 'rec-9',
          type: 'consultation',
          title: 'Career Counseling Session',
          description: 'Book a career counseling session to discuss your assessment results and next steps.',
          priority: 'medium'
        });
    }
  }
  
  return recommendations;
};

/**
 * Generate a summary report based on assessment results
 * @param {Object} scores - The calculated scores from calculateAssessmentScores
 * @returns {Object} Summary report
 */
export const generateSummaryReport = (scores) => {
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

/**
 * Select and use the appropriate scoring system based on assessment type
 * @param {string} assessmentType - The type of assessment (student-9-10, student-11-12, professional)
 * @param {Object} responses - User's answers
 * @returns {Object} Scoring results
 */
export const calculateScoresByType = (assessmentType, responses) => {
  if (!assessmentType || !responses) {
    return { error: 'Invalid assessment type or responses' };
  }
  
  try {
    let questions, dimensions;
    switch (assessmentType) {
      case 'student-9-10':
        return calculateAssessmentScores(responses);
      case 'student-11-12':
        questions = require('../data/student-11-12-questions.json');
        break;
      case 'professional':
        questions = require('../data/professional-questions.json');
        break;
      case 'organization-early-startup':
        questions = require('../data/early-startup-questions.json');
        break;
      case 'organization-established-startup':
        questions = require('../data/established-startup-questions.json');
        break;
      default:
        return { error: 'Unknown assessment type' };
    }
    if (!questions) return { error: 'Questions not found for assessment type' };
    // Get all dimensions
    dimensions = Array.from(new Set(questions.map(q => q.dimensionId)));
    // Calculate scores by dimension
    const dimensionScores = {};
    const questionScores = {};
    dimensions.forEach(dim => {
      dimensionScores[dim] = { raw: 0, max: 0 };
    });
    questions.forEach(q => {
      const answer = responses[q.id];
      if (!answer) return;
      const selectedOption = q.options.find(opt => opt.option === answer);
      const score = selectedOption && typeof selectedOption.score === 'number' ? selectedOption.score : 0;
      questionScores[q.id] = score;
      dimensionScores[q.dimensionId].raw += score;
      const maxForQ = Math.max(...q.options.map(opt => typeof opt.score === 'number' ? opt.score : 0));
      dimensionScores[q.dimensionId].max += maxForQ;
    });
    // Calculate percentages
    const categoryScores = {};
    Object.keys(dimensionScores).forEach(dim => {
      const { raw, max } = dimensionScores[dim];
      categoryScores[dim] = max > 0 ? Math.round((raw / max) * 100) : 0;
    });
    // Overall score
    const categoryValues = Object.values(categoryScores);
    const overallScore = categoryValues.length > 0 ? Math.round(categoryValues.reduce((a, b) => a + b, 0) / categoryValues.length) : 0;
    return {
      dimensionScores: categoryScores,
      overallScore,
      questionScores
    };
  } catch (error) {
    console.error('Error in assessment scoring:', error);
    return { error: 'Scoring calculation failed', details: error.message };
  }
};

/**
 * Get recommendations based on assessment type and scores
 * @param {string} assessmentType - The type of assessment
 * @param {Object} scores - Calculated scores
 * @returns {Array} Recommendations
 */
export const getRecommendationsByType = (assessmentType, scores) => {
  if (!assessmentType || !scores) {
    return [];
  }
  
  try {
    switch (assessmentType) {
      case 'student-9-10':
        return getRecommendations(scores);
        
      case 'student-11-12':
      case 'professional':
        // Return generic recommendations when specific ones aren't available
        return [];
        
      default:
        return [];
    }
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

export default {
  calculateAssessmentScores,
  getRecommendations,
  generateSummaryReport,
  calculateScoresByType,
  getRecommendationsByType
};
