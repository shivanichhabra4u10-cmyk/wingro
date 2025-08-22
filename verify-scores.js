const fs = require('fs');
const path = require('path');

// Files to check
const filesToCheck = [
  'student-9-10-questions.json',
  'student-11-12-questions.json',
  'professional-questions.json',
  'early-startup-questions.json',
  'established-startup-questions.json'
];

// The data directory
const dataDir = path.join(__dirname, 'client', 'src', 'data');

// Check each file
filesToCheck.forEach(file => {
  const filePath = path.join(dataDir, file);
  
  try {
    // Read the file
    const data = fs.readFileSync(filePath, 'utf8');
    let jsonData;
    
    try {
      jsonData = JSON.parse(data);
    } catch (jsonError) {
      console.error(`Error parsing JSON in ${file}:`, jsonError);
      return;
    }
    
    // Handle different file structures
    const questions = Array.isArray(jsonData) ? jsonData : 
                     (jsonData.questions ? jsonData.questions : []);
    
    // Statistics
    let totalQuestions = 0;
    let questionsWithAllScores = 0;
    let questionsWithSomeScores = 0;
    let questionsWithNoScores = 0;
    let totalOptions = 0;
    let optionsWithScores = 0;
    
    // Check each question
    questions.forEach((question, qIndex) => {
      totalQuestions++;
      
      // Check if options exist
      if (question.options && Array.isArray(question.options)) {
        let hasAllScores = true;
        let hasSomeScores = false;
        let optionCount = question.options.length;
        let scoredOptionCount = 0;
        
        // Check each option
        question.options.forEach(option => {
          totalOptions++;
          
          if (option.hasOwnProperty('score')) {
            optionsWithScores++;
            scoredOptionCount++;
            hasSomeScores = true;
          } else {
            hasAllScores = false;
            console.log(`Missing score in ${file}, question ${qIndex + 1} (${question.id}), option ${option.option}`);
          }
        });
        
        // Update statistics
        if (hasAllScores) {
          questionsWithAllScores++;
        } else if (hasSomeScores) {
          questionsWithSomeScores++;
        } else {
          questionsWithNoScores++;
        }
        
        // Detailed report per question
        console.log(`${file} - Question ${qIndex + 1} (ID: ${question.id}): ${scoredOptionCount}/${optionCount} options have scores`);
      } else {
        console.log(`${file} - Question ${qIndex + 1} (ID: ${question.id}): No options found`);
        questionsWithNoScores++;
      }
    });
    
    // Summary for this file
    console.log(`\n=== ${file} Summary ===`);
    console.log(`Total questions: ${totalQuestions}`);
    console.log(`Questions with all scores: ${questionsWithAllScores}`);
    console.log(`Questions with some scores: ${questionsWithSomeScores}`);
    console.log(`Questions with no scores: ${questionsWithNoScores}`);
    console.log(`Options with scores: ${optionsWithScores}/${totalOptions} (${Math.round(optionsWithScores/totalOptions*100)}%)`);
    console.log('---------------------\n');
    
  } catch (error) {
    console.error(`Error checking ${file}:`, error);
  }
});

console.log('Verification completed!');
