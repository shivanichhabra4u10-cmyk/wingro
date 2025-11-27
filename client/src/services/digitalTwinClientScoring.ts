// Client-side Digital Twin Scoring Service
// Calculates all 10 question scores immediately without backend calls

// Import scoring logic from JSON file
import scoringLogicData from '../data/DIGITAL-TWIN-SCORING-LOGIC.json';

export interface DigitalTwinScore {
  questionId: number;
  dimensionName: string;
  indexName: string;
  scoreType: string;
  userScore: number;
  maxScore: number;
  percentageScore: number;
  selectedOption: string;
  description: string;
  insight: string;
  recommendation: string;
  archetype: string;
  title?: string;
  microActions: {
    hours24: string;
    days7: string;
    days30: string;
  };
}

export interface DigitalTwinScoringResult {
  scores: DigitalTwinScore[];
  overallScore: number;
  readinessLevel: string;
  primaryArchetype: string;
  overallInsight: string;
  keyInsights: string[];
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  lowestScore: DigitalTwinScore;
  highestScore: DigitalTwinScore;
}

// Scoring scale: a=100, b=90, c=80, d=70, e=60, f=50, g=40, h=30, i=20, j=10
const scoringScale: { [key: string]: number } = {
  a: 100,
  b: 90,
  c: 80,
  d: 70,
  e: 60,
  f: 50,
  g: 40,
  h: 30,
  i: 20,
  j: 10
};

const questionMetadata = [
  {
    id: 1,
    theme: 'Identity & Purpose Alignment',
    index: 'Identity–Purpose Alignment Index (IPA Index)',
    scoreType: 'Readiness Score',
    measure: 'Measures how deeply work aligns with your inner purpose & evolving identity.'
  },
  {
    id: 2,
    theme: 'Flow & Strength Expression',
    index: 'Flow State Access Index (FSA Index)',
    scoreType: 'Strength Expression Score',
    measure: 'Measures how consistently and powerfully you access flow through natural strengths.'
  },
  {
    id: 3,
    theme: 'Career Trajectory Perception',
    index: 'Career Momentum Trajectory Index (CMT Index)',
    scoreType: 'Growth Momentum Score',
    measure: 'Captures the true trajectory—accelerating, plateauing, drifting, or pivot-ready.'
  },
  {
    id: 4,
    theme: 'Emotional Relationship with Work',
    index: 'Work–Emotion Vitality Index (WEV Index)',
    scoreType: 'Emotional Health Score',
    measure: 'Measures emotional connection, energy quality, and psychological engagement with work.'
  },
  {
    id: 5,
    theme: 'Energy & Workload Reality',
    index: 'Sustainable Energy Load Index (SEL Index)',
    scoreType: 'Burnout Risk Score',
    measure: 'Assesses energy rhythm, overload patterns, and burnout thresholds.'
  },
  {
    id: 6,
    theme: 'Cultural Tension Signal',
    index: 'Cultural Alignment Need Index (CAN Index)',
    scoreType: 'Cultural Friction Score',
    measure: 'Shows what cultural shift your system is craving — trust, safety, recognition, etc.'
  },
  {
    id: 7,
    theme: 'Leadership Energy Drain / Boost',
    index: 'Leadership Impact Energy Index (LIE Index)',
    scoreType: 'Leadership Influence Score',
    measure: 'Measures how your manager impacts your energy, confidence, and growth potential.'
  },
  {
    id: 8,
    theme: 'Meaning & Values Alignment',
    index: 'Values–Work Harmony Index (VWH Index)',
    scoreType: 'Values Alignment Score',
    measure: 'Evaluates how closely your work matches your core beliefs, identity, and meaning.'
  },
  {
    id: 9,
    theme: 'Reinvention & Future-Readiness',
    index: 'Reinvention Readiness Index (RRI Index)',
    scoreType: 'Reinvention Readiness Score',
    measure: 'Measures how emotionally and mentally prepared you are for major career change.'
  },
  {
    id: 10,
    theme: 'Hidden Passion & Future Self Expression',
    index: 'Passion Expression Alignment Index (PEA Index)',
    scoreType: 'Passion Clarity Score',
    measure: 'Reveals your deepest passion signature and how clearly it aligns with future identity.'
  }
];

