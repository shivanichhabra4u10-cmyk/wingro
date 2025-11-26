const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = path.join(__dirname, 'DIGITAL-TWIN-SCORING-LOGIC.json');
const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Generate the TypeScript insights map
let tsContent = `// Auto-generated from DIGITAL-TWIN-SCORING-LOGIC.json
// Complete scoring insights for Digital Twin Assessment
// Maps each question + option combination to detailed insights

export const detailedInsightsMap: {
  [key: string]: {
    title: string;
    mainInsight: string;
    rootCause: string;
    growthBlocker: string;
    hiddenStrength: string;
    hiddenDesire: string;
    futureArchetype: string;
    archetype: string;
    microActions: {
      hours24: string;
      days7: string;
      days30: string;
    };
    digitalTwinMessage: string;
  };
} = {
`;

// Process each question
const questions = jsonContent.digitalTwinScoringFramework.questions;

questions.forEach(question => {
  const { questionId, scoringOptions } = question;
  
  // Process each scoring option
  scoringOptions.forEach(option => {
    const { option: optionLetter, score, title, keyInsight, archetype, growthBlocker, hiddenStrength, hiddenDesire, futureArchetype, microActions } = option;
    
    const key = `Q${questionId}-${optionLetter}`;
    
    // Extract root cause from keyInsight or use a default based on context
    let rootCause = '';
    if (keyInsight) {
      // Extract the main cause from the insight
      rootCause = keyInsight.split('—')[1]?.trim() || keyInsight.substring(0, 100);
    }
    
    tsContent += `
  '${key}': {
    title: '${title.replace(/'/g, "\\'")}',
    mainInsight: '${keyInsight.replace(/'/g, "\\'")}',
    rootCause: '${rootCause.replace(/'/g, "\\'")}',
    growthBlocker: '${growthBlocker.replace(/'/g, "\\'")}',
    hiddenStrength: '${hiddenStrength.replace(/'/g, "\\'")}',
    hiddenDesire: '${hiddenDesire.replace(/'/g, "\\'")}',
    futureArchetype: '${futureArchetype.replace(/'/g, "\\'")}',
    archetype: '${archetype.replace(/'/g, "\\'")}',
    microActions: {
      hours24: '${microActions.hours24.replace(/'/g, "\\'")}',
      days7: '${microActions.days7.replace(/'/g, "\\'")}',
      days30: '${microActions.days30.replace(/'/g, "\\'")}'
    },
    digitalTwinMessage: 'Your unique path forward.'
  },`;
  });
});

tsContent += `
};
`;

// Write the TypeScript file
const tsPath = path.join(__dirname, 'server/src/services/detailedInsightsMap.ts');
fs.writeFileSync(tsPath, tsContent, 'utf8');

console.log('✅ Generated detailedInsightsMap.ts successfully!');
console.log(`📝 File written to: ${tsPath}`);
console.log(`🎯 Total entries: ${questions.reduce((sum, q) => sum + (q.scoringOptions?.length || 0), 0)}`);
