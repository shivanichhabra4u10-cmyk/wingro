#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read JSON file
const jsonPath = path.join(__dirname, 'DIGITAL-TWIN-SCORING-LOGIC.json');
let jsonContent;

try {
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  jsonContent = JSON.parse(jsonData);
} catch (e) {
  console.error('❌ Error parsing JSON:', e.message);
  process.exit(1);
}

// Build TypeScript output
let output = `// Auto-generated: Complete scoring insights for Digital Twin Assessment
// Maps Q1-Q10 with all options (a-j)

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

const questions = jsonContent.digitalTwinScoringFramework.questions;

questions.forEach((q) => {
  const qId = q.questionId;
  const qName = q.theme;
  
  output += `  // Q${qId}: ${qName}\n`;
  
  (q.scoringOptions || []).forEach((opt) => {
    const key = `'Q${qId}-${opt.option}'`;
    const title = (opt.title || '').replace(/'/g, "\\'");
    const insight = (opt.keyInsight || '').replace(/'/g, "\\'");
    const rootCause = (opt.growthBlocker || '').replace(/'/g, "\\'"); // Use growthBlocker as fallback
    const blocker = (opt.growthBlocker || '').replace(/'/g, "\\'");
    const strength = (opt.hiddenStrength || '').replace(/'/g, "\\'");
    const desire = (opt.hiddenDesire || '').replace(/'/g, "\\'");
    const future = (opt.futureArchetype || opt.archetype || '').replace(/'/g, "\\'");
    const archetype = (opt.archetype || '').replace(/'/g, "\\'");
    
    const h24 = (opt.microActions?.hours24 || '').replace(/'/g, "\\'");
    const d7 = (opt.microActions?.days7 || '').replace(/'/g, "\\'");
    const d30 = (opt.microActions?.days30 || '').replace(/'/g, "\\'");
    
    output += `  ${key}: {
    title: '${title}',
    mainInsight: '${insight}',
    rootCause: '${rootCause}',
    growthBlocker: '${blocker}',
    hiddenStrength: '${strength}',
    hiddenDesire: '${desire}',
    futureArchetype: '${future}',
    archetype: '${archetype}',
    microActions: {
      hours24: '${h24}',
      days7: '${d7}',
      days30: '${d30}'
    },
    digitalTwinMessage: 'Your unique path forward.'
  },\n`;
  });
});

output += `};\n\nexport const getDetailedInsight = (questionId: number, option: string) => {
  const key = \`Q\${questionId}-\${option}\`;
  return detailedInsightsMap[key] || null;
};\n`;

// Write output
const outPath = path.join(__dirname, 'server/src/services/detailedInsightsMap.ts');
fs.writeFileSync(outPath, output, 'utf8');

console.log('✅ Generated detailedInsightsMap.ts successfully!');
console.log(`📝 Location: ${outPath}`);
console.log(`🎯 Total questions: ${questions.length}`);
console.log(`📊 Total options: ${questions.reduce((sum, q) => sum + (q.scoringOptions?.length || 0), 0)}`);
