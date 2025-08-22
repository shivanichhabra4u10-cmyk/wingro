const fs = require('fs');
const path = require('path');

// File to update
const fileToUpdate = 'student-11-12-questions.json';

// The data directory
const dataDir = path.join(__dirname, 'client', 'src', 'data');

// Update the file
const filePath = path.join(dataDir, fileToUpdate);

try {
  // Read the file
  const data = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(data);
  
  // Iterate through each question
  jsonData.forEach(question => {
    // Check if options exist
    if (question.options && Array.isArray(question.options)) {
      // Add scores to options
      question.options.forEach((option, index, array) => {
        // If the option doesn't already have a score, add one
        if (!option.hasOwnProperty('score')) {
          // Calculate score based on position - earlier options get higher scores
          // For most formats, options are in descending order of positivity/confidence
          const totalOptions = array.length;
          const score = Math.max(0, 10 - Math.floor((10 * index) / (totalOptions - 1 || 1)));
          option.score = score;
        }
      });
    }
  });
  
  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`Updated ${fileToUpdate}`);
} catch (error) {
  console.error(`Error updating ${fileToUpdate}:`, error);
}

console.log('Update completed!');