// Insight data for Q1 and Q2 (comprehensive), Q3-Q10 use defaults
// COMMENTED OUT - NOT IN USE
/* const insightData: { [key: string]: any } = {
  'Q1-a': {
    title: 'Your Inner Compass: The Power of Being in Alignment',
    keyInsight: 'Your response reflects a rare and powerful Identity Emotional Story — the story of someone whose work and inner self are finally speaking the same language. This level of alignment does not happen by accident; it is a signal that your values, talents, and personal evolution are moving in the same direction. The Purpose Alignment Root Cause behind this is clarity: you know what you stand for, and your work is becoming a natural extension of that truth. It also indicates emotional maturity and deep self-awareness — you've done the inner work required to recognise what feels right and what doesn't.\n\nBut even in alignment, there is always a Growth Blocker hidden in the corners. For you, it is not misalignment — it is complacency. People who feel aligned often forget to stretch further. The danger is not confusion; it is settling for "good" when "extraordinary" is possible. Yet your Inner Compass Strength is exceptional — you have a strong intuitive radar that knows when something is right for your evolution. This intuition allows you to make bold decisions that others are afraid to make.\n\nBeneath this sits an Identity-Based Hidden Desire: you don't just want alignment — you want expansion. You want to shape something larger than yourself, express your uniqueness at scale, and build a legacy beyond daily work. Your Purpose-Driven Future Self is someone who leads with clarity, inspires with authenticity, and stands out because your identity and impact are inseparable.\n\nYour Identity Archetype is "The Aligned Visionary" — someone who grows not from force, but from inner truth. To strengthen this alignment, follow your Identity Reset Micro-Actions:\n\nNext 24 hours: Write a one-line statement about who you are becoming — and ensure it feels alive.\n\nNext 7 days: Identify one part of your work that deserves a bigger spotlight or bolder expression.\n\nNext 30 days: Begin integrating a new behaviour, project, or ritual that expands your identity, not just maintains it.\n\nYour Identity Fit Index indicates a high alignment, but not a destination — a launchpad. Your role supports your identity today, but your future self will require more influence, more creativity, and a wider stage. Finally, the Digital Twin (Identity Edition) whispers a gentle truth:\n"You're on the right path — but the next version of you is waiting for a bigger canvas."',
    rootCause: 'Identity expression through meaningful work',
    futureArchetype: 'The Aligned Visionary',
    microActions: {
      hours24: 'Write a one-line statement about who you are becoming — and ensure it feels alive.',
      days7: 'Identify one part of your work that deserves a bigger spotlight or bolder expression.',
      days30: 'Begin integrating a new behaviour, project, or ritual that expands your identity, not just maintains it.'
    }
  },
  'Q1-b': {
    keyInsight: 'You feel meaning, but it flickers instead of flowing.',
    rootCause: 'Fragmented alignment',
    futureArchetype: 'The Awakening Integrator',
    microActions: {
      hours24: 'Identify one moment this week where you felt most yourself.',
      days7: 'Pinpoint what created that meaning and how to repeat it.',
      days30: 'Integrate one aligned behaviour or responsibility into your weekly rhythm.'
    }
  },
  'Q1-c': {
    keyInsight: 'You enjoy the work, but your deeper purpose hasn\'t joined the conversation yet.',
    rootCause: 'Comfort without fulfillment',
    futureArchetype: 'The Quiet Seeker',
    microActions: {
      hours24: 'Reflect on one thing your soul wishes you could express more.',
      days7: 'Identify where your current work allows even a small piece of your deeper self to show.',
      days30: 'Add or request one activity that aligns with your inner purpose.'
    }
  },
  'Q1-d': {
    keyInsight: 'You\'re functioning, but your identity is asleep at the wheel.',
    rootCause: 'Identity detachment',
    futureArchetype: 'The Disconnected Wanderer',
    microActions: {
      hours24: 'Do one task today with full presence — no rush, no autopilot.',
      days7: 'Identify what part of your work you feel most emotionally absent from.',
      days30: 'Introduce or revive one activity that feels emotionally meaningful, even if small.'
    }
  },
  'Q1-e': {
    keyInsight: 'Your purpose is clear — your work simply hasn\'t caught up yet.',
    rootCause: 'Clarity without expression',
    futureArchetype: 'The Unexpressed Visionary',
    microActions: {
      hours24: 'Write down your purpose in a single sentence — keep it visible.',
      days7: 'Identify one area of your current work where your purpose can be expressed, even partially.',
      days30: 'Begin aligning your external ecosystem — conversations, roles, or projects — with your internal purpose.'
    }
  },
  'Q1-f': {
    keyInsight: 'You sense a calling forming beneath the surface, waiting to be articulated.',
    rootCause: 'Emerging purpose',
    futureArchetype: 'The Emerging Pathfinder',
    microActions: {
      hours24: 'Notice what topics or conversations spark you unexpectedly.',
      days7: 'Document patterns in what energizes you and what drains you.',
      days30: 'Begin a small exploration project (learning, mentoring, experimenting) to test your emerging purpose.'
    }
  },
  'Q1-g': {
    keyInsight: 'You\'re questioning everything — a powerful sign of deeper truth emerging.',
    rootCause: 'Identity transformation',
    futureArchetype: 'The Identity Rebuilder',
    microActions: {
      hours24: 'Write down the top 3 things you are no longer willing to tolerate from your old identity.',
      days7: 'Describe moments where you felt like your "true self"—notice patterns.',
      days30: 'Begin removing one identity-layer you\'ve outgrown (role, behaviour, expectation, or belief).'
    }
  },
  'Q1-h': {
    keyInsight: 'You\'ve outgrown a role that no longer matches who you\'re becoming.',
    rootCause: 'Identity expansion',
    futureArchetype: 'The Outgrowing Architect',
    microActions: {
      hours24: 'List one responsibility you\'ve outgrown and one you want to grow into.',
      days7: 'Identify the environments where your emerging identity fits better.',
      days30: 'Initiate a role redesign conversation or begin pursuing opportunities aligned with your new identity.'
    }
  },
  'Q1-i': {
    keyInsight: 'You don\'t know the purpose yet, but something is pulling you forward.',
    rootCause: 'Subconscious calling',
    futureArchetype: 'The Emerging Explorer',
    microActions: {
      hours24: 'Write down what you feel pulled away from — clarity often begins there.',
      days7: 'Experiment with one new idea, project, or domain to test the pull.',
      days30: 'Begin documenting identity patterns that show up repeatedly — themes emerge long before purpose names itself.'
    }
  },
  'Q1-j': {
    keyInsight: 'You\'re shedding an old identity and searching for the one that fits your next life chapter.',
    rootCause: 'Conscious reinvention',
    futureArchetype: 'The Conscious Reconstructor',
    microActions: {
      hours24: 'Define one trait your "next self" must embody.',
      days7: 'Engage in an activity or decision that reflects that new identity trait.',
      days30: 'Start eliminating one behaviour or belief that belongs to your old identity.'
    }
  },
  'Q2-a': {
    keyInsight: 'Your mind comes alive when a challenge stretches your intelligence.',
    rootCause: 'Deep problem-solving',
    futureArchetype: 'The Analytical Solver',
    microActions: {
      hours24: 'Protect 30 minutes for uninterrupted deep thinking.',
      days7: 'Identify your highest-complexity task and work on it during peak energy.',
      days30: 'Redesign one part of your workflow to include regular deep-work blocks.'
    }
  },
  'Q2-b': {
    keyInsight: 'You enter deep flow when you\'re building or designing something new.',
    rootCause: 'Creative expression',
    futureArchetype: 'The Creative Builder',
    microActions: {
      hours24: 'Start or sketch one creative idea — even a small one.',
      days7: 'Dedicate a creative block (no pressure, just exploration).',
      days30: 'Begin a mini-project that embodies your creative identity.'
    }
  },
  'Q2-c': {
    keyInsight: 'You lose track of time when you\'re uplifting, coaching, or enabling others.',
    rootCause: 'Empowerment',
    futureArchetype: 'The Empowering Guide',
    microActions: {
      hours24: 'Offer one person a genuine moment of guidance or listening.',
      days7: 'Identify the types of people you naturally empower best.',
      days30: 'Initiate a recurring coaching, mentoring, or peer-support activity.'
    }
  },
  'Q2-d': {
    keyInsight: 'You thrive when you turn chaos into clarity and structure.',
    rootCause: 'Systems thinking',
    futureArchetype: 'The Clarity Architect',
    microActions: {
      hours24: 'Clean up one chaotic area of your workflow or inbox.',
      days7: 'Design or refine one process that removes friction.',
      days30: 'Build a simple framework or system that brings recurring clarity to a complex problem.'
    }
  },
  'Q2-e': {
    keyInsight: 'Patterns, systems, and data unlock your strongest flow state.',
    rootCause: 'Pattern recognition',
    futureArchetype: 'The Insight Decoder',
    microActions: {
      hours24: 'Analyze one small pattern in your current work — numbers, behaviour, or outcomes.',
      days7: 'Build a simple dashboard, sheet, or list that tracks a meaningful pattern.',
      days30: 'Conduct a deeper analysis project that gives you a new perspective on your domain.'
    }
  },
  'Q2-f': {
    keyInsight: 'You flow best when thinking long-term, shaping direction, and imagining futures.',
    rootCause: 'Strategic vision',
    futureArchetype: 'The Strategic Futurist',
    microActions: {
      hours24: 'Write down one long-term possibility or idea you believe in.',
      days7: 'Create a simple 6-month or 1-year vision map for one area of your work or life.',
      days30: 'Lead or initiate a strategic conversation with your team or stakeholders.'
    }
  },
  'Q2-g': {
    keyInsight: 'You enter flow when working alongside driven, high-energy people.',
    rootCause: 'Collective energy',
    futureArchetype: 'The Collaborative Catalyst',
    microActions: {
      hours24: 'Connect with one high-energy colleague and share ideas.',
      days7: 'Join or initiate a small group/crew that shares your ambition.',
      days30: 'Commit to a collaborative project that energizes you.'
    }
  },
  'Q2-h': {
    keyInsight: 'Your deepest flow emerges in solitude, without interruptions.',
    rootCause: 'Deep focus',
    futureArchetype: 'The Independent Deep-Worker',
    microActions: {
      hours24: 'Block a 45-minute uninterrupted deep-work session.',
      days7: 'Build a ritual or environment that signals focus time to others.',
      days30: 'Restructure part of your workflow to protect regular focus blocks.'
    }
  },
  'Q2-i': {
    keyInsight: 'Flow is rare because your work is too scattered to sustain deep concentration.',
    rootCause: 'Fragmentation',
    futureArchetype: 'The Suppressed Performer',
    microActions: {
      hours24: 'Eliminate or delegate one draining micro-task.',
      days7: 'Identify your top three weekly priorities and protect them.',
      days30: 'Redesign your workflow to reduce task-switching and increase focus blocks.'
    }
  },
  'Q2-j': {
    keyInsight: 'Your real strengths are still hidden — flow hasn\'t found its doorway yet.',
    rootCause: 'Untested potential',
    futureArchetype: 'The Emerging Talent',
    microActions: {
      hours24: 'Try one new task or method, even briefly — observe what feels natural.',
      days7: 'Experiment with different roles, activities, or contexts to see what energizes you.',
      days30: 'Create a strength-discovery journal tracking what feels draining vs energizing.'
    }
  }
}; */

