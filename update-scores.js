const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'professional-questions.json',
  'early-startup-questions.json',
  'established-startup-questions.json'
];

// The data directory
const dataDir = path.join(__dirname, 'client', 'src', 'data');

// Update each file
filesToUpdate.forEach(file => {
  const filePath = path.join(dataDir, file);
  
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
    console.log(`Updated ${file}`);
  } catch (error) {
    console.error(`Error updating ${file}:`, error);
  }
});

console.log('All files updated successfully!');
