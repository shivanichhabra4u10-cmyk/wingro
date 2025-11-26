import { Request, Response } from 'express';
import { detailedInsightsMap } from './detailedInsightsMap';

export interface DigitalTwinScores {
  questionId: number;
  questionTheme: string;
  indexName: string;
  scoreType: string;
  scoreMeasure: string;
  userScore: number;
  maxScore: number;
  percentageScore: number;
  selectedOption: string;
  title: string;
  insight: string;
  recommendation: string;
  archetype: string;
  rootCause: string;
  growthBlocker: string;
  hiddenStrength: string;
  hiddenDesire: string;
  digitalTwinMessage: string;
  microActions: {
    hours24: string;
    days7: string;
    days30: string;
  };
}

export interface DigitalTwinAssessmentResult {
  assessmentId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  completedAt: Date;
  scores: DigitalTwinScores[];
  summaryMetrics: {
    averageScore: number;
    lowestScore: DigitalTwinScores;
    highestScore: DigitalTwinScores;
    readinessLevel: string;
    primaryArchetype: string;
    overallInsight: string;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

// Scoring mapping for each question and option
const scoringMap: { [key: number]: { [key: string]: number } } = {
  1: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // IPA Index
  2: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // FSA Index
  3: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // CMT Index
  4: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // WEV Index
  5: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // SEL Index
  6: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // CAN Index
  7: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // LIE Index
  8: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // VWH Index
  9: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // RRI Index
  10: { a: 100, b: 90, c: 80, d: 70, e: 60, f: 50, g: 40, h: 30, i: 20, j: 10 }, // PEA Index
};

const questionMetadata: { [key: number]: { theme: string; index: string; scoreType: string; measure: string } } = {
  1: {
    theme: 'Identity & Purpose Alignment',
    index: 'Identity–Purpose Alignment Index (IPA Index)',
    scoreType: 'Readiness Score',
    measure: 'Measures how deeply work aligns with your inner purpose & evolving identity.'
  },
  2: {
    theme: 'Flow & Strength Expression',
    index: 'Flow State Access Index (FSA Index)',
    scoreType: 'Strength Expression Score',
    measure: 'Measures how consistently and powerfully you access flow through natural strengths.'
  },
  3: {
    theme: 'Career Trajectory Perception',
    index: 'Career Momentum Trajectory Index (CMT Index)',
    scoreType: 'Growth Momentum Score',
    measure: 'Captures the true trajectory—accelerating, plateauing, drifting, or pivot-ready.'
  },
  4: {
    theme: 'Emotional Relationship with Work',
    index: 'Work–Emotion Vitality Index (WEV Index)',
    scoreType: 'Emotional Health Score',
    measure: 'Measures emotional connection, energy quality, and psychological engagement with work.'
  },
  5: {
    theme: 'Energy & Workload Reality',
    index: 'Sustainable Energy Load Index (SEL Index)',
    scoreType: 'Burnout Risk Score',
    measure: 'Assesses energy rhythm, overload patterns, and burnout thresholds.'
  },
  6: {
    theme: 'Cultural Tension Signal',
    index: 'Cultural Alignment Need Index (CAN Index)',
    scoreType: 'Cultural Friction Score',
    measure: 'Shows what cultural shift your system is craving — trust, safety, recognition, etc.'
  },
  7: {
    theme: 'Leadership Energy Drain / Boost',
    index: 'Leadership Impact Energy Index (LIE Index)',
    scoreType: 'Leadership Influence Score',
    measure: 'Measures how your manager impacts your energy, confidence, and growth potential.'
  },
  8: {
    theme: 'Meaning & Values Alignment',
    index: 'Values–Work Harmony Index (VWH Index)',
    scoreType: 'Values Alignment Score',
    measure: 'Evaluates how closely your work matches your core beliefs, identity, and meaning.'
  },
  9: {
    theme: 'Reinvention & Future-Readiness',
    index: 'Reinvention Readiness Index (RRI Index)',
    scoreType: 'Reinvention Readiness Score',
    measure: 'Measures how emotionally and mentally prepared you are for major career change.'
  },
  10: {
    theme: 'Hidden Passion & Future Self Expression',
    index: 'Passion Expression Alignment Index (PEA Index)',
    scoreType: 'Passion Clarity Score',
    measure: 'Reveals your deepest passion signature and how clearly it aligns with future identity.'
  }
};

// Detailed insights for each question and option combination
const insightMap: { [key: string]: { title: string; insight: string; archetype: string; recommendation: string; microActions: { hours24: string; days7: string; days30: string } } } = {
  'Q1-a': {
    title: 'Your Inner Compass: The Power of Being in Alignment',
    insight: 'Your response reflects a rare and powerful Identity Emotional Story — the story of someone whose work and inner self are finally speaking the same language. This level of alignment does not happen by accident; it is a signal that your values, talents, and personal evolution are moving in the same direction.',
    archetype: 'The Aligned Visionary',
    recommendation: 'Your alignment is exceptional, but watch for complacency. The danger is not confusion; it is settling for "good" when "extraordinary" is possible. Your identity-based hidden desire is expansion — you want to shape something larger than yourself, express your uniqueness at scale, and build a legacy beyond daily work.',
    microActions: {
      hours24: 'Write a one-line statement about who you are becoming — and ensure it feels alive.',
      days7: 'Identify one part of your work that deserves a bigger spotlight or bolder expression.',
      days30: 'Begin integrating a new behaviour, project, or ritual that expands your identity, not just maintains it.'
    }
  },
  'Q1-b': {
    title: 'Your Identity Signal: Meaning Exists, But It Needs Strengthening',
    insight: 'Your choice reflects an Identity Emotional Story of partial alignment — moments where your work feels meaningful, but the connection doesn\'t hold long enough. The main Identity-Level Growth Blocker is fragmentation — a life lived in pockets of meaning rather than a steady rhythm of alignment.',
    archetype: 'The Awakening Integrator',
    recommendation: 'You recognise when something feels meaningful, and that awareness is your advantage. You want your work to reflect your identity more consistently, not in scattered moments. Build around these moments of meaning — they are signals, not accidents.',
    microActions: {
      hours24: 'Identify one moment this week where you felt most "yourself."',
      days7: 'Pinpoint what created that meaning and how to repeat it.',
      days30: 'Integrate one aligned behaviour or responsibility into your weekly rhythm.'
    }
  },
  'Q1-c': {
    title: 'The Identity Gap: When Liking Your Work Isn\'t the Same as Living Your Purpose',
    insight: 'This response carries an Identity Emotional Story rooted in comfort without fulfilment. You appreciate what you do, but something in your inner world knows there is more. The mild disconnect is between liking a role and being expressed by a role.',
    archetype: 'The Quiet Seeker',
    recommendation: 'You are ready for inner clarity before taking bigger steps. Your Identity-Based Hidden Desire is depth — you want work that expresses something core, something meaningful, something only you can bring. Liking is fine… but you\'re meant for something that feels like truth.',
    microActions: {
      hours24: 'Reflect on one thing your soul wishes you could express more.',
      days7: 'Identify where your current work allows even a small piece of your deeper self to show.',
      days30: 'Add or request one activity that aligns with your inner purpose.'
    }
  },
  'Q1-d': {
    title: 'The Identity Numbness: When Your Inner Self Goes Quiet',
    insight: 'Your response reveals an Identity Emotional Story marked by numbness — a sense of moving through your days without true presence. Your identity is no longer participating in your work, even if your outer self continues to function. This leads to a deep Identity-Level Growth Blocker: identity drift.',
    archetype: 'The Disconnected Wanderer',
    recommendation: 'Detachment itself is a signal. It is your identity\'s way of telling you, "This is not feeding me anymore." Your Identity-Based Hidden Desire is awakening — you want to feel alive again, to reconnect with something that holds emotional and personal meaning.',
    microActions: {
      hours24: 'Do one task today with full presence — no rush, no autopilot.',
      days7: 'Identify what part of your work you feel most emotionally absent from.',
      days30: 'Introduce or revive one activity that feels emotionally meaningful, even if small.'
    }
  },
  'Q1-e': {
    title: 'The Identity Tension: When Your Purpose is Ready but Your Environment Isn\'t',
    insight: 'This choice embodies an Identity Emotional Story of clarity without expression. You know who you are becoming, but your current role does not yet provide the space to express that truth. Your internal evolution has outpaced the external environment.',
    archetype: 'The Unexpressed Visionary',
    recommendation: 'Your clarity of purpose is one of the strongest indicators of future leadership. Your Identity-Based Hidden Desire is amplification: you want an environment that matches your ambition, aligns with your values, and honours your purpose. Your environment is waiting — it\'s time to expand.',
    microActions: {
      hours24: 'Write down your purpose in a single sentence — keep it visible.',
      days7: 'Identify one area of your current work where your purpose can be expressed, even partially.',
      days30: 'Begin aligning your external ecosystem — conversations, roles, or projects — with your internal purpose.'
    }
  },
  'Q1-f': {
    title: 'The Identity Emergence: When Your Next Purpose Is Still Forming',
    insight: 'Your response tells an Identity Emotional Story of quiet transformation — a purpose that is forming beneath the surface, not yet fully shaped, but undeniably present. Your identity is evolving faster than your language or clarity.',
    archetype: 'The Emerging Pathfinder',
    recommendation: 'The fertile uncertainty you feel is powerful — it precedes breakthroughs. Your Identity-Based Hidden Desire is direction — you want your purpose to come into focus, to name it, understand it, and integrate it into your work. Stay curious.',
    microActions: {
      hours24: 'Notice what topics or conversations spark you unexpectedly.',
      days7: 'Document patterns in what energizes you and what drains you.',
      days30: 'Begin a small exploration project (learning, mentoring, experimenting) to test your emerging purpose.'
    }
  },
  'Q1-g': {
    title: 'The Identity Disruption: When Questioning Becomes the Beginning',
    insight: 'Your answer reveals an intense Identity Emotional Story — one where the old version of you no longer fits, and the new version has not yet fully formed. Your inner system is recalibrating, pulling you out of certainty so you can reshape your identity.',
    archetype: 'The Identity Rebuilder',
    recommendation: 'Questioning is not confusion; it is awareness. People who question deeply are the ones who evolve the most profoundly. Your Identity-Based Hidden Desire is truth — a desire to know who you are without conditioning, expectation, or inherited identity roles.',
    microActions: {
      hours24: 'Write down the top 3 things you are no longer willing to tolerate from your old identity.',
      days7: 'Describe moments where you felt like your "true self"—notice patterns.',
      days30: 'Begin removing one identity-layer you\'ve outgrown (role, behaviour, expectation, or belief).'
    }
  },
  'Q1-h': {
    title: 'The Identity Mismatch: When You\'ve Outgrown Your Role',
    insight: 'Your response reveals a clear Identity Emotional Story of containment — a sense of being too big for the box you\'re currently in. You\'re growing, but your role is static. Your outer responsibilities no longer match your inner capabilities or aspirations.',
    archetype: 'The Outgrowing Architect',
    recommendation: 'You are not stuck — your identity has simply outgrown the space. Your Identity-Based Hidden Desire is expansion — a desire for a role that reflects your emerging self, not your past self. Your next chapter is calling for larger responsibilities, deeper meaning, or higher influence.',
    microActions: {
      hours24: 'List one responsibility you\'ve outgrown and one you want to grow into.',
      days7: 'Identify the environments where your emerging identity fits better.',
      days30: 'Initiate a role redesign conversation or begin pursuing opportunities aligned with your new identity.'
    }
  },
  'Q1-i': {
    title: 'The Identity Pull: When Something New Calls Before You Know Its Name',
    insight: 'Your answer illustrates an Identity Emotional Story of curiosity mixed with uncertainty. A shift is happening at a subconscious level before it becomes conscious. Your identity is alive and signalling.',
    archetype: 'The Emerging Explorer',
    recommendation: 'You feel the "pull" even without seeing the destination, which means your inner compass is active. Your Identity-Based Hidden Desire is exploration — a desire to discover what\'s next rather than commit prematurely. You don\'t need to know the destination. You just need to honour the pull.',
    microActions: {
      hours24: 'Write down what you feel pulled away from — clarity often begins there.',
      days7: 'Experiment with one new idea, project, or domain to test the pull.',
      days30: 'Begin documenting identity patterns that show up repeatedly — themes emerge long before purpose names itself.'
    }
  },
  'Q1-j': {
    title: 'The Identity Rebirth: You\'re Actively Becoming Someone New',
    insight: 'Your response expresses an Identity Emotional Story of active reinvention — you\'re not stuck, lost, or confused; you\'re reconstructing yourself with intention. You\'ve recognised that your former self has served its purpose, and a more meaningful identity is ready to be shaped.',
    archetype: 'The Conscious Reconstructor',
    recommendation: 'Shaping a new identity requires emotional and cognitive energy, but your powerful intentionality is carrying you. Your Inner Compass Strength is choosing who you want to become, not waiting for circumstances to decide. You\'re not finding yourself. You\'re building yourself.',
    microActions: {
      hours24: 'Define one trait your "next self" must embody.',
      days7: 'Engage in an activity or decision that reflects that new identity trait.',
      days30: 'Start eliminating one behaviour or belief that belongs to your old identity.'
    }
  },
  'Q2-a': {
    title: 'Your Cognitive Edge: The Power of Deep Problem-Solving Flow',
    insight: 'Your response tells a Flow Emotional Story of mental expansion — the feeling of being fully alive when a challenge requires depth, logic, and intellectual stretch. Your mind thrives when pushed beyond comfort.',
    archetype: 'The Analytical Solver',
    recommendation: 'You are a deep thinker, someone who naturally moves toward complexity and clarity. Your Strength Desire is mastery — the satisfaction of cracking tough problems and understanding systems at a fundamental level. Your mind grows through complexity — give it bigger problems.',
    microActions: {
      hours24: 'Protect 30 minutes for uninterrupted deep thinking.',
      days7: 'Identify your highest-complexity task and work on it during peak energy.',
      days30: 'Redesign one part of your workflow to include regular deep-work blocks.'
    }
  },
  'Q2-b': {
    title: 'Your Creative Engine: Innovation Is Your Natural State',
    insight: 'Your choice reveals a Flow Emotional Story of creative ignition — you enter flow when imagination and structure meet to form something new. You have the ability to turn ideas into tangible output.',
    archetype: 'The Creative Builder',
    recommendation: 'Your creator\'s mind is your signature strength — the ability to build, design, innovate, and give shape to insights. Routine will dim your creative energy. Your Strength Desire is expression — the joy of seeing your ideas come alive. Your ideas don\'t want permission — they want expression.',
    microActions: {
      hours24: 'Start or sketch one creative idea — even a small one.',
      days7: 'Dedicate a creative block (no pressure, just exploration).',
      days30: 'Begin a mini-project that embodies your creative identity.'
    }
  },
  'Q2-c': {
    title: 'Your Empowerment Strength: You Grow When Others Grow',
    insight: 'Your answer reveals a Flow Emotional Story shaped by connection — you feel most alive when you help others rise. You enter flow through listening, guiding, and empowering.',
    archetype: 'The Empowering Guide',
    recommendation: 'Your ability to translate insight into impact for others is your signature strength. Your Strength Desire is contribution — the emotional fulfilment of helping someone find clarity, confidence, or direction. Your strength grows when you lift others. Don\'t underestimate this gift.',
    microActions: {
      hours24: 'Offer one person a genuine moment of guidance or listening.',
      days7: 'Identify the types of people you naturally empower best.',
      days30: 'Initiate a recurring coaching, mentoring, or peer-support activity.'
    }
  },
  'Q2-d': {
    title: 'Your Clarity Superpower: Turning Chaos Into Order',
    insight: 'Your response reflects a unique Flow Emotional Story — the satisfaction and calm that arise when you transform confusion into coherence. Your mind thrives in complex, disorganized environments where others feel overwhelmed.',
    archetype: 'The Clarity Architect',
    recommendation: 'Your natural ability to impose clarity on chaos with precision is rare and valuable. Your Strength Desire is order — the joy of making things understandable, logical, and manageable. You bring clarity to places that fear complexity. That is your rare gift.',
    microActions: {
      hours24: 'Clean up one chaotic area of your workflow or inbox.',
      days7: 'Design or refine one process that removes friction.',
      days30: 'Build a simple framework or system that brings recurring clarity to a complex problem at work.'
    }
  },
  'Q2-e': {
    title: 'Your Pattern-Mind: Seeing What Others Miss',
    insight: 'This choice reveals a Flow Emotional Story rooted in discovery — you feel most alive when uncovering insights hidden beneath the surface. Your mind sees connections, structures, and trends that others overlook.',
    archetype: 'The Insight Decoder',
    recommendation: 'Your strength is synthesizing information into clear insights. Your Strength Desire is understanding — the intellectual satisfaction of decoding how things work and why they behave the way they do. Patterns speak to you — and you know how to listen.',
    microActions: {
      hours24: 'Analyze one small pattern in your current work — numbers, behaviour, or outcomes.',
      days7: 'Build a simple dashboard, sheet, or list that tracks a meaningful pattern.',
      days30: 'Conduct a deeper analysis project that gives you a new perspective on your domain.'
    }
  },
  'Q2-f': {
    title: 'Your Strategic Mind: Seeing Tomorrow Before Others Do',
    insight: 'Your response reveals a Flow Emotional Story shaped by vision — you thrive when you look beyond today and imagine what could be. Your mind operates naturally in long-term thinking, scenario planning, and high-level strategy.',
    archetype: 'The Strategic Futurist',
    recommendation: 'Your ability to see patterns of possibility far ahead of others is your signature strength. Your Strength Desire is impact — the satisfaction of shaping direction, influencing the big picture, and contributing to meaningful decisions. Your mind lives in the future — and pulls others toward it.',
    microActions: {
      hours24: 'Write down one long-term possibility or idea you believe in.',
      days7: 'Create a simple 6-month or 1-year vision map for one area of your work or life.',
      days30: 'Lead or initiate a strategic conversation with your team or stakeholders.'
    }
  },
  'Q2-g': {
    title: 'Your Collaboration Genius: You Rise in High-Energy Environments',
    insight: 'Your choice reveals a Flow Emotional Story built around connection, shared momentum, and collective intelligence. You enter flow when surrounded by people who match your energy, ambition, and pace.',
    archetype: 'The Collaborative Catalyst',
    recommendation: 'Your catalytic influence elevates groups when you are aligned with the right people. Your Strength Desire is belonging with high-performing peers who ignite your enthusiasm. You don\'t just work well with energized people — you become your best self among them.',
    microActions: {
      hours24: 'Connect with one high-energy colleague and share ideas.',
      days7: 'Join or initiate a small group/crew that shares your ambition.',
      days30: 'Commit to a collaborative project that energizes you.'
    }
  },
  'Q2-h': {
    title: 'Your Deep Independence: Flow Through Focused Solitude',
    insight: 'Your response expresses a Flow Emotional Story anchored in solitude, clarity, and control over your mental space. You thrive when your mind has room to concentrate without noise.',
    archetype: 'The Independent Deep-Worker',
    recommendation: 'Your ability to produce high-quality outcomes when given time, trust, and autonomy is your signature strength. Your Strength Desire is undisturbed focus — the satisfaction of completing meaningful work on your terms. Your best work happens in silence — honour that.',
    microActions: {
      hours24: 'Block a 45-minute uninterrupted deep-work session.',
      days7: 'Build a ritual or environment that signals focus time to others.',
      days30: 'Restructure part of your workflow to protect regular focus blocks.'
    }
  },
  'Q2-i': {
    title: 'Your Flow Breakdown: When Fragmentation Blocks Your Strengths',
    insight: 'Your selection reveals a Flow Emotional Story of fragmentation and fatigue — a lack of sustained focus or meaningful engagement in your work. Your environment likely forces context switching, multitasking, or crisis-driven work.',
    archetype: 'The Suppressed Performer',
    recommendation: 'Your real strengths exist but can\'t breathe in the current structure. Your Strength Desire is stability — the longing for space, clarity, and rhythm so your real strengths can re-emerge. Your strengths are not missing — they\'re suffocating. Remove the noise, and they\'ll return.',
    microActions: {
      hours24: 'Eliminate or delegate one draining micro-task.',
      days7: 'Identify your top three weekly priorities and protect them.',
      days30: 'Redesign your workflow to reduce task-switching and increase focus blocks.'
    }
  },
  'Q2-j': {
    title: 'Your Hidden Potential: When Strengths Are Waiting to Be Born',
    insight: 'Your answer tells a Flow Emotional Story of early-stage discovery — a sense of having potential but not yet knowing its expression. Your environment or experiences haven\'t yet revealed your natural flow zones.',
    archetype: 'The Emerging Talent',
    recommendation: 'You are standing at the edge of breakthrough. Your Strength Desire is exploration — a longing to experiment, try, stretch, and discover. Your strengths are not invisible — they are untested. Your future self is waiting for you to explore.',
    microActions: {
      hours24: 'Try one new task or method, even briefly — observe what feels natural.',
      days7: 'Experiment with different roles, activities, or contexts to see what energizes you.',
      days30: 'Create a strength-discovery journal tracking what feels draining vs energizing.'
    }
  }
};

// Helper function to get score for a question and option
export function getScoreForOption(questionId: number, option: string): number {
  return scoringMap[questionId]?.[option] || 0;
}

// Helper function to get insight for a question and option
export function getInsightForOption(questionId: number, option: string): any {
  const key = `Q${questionId}-${option}`;
  
  // First try detailed insights map (new comprehensive data)
  if (detailedInsightsMap[key]) {
    const insight = detailedInsightsMap[key];
    return {
      insight: insight.mainInsight,
      recommendation: insight.rootCause, // Using root cause as recommendation context
      archetype: insight.futureArchetype,
      microActions: insight.microActions,
      title: insight.title,
      rootCause: insight.rootCause,
      growthBlocker: insight.growthBlocker,
      hiddenStrength: insight.hiddenStrength,
      hiddenDesire: insight.hiddenDesire,
      digitalTwinMessage: insight.digitalTwinMessage
    };
  }
  
  // Fallback to legacy insight map with type casting
  const legacyInsight = insightMap[key];
  if (legacyInsight) {
    return {
      ...legacyInsight,
      title: legacyInsight.title || '',
      rootCause: '',
      growthBlocker: '',
      hiddenStrength: '',
      hiddenDesire: '',
      digitalTwinMessage: ''
    };
  }
  
  return null;
}

// Main function to calculate Digital Twin scores
export async function calculateDigitalTwinScores(
  assessmentId: string,
  firstName: string,
  lastName: string,
  email: string,
  responseData: any
): Promise<DigitalTwinAssessmentResult> {
  try {
    const scores: DigitalTwinScores[] = [];
    let totalScore = 0;
    let answeredCount = 0;

    // Process all 10 questions - ALWAYS return all 10
    for (let questionId = 1; questionId <= 10; questionId++) {
      const selectedOption = responseData.answers?.[questionId.toString()];
      const metadata = questionMetadata[questionId];

      if (!metadata) {
        console.warn(`No metadata for question ${questionId}`);
        continue;
      }

      // If no answer provided, still include the question with default score
      if (!selectedOption) {
        console.warn(`No answer provided for question ${questionId}`);
        scores.push({
          questionId,
          questionTheme: metadata.theme,
          indexName: metadata.index,
          scoreType: metadata.scoreType,
          scoreMeasure: metadata.measure,
          userScore: 0,
          maxScore: 100,
          percentageScore: 0,
          selectedOption: '',
          title: 'Not Answered',
          insight: 'This question was not answered in the assessment.',
          recommendation: 'Please complete all questions to receive detailed insights.',
          archetype: 'Pending',
          rootCause: '',
          growthBlocker: '',
          hiddenStrength: '',
          hiddenDesire: '',
          digitalTwinMessage: 'Complete this question to unlock your insights.',
          microActions: { hours24: '', days7: '', days30: '' }
        });
        continue;
      }

      const score = getScoreForOption(questionId, selectedOption);
      const insight = getInsightForOption(questionId, selectedOption);

      totalScore += score;
      answeredCount++;

      if (insight) {
        scores.push({
          questionId,
          questionTheme: metadata.theme,
          indexName: metadata.index,
          scoreType: metadata.scoreType,
          scoreMeasure: metadata.measure,
          userScore: score,
          maxScore: 100,
          percentageScore: score,
          selectedOption,
          title: insight?.title || '',
          insight: insight?.insight || '',
          recommendation: insight?.recommendation || '',
          archetype: insight?.archetype || '',
          rootCause: insight?.rootCause || '',
          growthBlocker: insight?.growthBlocker || '',
          hiddenStrength: insight?.hiddenStrength || '',
          hiddenDesire: insight?.hiddenDesire || '',
          digitalTwinMessage: insight?.digitalTwinMessage || '',
          microActions: insight?.microActions || { hours24: '', days7: '', days30: '' }
        });
      }
    }

    // Calculate summary metrics (only from answered questions)
    const averageScore = answeredCount > 0 ? Math.round(totalScore / answeredCount) : 0;
    
    // Get lowest and highest scores (excluding unanswered ones with 0 scores)
    const answeredScores = scores.filter(s => s.userScore > 0);
    const lowestScore = answeredScores.length > 0 
      ? answeredScores.reduce((min, score) => (score.userScore < min.userScore ? score : min))
      : scores[0]; // If no answered questions, return first
    const highestScore = answeredScores.length > 0 
      ? answeredScores.reduce((max, score) => (score.userScore > max.userScore ? score : max))
      : scores[0]; // If no answered questions, return first

    // Determine readiness level
    let readinessLevel = 'Highly Ready';
    let primaryArchetype = 'The Aligned Visionary';
    let overallInsight = '';

    if (averageScore >= 80) {
      readinessLevel = 'Highly Ready for Growth';
      overallInsight =
        'Your assessment shows strong alignment across most dimensions. You have clarity about your purpose, access to meaningful work, and emotional engagement with your career. Your focus should be on leveraging this momentum for expanded impact and continued evolution.';
    } else if (averageScore >= 60) {
      readinessLevel = 'Moderately Ready with Emerging Clarity';
      primaryArchetype = 'The Awakening Integrator';
      overallInsight =
        'Your career shows promising potential, but there are specific areas requiring attention. You have the foundation for meaningful growth, but intentional recalibration in key areas will unlock your next level. Focus on bridging the gaps between your current experience and your emerging vision.';
    } else if (averageScore >= 40) {
      readinessLevel = 'In Transition Mode';
      primaryArchetype = 'The Identity Rebuilder';
      overallInsight =
        'You are in an important inflection point. Your assessment indicates significant disruption or realignment happening internally. This is not a weakness—it is a sign of evolution. Now is the time to consciously reshape your career direction and working environment to match your emerging identity.';
    } else {
      readinessLevel = 'Urgent Reset Needed';
      primaryArchetype = 'The Reset Seeker';
      overallInsight =
        'Your assessment signals that significant realignment is needed. You are operating in misalignment across multiple dimensions, and your system is asking for intervention. This is an opportunity for profound renewal. Begin with immediate actions focused on creating breathing room and clarity.';
    }

    // Build action plan
    const actionPlan: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    } = {
      immediate: [],
      shortTerm: [],
      longTerm: []
    };

    // Add action items based on lowest scores
    const lowestAreas = scores.sort((a, b) => a.userScore - b.userScore).slice(0, 3);

    lowestAreas.forEach((area: DigitalTwinScores) => {
      actionPlan.immediate.push(area.microActions.hours24 as string);
      actionPlan.shortTerm.push(area.microActions.days7 as string);
      actionPlan.longTerm.push(area.microActions.days30 as string);
    });

    const result: DigitalTwinAssessmentResult = {
      assessmentId,
      firstName,
      lastName,
      email,
      completedAt: new Date(),
      scores,
      summaryMetrics: {
        averageScore,
        lowestScore,
        highestScore,
        readinessLevel,
        primaryArchetype,
        overallInsight
      },
      actionPlan
    };

    return result;
  } catch (error) {
    console.error('Error calculating Digital Twin scores:', error);
    throw error;
  }
}