// Get default insight for all questions (Q1-Q10) from JSON
function getDefaultInsight(questionId: number, option: string): any {
  // Find the question in the JSON data
  const questionData = scoringLogicData.digitalTwinScoringFramework.questions.find(
    (q: any) => q.questionId === questionId
  );

  if (!questionData) {
    return {
      keyInsight: `Option ${option.toUpperCase()}`,
      rootCause: `Growth dimension for question ${questionId}`,
      futureArchetype: 'The Evolving Professional',
      microActions: {
        hours24: 'Reflect on this dimension today.',
        days7: 'Take one action aligned with your insight.',
        days30: 'Integrate learning from this dimension into your career strategy.'
      }
    };
  }

  // Find the specific option in the scoring options
  const optionData = questionData.scoringOptions.find(
    (opt: any) => opt.option === option
  );

  if (!optionData) {
    return {
      keyInsight: `Option ${option.toUpperCase()}`,
      rootCause: `Growth dimension for question ${questionId}`,
      futureArchetype: 'The Evolving Professional',
      microActions: {
        hours24: 'Reflect on this dimension today.',
        days7: 'Take one action aligned with your insight.',
        days30: 'Integrate learning from this dimension into your career strategy.'
      }
    };
  }

  // Return data from JSON
  return {
    keyInsight: optionData.depiction || optionData.keyInsight || `Option ${option.toUpperCase()}`,
    rootCause: optionData.growthBlocker || `Growth dimension for question ${questionId}`,
    futureArchetype: optionData.archetype || optionData.futureArchetype || 'The Evolving Professional',
    title: optionData.title || '',
    microActions: optionData.microActions || {
      hours24: 'Reflect on this dimension today.',
      days7: 'Take one action aligned with your insight.',
      days30: 'Integrate learning from this dimension into your career strategy.'
    }
  };
}

