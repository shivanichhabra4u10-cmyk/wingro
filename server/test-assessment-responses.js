const axios = require('axios');

// Test data for individual assessment responses
const testIndividualResponse = {
  // Valid assessmentId from your database - replace with an actual ID
  id: '658f42a7e4b08b9c1a37e8d5', // Replace with a real ID
  
  responseData: {
    // Map of question IDs to selected answer scores (1-10)
    answers: {
      '1': 8,  // Question 1, high score (positive response)
      '2': 7,  // Question 2, fairly high score
      '3': 5,  // Question 3, medium score
      '4': 6,  // Question 4, slightly above medium score
      '5': 4,  // Question 5, slightly below medium score
      '6': 9,  // Question 6, very high score
      '7': 3,  // Question 7, fairly low score
      '8': 5,  // Question 8, medium score
      '9': 7,  // Question 9, fairly high score
      '10': 8  // Question 10, high score
    },
    
    // This represents the detailed answers with question text and selected options
    detailedAnswers: {
      '1': {
        score: 8,
        questionText: 'How do you feel about your current career growth prospects?',
        category: 'Career Growth',
        selectedOption: 'Growth feels steady but not exciting',
        optionIndex: 2
      },
      '2': {
        score: 7,
        questionText: "What's holding you back from changing or pivoting your career?",
        category: 'Career Growth',
        selectedOption: 'Just need a clear next step',
        optionIndex: 3
      },
      // Add more detailed answers for other questions
    },
    
    // Summary of scores by category
    scores: [
      { category: 'Career Growth', score: 7 },
      { category: 'Purpose', score: 6 },
      { category: 'Skills', score: 7 },
      { category: 'Work-Life Balance', score: 4 },
      { category: 'Financial Security', score: 8 }
    ],
    
    // When the assessment was completed
    completedAt: new Date().toISOString(),
    
    // Category scores formatted for display
    categories: {
      'Career Growth': { score: 7 },
      'Purpose': { score: 6 },
      'Skills': { score: 7 },
      'Work-Life Balance': { score: 4 },
      'Financial Security': { score: 8 }
    },
    
    // Metadata about the assessment
    rawQuestionCount: 10,
    answeredQuestionCount: 10
  }
};

// Function to test the individual assessment API
async function testIndividualAssessmentResponses() {
  try {
    const assessmentId = testIndividualResponse.id;
    
    console.log(`Testing update to individual assessment ID: ${assessmentId}`);
    
    const response = await axios.put(
      `http://localhost:3001/api/assessment/individual/${assessmentId}`,
      { responseData: testIndividualResponse.responseData }
    );
    
    console.log('API Response:', response.data);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error testing assessment API:', error.response?.data || error.message);
  }
}

// Run the test
testIndividualAssessmentResponses();

// USAGE INSTRUCTIONS:
// 1. Replace the ID with a valid assessment ID from your database
// 2. Run this script with: node test-assessment-responses.js
// 3. Check the server logs for detailed information about the processing
