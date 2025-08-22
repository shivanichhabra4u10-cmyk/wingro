import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Radio, RadioGroup, FormControlLabel, Grid, Box, CircularProgress, Divider, LinearProgress } from '@mui/material';
import assessmentScoringService from '../services/assessmentScoringService';

// Move styles object outside the component and remove type annotation errors
const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '16px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196f3',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  progressText: {
    textAlign: 'center',
    marginTop: '5px',
    fontSize: '14px',
    color: '#666'
  },
  resultsContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '2px solid #2196f3',
    paddingBottom: '5px'
  },
  dimensionScore: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  scoreBarContainer: {
    width: '70%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  scoreBar: {
    height: '100%',
    borderRadius: '10px'
  },
  highScore: {
    backgroundColor: '#4caf50'
  },
  mediumScore: {
    backgroundColor: '#ff9800'
  },
  lowScore: {
    backgroundColor: '#f44336'
  },
  profileName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: '10px'
  },
  profileDescription: {
    fontSize: '16px',
    marginBottom: '20px'
  },
  recommendationItem: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  recommendationTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  recommendationDescription: {
    fontSize: '14px',
    color: '#555'
  },
  recommendationPriority: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '5px'
  },
  highPriority: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  mediumPriority: {
    backgroundColor: '#fff8e1',
    color: '#ff8f00'
  },
  lowPriority: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  }
};

/**
 * Assessment component with integrated scoring system
 * Handles rendering questions, collecting responses, and showing results
 */
const AssessmentWithScoring = ({ assessmentFileName }) => {
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data/${assessmentFileName}`);
        if (!response.ok) {
          throw new Error('Failed to load assessment data');
        }
        const data = await response.json();
        setAssessment(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load the assessment. Please try again later.');
        setLoading(false);
      }
    };
    loadAssessment();
  }, [assessmentFileName]);
    backgroundColor: '#2196f3',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'center',
    marginTop: '5px',
    fontSize: '14px',
    color: '#666',
  },
  resultsContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '2px solid #2196f3',
    paddingBottom: '5px',
  },
  dimensionScore: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  scoreBarContainer: {
    width: '70%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: '10px',
  },
  highScore: {
    backgroundColor: '#4caf50',
  },
  mediumScore: {
    backgroundColor: '#ff9800',
  },
  lowScore: {
    backgroundColor: '#f44336',
  },
  profileName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: '10px',
  },
  profileDescription: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  recommendationItem: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  recommendationTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  recommendationDescription: {
    fontSize: '14px',
    color: '#555',
  },
  recommendationPriority: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '5px',
  },
  highPriority: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  mediumPriority: {
    backgroundColor: '#fff8e1',
    color: '#ff8f00',
  },
  lowPriority: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
};

const AssessmentWithScoring = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [results, setResults] = useState(null);
  
  if (loading || !assessment) {
    return <div>Loading assessment...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  const questions = assessment.questions;
  const totalQuestions = questions.length;
  const progress = (Object.keys(responses).length / totalQuestions) * 100;

  useEffect(() => {
    if (Object.keys(responses).length === totalQuestions) {
      handleComplete();
    }
  }, [responses]);

  const handleOptionSelect = (questionId, option) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = () => {
    // Use the scoring service to calculate scores by category
    const { calculateAssessmentScores, generateSummaryReport } = assessmentScoringService;
    const scores = calculateAssessmentScores(responses);
    const report = generateSummaryReport(scores);
    setResults(report);
    setIsAssessmentComplete(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Student Assessment (Grade 9-10)</h1>
        <p>Answer questions about your career clarity and educational plans</p>
      </div>
      
      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${progress}%`}} />
      </div>
      <div style={styles.progressText}>
        {Object.keys(responses).length} of {totalQuestions} questions answered ({Math.round(progress)}%)
      </div>
      
      {!isAssessmentComplete ? (
        <>
          <div style={styles.question}>
            <div style={styles.questionCategory}>{currentQuestion.category}</div>
            <div style={styles.questionText}>{currentQuestion.question}</div>
            <div style={styles.options}>
              {currentQuestion.options.map(option => (
                <div
                  key={option.option}
                  style={{
                    ...styles.option,
                    ...(responses[currentQuestion.id] === option.option ? styles.optionSelected : {})
                  }}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.option)}
                >
                  <input
                    type="radio"
                    id={`option-${currentQuestion.id}-${option.option}`}
                    name={`question-${currentQuestion.id}`}
                    checked={responses[currentQuestion.id] === option.option}
                    onChange={() => handleOptionSelect(currentQuestion.id, option.option)}
                  />
                  <label
                    htmlFor={`option-${currentQuestion.id}-${option.option}`}
                    style={styles.optionText}
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.navigationButtons}>
            <button
              style={styles.button}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                style={{...styles.button, ...styles.submitButton}}
                onClick={handleComplete}
                disabled={Object.keys(responses).length !== totalQuestions}
              >
                Submit Assessment
              </button>
            ) : (
              <button
                style={styles.button}
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div style={styles.resultsContainer}>
          <h2 style={styles.profileName}>{results.profileName}</h2>
          <p style={styles.profileDescription}>{results.summary}</p>
          
          <div style={styles.sectionTitle}>Dimension Scores</div>
          {Object.values(results.dimensionScores).map(dimension => (
            <div key={dimension.dimensionName} style={styles.dimensionScore}>
              <div>
                <div>{dimension.dimensionName}</div>
                <div style={{fontSize: '12px', color: '#666'}}>{dimension.level.toUpperCase()}</div>
              </div>
              <div style={styles.scoreBarContainer}>
                <div
                  style={{
                    ...styles.scoreBar,
                    ...(dimension.level === 'high' ? styles.highScore : 
                       dimension.level === 'medium' ? styles.mediumScore : styles.lowScore),
                    width: `${dimension.percentageScore}%`
                  }}
                />
              </div>
              <div>{dimension.percentageScore}%</div>
            </div>
          ))}
          
          {results.strengths.length > 0 && (
            <>
              <div style={styles.sectionTitle}>Strengths</div>
              <ul>
                {results.strengths.map(strength => (
                  <li key={strength.area}>
                    <strong>{strength.area}</strong>: {strength.description}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {results.improvementAreas.length > 0 && (
            <>
              <div style={styles.sectionTitle}>Areas for Improvement</div>
              <ul>
                {results.improvementAreas.map(area => (
                  <li key={area.area}>
                    <strong>{area.area}</strong>: {area.description}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <div style={styles.sectionTitle}>Recommendations</div>
          {results.allRecommendations.map(recommendation => (
            <div key={recommendation.id} style={styles.recommendationItem}>
              <div style={styles.recommendationTitle}>{recommendation.title}</div>
              <div style={styles.recommendationDescription}>{recommendation.description}</div>
              <div 
                style={{
                  ...styles.recommendationPriority,
                  ...(recommendation.priority === 'high' ? styles.highPriority : 
                     recommendation.priority === 'medium' ? styles.mediumPriority : styles.lowPriority)
                }}
              >
                {recommendation.priority} priority
              </div>
            </div>
          ))}
          
          <div style={{marginTop: '30px', textAlign: 'center'}}>
            <button 
              style={styles.button} 
              onClick={() => {
                setResponses({});
                setCurrentQuestionIndex(0);
                setIsAssessmentComplete(false);
                setResults(null);
              }}
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentWithScoring;