// Get insight data for a specific question and option
function getInsightData(questionId: number, option: string): any {
  // const key = `Q${questionId}-${option}`;

  // if (insightData[key]) {
  //   return insightData[key];
  // }

  // For all questions, return default templates (insightData commented out)
  return getDefaultInsight(questionId, option);
}

/**
 * Calculate Digital Twin scores from user responses
 * @param answers Object with questionId -> selectedOption (e.g., { "1": "a", "2": "c" })
 * @returns Complete scoring result with all metrics
 */
export function calculateDigitalTwinScores(answers: { [key: string]: string }): DigitalTwinScoringResult {
  const scores: DigitalTwinScore[] = [];
  let totalScore = 0;
  let answeredCount = 0;

  // Process all 10 questions
  for (let questionId = 1; questionId <= 10; questionId++) {
    const selectedOption = answers[questionId.toString()];
    const metadata = questionMetadata[questionId - 1];

    if (!metadata) {
      console.warn(`No metadata for question ${questionId}`);
      continue;
    }

    // If no answer, create placeholder with 0 score
    if (!selectedOption) {
      scores.push({
        questionId,
        dimensionName: metadata.theme,
        indexName: metadata.index,
        scoreType: metadata.scoreType,
        userScore: 0,
        maxScore: 100,
        percentageScore: 0,
        selectedOption: '',
        description: 'This question was not answered in the assessment.',
        insight: 'This question was not answered in the assessment.',
        recommendation: 'Please complete all questions to receive detailed insights.',
        archetype: 'Pending',
        microActions: { hours24: '', days7: '', days30: '' }
      });
      continue;
    }

    // Get score from scale
    const score = scoringScale[selectedOption] || 0;
    totalScore += score;
    answeredCount++;

    // Get insight data
    const insightInfo = getInsightData(questionId, selectedOption);

    scores.push({
      questionId,
      dimensionName: metadata.theme,
      indexName: metadata.index,
      scoreType: metadata.scoreType,
      userScore: score,
      maxScore: 100,
      percentageScore: score,
      selectedOption,
      description: insightInfo?.keyInsight || 'Your response has been recorded.',
      insight: insightInfo?.keyInsight || '',
      recommendation: insightInfo?.rootCause || '',
      archetype: insightInfo?.futureArchetype || 'In Development',
      title: insightInfo?.title || '',
      microActions: insightInfo?.microActions || { hours24: '', days7: '', days30: '' }
    });
  }

  // Calculate metrics (only from answered questions)
  const averageScore = answeredCount > 0 ? Math.round(totalScore / answeredCount) : 0;

  // Get lowest and highest (excluding unanswered)
  const answeredScores = scores.filter(s => s.userScore > 0);
  const lowestScore = answeredScores.length > 0
    ? answeredScores.reduce((min, s) => s.userScore < min.userScore ? s : min)
    : scores[0];
  const highestScore = answeredScores.length > 0
    ? answeredScores.reduce((max, s) => s.userScore > max.userScore ? s : max)
    : scores[0];

  // Determine readiness level and archetype
  let readinessLevel = 'Highly Ready';
  let primaryArchetype = 'The Aligned Visionary';
  let overallInsight = '';

  if (averageScore >= 80) {
    readinessLevel = 'Highly Ready for Growth';
    primaryArchetype = 'The Aligned Visionary';
    overallInsight =
      'Your assessment shows strong alignment across most dimensions. You have clarity about your purpose, access to meaningful work, and emotional engagement with your career. Your focus should be on leveraging this momentum for expanded impact and continued evolution.';
  } else if (averageScore >= 60) {
    readinessLevel = 'Moderately Ready with Emerging Clarity';
    primaryArchetype = 'The Awakening Integrator';
    overallInsight =
      'Your career shows promising potential, but there are specific areas requiring attention. You have the foundation for meaningful growth, but intentional recalibration in key areas will unlock your next level.';
  } else if (averageScore >= 40) {
    readinessLevel = 'In Transition Mode';
    primaryArchetype = 'The Identity Rebuilder';
    overallInsight =
      'You are in an important inflection point. Your assessment indicates significant disruption or realignment happening internally. This is not a weakness—it is a sign of evolution.';
  } else {
    readinessLevel = 'Emerging Clarity Needed';
    primaryArchetype = 'The Seeker';
    overallInsight =
      'Your assessment indicates you are in early exploration. This is a valuable starting point for discovering your next direction. Focus on experimentation and self-discovery.';
  }

  // Build action plan from lowest-scoring areas
  const lowestAreas = scores.filter(s => s.userScore > 0).sort((a, b) => a.userScore - b.userScore).slice(0, 3);
  const actionPlan = {
    immediate: lowestAreas.map(area => area.microActions.hours24).filter(Boolean),
    shortTerm: lowestAreas.map(area => area.microActions.days7).filter(Boolean),
    longTerm: lowestAreas.map(area => area.microActions.days30).filter(Boolean)
  };

  return {
    scores,
    overallScore: averageScore,
    readinessLevel,
    primaryArchetype,
    overallInsight,
    keyInsights: [
      overallInsight,
      `Your primary archetype is: ${primaryArchetype}`,
      `Readiness level: ${readinessLevel}`
    ],
    actionPlan,
    lowestScore,
    highestScore
  };
}
