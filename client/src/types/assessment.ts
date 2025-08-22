/**
 * Interfaces for the assessment system
 */

export interface Option {
  option: string;
  text: string;
  score: number;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  dimensionId: string;
  options: Option[];
}

export interface ScoringDimension {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  thresholds: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface ResultProfile {
  id: string;
  name: string;
  description: string;
  conditions: {
    [dimensionId: string]: string;
  };
}

export interface AssessmentMetadata {
  id: string;
  title: string;
  version: string;
  scoringDimensions: ScoringDimension[];
  resultProfiles: ResultProfile[];
}

export interface AssessmentData {
  assessmentMetadata: AssessmentMetadata;
  questions: Question[];
}

// Define individual dimension score interface
export interface DimensionScore {
  rawScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  level: 'high' | 'medium' | 'low';
  dimensionName: string;
  dimensionDescription: string;
}

// Interface for the scoring results
export interface AssessmentScoringResult {
  // Error property for handling scoring errors
  error?: string;
  
  // Dimension scores mapped by dimension ID
  dimensionScores: {
    [dimensionId: string]: DimensionScore;
  };
  
  // The primary profile determined for the user
  primaryProfile?: {
    id: string;
    name: string;
    description: string;
  };
  
  // Secondary profiles if applicable
  secondaryProfiles?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  
  // Overall risk score
  overallRiskScore?: number;
  
  // Risk level classification
  riskLevel?: 'high' | 'medium' | 'low';
}
