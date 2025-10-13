import React, { useState } from "react";
// Returns the Part and Section label for each step
function getPartSectionLabel(step: number): string {
  // Map step to part/section
  if (step === 0) return "Part 1 — Founder & Growth Readiness DNA\nSection A — Growth Mindset & Motivation";
  if (step === 1) return "Part 1 — Founder & Growth Readiness DNA\nSection B — Founding Team & Execution Velocity";
  if (step === 2) return "Part 1 — Founder & Growth Readiness DNA\nSection C — Growth Bottleneck Diagnosis";
  if (step === 3) return "Part 1 — Founder & Growth Readiness DNA\nSection D — Market & Revenue Readiness";
  if (step === 4) return "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection A — Financial Health & Strategic Control";
  if (step === 5) return "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection B — Scalability & Market Size";
  if (step === 6) return "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection C — Investment History & Readiness";
   if (step === 7) return "Part 3 — Innovation, Operational Excellence & Impact Leadership\nSection A — Innovation Edge & Technology Readiness";
  if (step === 8) return "Part 3 — Innovation, Operational Excellence & Impact Leadership\nSection B — Operational Discipline & Scalability";
  if (step === 9) return "Part 3 — Innovation, Operational Excellence & Impact Leadership\nSection C — Customer Experience & Retention Flywheel";
  if (step === 10) return "Part 3 — Innovation, Operational Excellence & Impact Leadership\nSection D — Impact & Ethical Scalability";
  if (step === 11) return "Part 3 — Innovation, Operational Excellence & Impact Leadership\nSection E — Investor Narrative & Story Clarity";
  // Extend for other steps/parts/sections as needed
  return `Part ${step + 1}`;
}

// This is a multi-step screening questionnaire for Wingrox AI e-Accelerator™
// Each section is a step, with radio/checkbox questions and some text/file uploads

type Question = {
  label: string;
  options?: string[];
  type: "radio" | "checkbox" | "text" | "file" | "number";
  name: string;
  optional?: boolean;
};

type Section = {
  title: string;
  questions: Question[];
};

const sections: Section[] = [
  // Part 1 — Founder & Growth Readiness DNA
  {
    title: "Section A — Growth Mindset & Motivation",
    questions: [
      {
        label: "What best describes your reason for joining an accelerator now?",
        options: [
          "To scale sales and revenue",
          "To raise institutional funding",
          "To enter new markets or geographies",
          "To refine strategy and unit economics",
          "To access mentors & playbooks",
          "To build investor-ready storytelling",
          "To validate product-market fit (PMF)",
          "To recruit senior talent",
          "To prepare for international expansion",
          "To learn from peer founders",
        ],
        type: "radio",
        name: "reasonForJoining",
      },
      {
        label: "Which statement best defines your current company stage?",
        options: [
          "Idea stage, validating problem",
          "Prototype ready",
          "MVP tested with early users",
          "Paying customers (< ₹1 L MRR)",
          "Consistent revenue (₹1–10 L MRR)",
          "Scalable traction (₹10–50 L MRR)",
          "Profitable but stagnant growth",
          "Seed-funded, pre-Series A",
          "Series A + seeking global expansion",
          "Pivoting after a failed model",
        ],
        type: "radio",
        name: "companyStage",
      },
      {
        label: "What outcome would make the accelerator a huge success for you?",
        options: [
          "Achieving 3× revenue growth",
          "Securing seed/VC funding",
          "Expanding to new regions",
          "Acquiring marquee clients",
          "Establishing strong unit economics",
          "Building a leadership team",
          "Launching a new product line",
          "Strengthening brand credibility",
          "Learning a scalable system",
          "Finding the right strategic partner",
        ],
        type: "radio",
        name: "successOutcome",
      },
      {
        label: "What motivates you most to keep building?",
        options: [
          "Freedom & ownership",
          "Purpose & social impact",
          "Creating jobs & opportunities",
          "Recognition & credibility",
          "Investor confidence",
          "Customer transformation",
          "Legacy for family/community",
          "Curiosity for innovation",
          "Competition drive",
          "Learning through building",
        ],
        type: "radio",
        name: "motivation",
      },
      {
        label: "How do you define ‘growth’ for your venture today?",
        options: [
          "Top-line revenue increase",
          "Profitability & healthy margins",
          "Customer retention & referrals",
          "Market share gain",
          "Product adoption & stickiness",
          "Brand awareness & media visibility",
          "Funding milestones",
          "Employee growth & culture",
          "Impact & SDG alignment",
          "Combination of the above",
        ],
        type: "radio",
        name: "growthDefinition",
      },
      {
        label: "Current founder focus ratio (where your weekly time goes):",
        options: [
          "60 % operations / 40 % strategy",
          "70 % sales / 30 % product",
          "40 % sales / 60 % tech",
          "50 % fundraising / 50 % execution",
          "80 % delivery / 20 % growth",
          "100 % execution (no time for thinking)",
          "60 % hiring / 40 % culture",
          "30 % learning / 70 % execution",
          "Balanced 50-50 strategy & ops",
          "I don’t track time consciously",
        ],
        type: "radio",
        name: "founderFocus",
      },
    ],
  },
  {
    title: "Section B — Founding Team & Execution Velocity",
    questions: [
      {
        label: "How many core members are actively driving the company?",
        options: [
          "1 (solo founder)",
          "2",
          "3",
          "4–5",
          "6–10",
          "> 10 core leaders",
          "Extended consultants only",
          "Forming new leadership",
          "Advisory-driven",
          "In transition",
        ],
        type: "radio",
        name: "coreMembers",
      },
      {
        label: "What best describes your team’s decision-making style?",
        options: [
          "Data-driven",
          "Customer-driven",
          "Consensus-based",
          "Founder-dominant",
          "Experiment-led",
          "Mentor-guided",
          "Gut instinct",
          "Hierarchy-based",
          "AI-assisted tools",
          "Still evolving",
        ],
        type: "radio",
        name: "decisionStyle",
      },
      {
        label: "Which skill gap currently limits growth the most?",
        options: [
          "Sales & distribution",
          "Technology scalability",
          "Marketing & branding",
          "Finance & funding",
          "Product-market fit clarity",
          "Operations & delivery speed",
          "Leadership depth",
          "Customer success & retention",
          "Legal & compliance",
          "Analytics & data infrastructure",
        ],
        type: "radio",
        name: "skillGap",
      },
      {
        label: "Average execution cycle for experiments or product changes:",
        options: [
          "< 1 week",
          "1 – 2 weeks",
          "2 – 4 weeks",
          "Monthly",
          "Quarterly",
          "Ad-hoc",
          "Only on crisis",
          "Never measured",
          "Planned from next quarter",
          "Depend on client approvals",
        ],
        type: "radio",
        name: "executionCycle",
      },
      {
        label: "What defines success for your team at the end of each week?",
        options: [
          "Number of closed deals",
          "Feature shipped",
          "Customer NPS improvement",
          "Revenue generated",
          "User growth %",
          "Operational efficiency metric",
          "Learning log updates",
          "Investor updates sent",
          "OKR milestones met",
          "We haven’t defined weekly success yet",
        ],
        type: "radio",
        name: "weeklySuccess",
      },
      {
        label: "Rate your team’s overall learning velocity (1–10) + choose your proof:",
        options: [
          "Weekly retros & dashboards",
          "Post-mortem reports",
          "Experiment logs",
          "Growth reviews",
          "Mentor syncs",
          "Customer calls",
          "OKR tracking",
          "Not tracked yet",
          "Ad-hoc feedback only",
          "Planning structured reviews soon",
        ],
        type: "radio",
        name: "learningVelocity",
      },
    ],
  },
  {
    title: "Section C — Growth Bottleneck Diagnosis",
    questions: [
      {
        label: "What is your single biggest growth constraint right now?",
        options: [
          "Weak conversion funnel",
          "Low retention",
          "Poor differentiation",
          "High CAC",
          "Cash-flow pressure",
          "Talent retention",
          "Leadership burnout",
          "Weak brand story",
          "Unclear ICP",
          "Operational inefficiency",
        ],
        type: "radio",
        name: "growthConstraint",
      },
      {
        label: "What caused the constraint?",
        options: [
          "Lack of right data visibility",
          "Poor process discipline",
          "Over-reliance on founder",
          "Team skill gaps",
          "Wrong KPIs",
          "Market shift",
          "Pricing mismatch",
          "Unclear ownership",
          "Tech debt",
          "External dependency",
        ],
        type: "radio",
        name: "constraintCause",
      },
      {
        label: "Which resource would most accelerate your growth in 90 days?",
        options: [
          "Mentor with go-to-market expertise",
          "Funding bridge or CSR partner",
          "Enterprise pilot intros",
          "Pricing & finance coaching",
          "Marketing & branding sprint",
          "Sales automation tool",
          "Product-UX revamp",
          "Data & analytics setup",
          "Leadership coaching",
          "Access to Growth Architects network",
        ],
        type: "radio",
        name: "growthResource",
      },
      {
        label: "How does your organization currently use data in decision-making?",
        options: [
          "Fully instrumented dashboards",
          "Basic Google Analytics only",
          "Sales CRM + Excel",
          "Manual spreadsheets",
          "Only monthly reports",
          "No data visibility",
          "Starting to automate",
          "AI tools pilot underway",
          "Data team < 2 people",
          "Unsure what to track",
        ],
        type: "radio",
        name: "dataUsage",
      },
      {
        label: "When growth stalls, your first reaction is to…",
        options: [
          "Dive into numbers",
          "Talk to customers",
          "Brainstorm new experiments",
          "Seek mentor advice",
          "Cut costs",
          "Blame market",
          "Blame team",
          "Pause for reflection",
          "Ask AI tools for insights",
          "Don’t track slowdown",
        ],
        type: "radio",
        name: "stallReaction",
      },
      {
        label: "How would you rate your clarity of 90-day priorities? (1 = chaos … 10 = crystal-clear)",
        type: "number",
        name: "clarity90Day",
      },
      {
        label: "Upload (optional): Dashboard snapshot / OKR tracker / growth funnel image.",
        type: "file",
        name: "dashboardUpload",
        optional: true,
      },
    ],
  },
  {
    title: "Section D — Market & Revenue Readiness",
    questions: [
      {
        label: "What is your current monthly recurring revenue (MRR)?",
        options: [
          "Pre-revenue",
          "₹ 0–50 K",
          "₹ 50 K–1 L",
          "₹ 1–5 L",
          "₹ 5–10 L",
          "₹ 10–25 L",
          "₹ 25–50 L",
          "₹ 50 L–1 Cr",
          "> ₹ 1 Cr",
          "Prefer not to say",
        ],
        type: "radio",
        name: "currentMRR",
      },
      {
        label: "Revenue source composition:",
        options: [
          "B2C subscriptions",
          "B2B contracts",
          "Marketplace commission",
          "Ad-based",
          "Transaction fee",
          "CSR / grant funded",
          "Licensing / royalty",
          "Affiliate / channel partner",
          "Mixed model",
          "Still evolving",
        ],
        type: "radio",
        name: "revenueSource",
      },
      {
        label: "What percentage of revenue is repeat/renewal?",
        options: [
          "0 %",
          "< 10 %",
          "10–25 %",
          "25–50 %",
          "50–75 %",
          "> 75 %",
          "Subscription model with auto-renew",
          "Mostly one-time projects",
          "Not tracked yet",
          "Too early to measure",
        ],
        type: "radio",
        name: "repeatRevenue",
      },
      {
        label: "What’s your average customer acquisition cost (CAC)?",
        options: [
          "₹ < 500",
          "₹ 500–1 K",
          "₹ 1–5 K",
          "₹ 5–10 K",
          "₹ 10–25 K",
          "₹ 25 K–50 K",
          "> ₹ 50 K",
          "Unknown",
          "Varies by channel",
          "Not applicable (enterprise sales cycle)",
        ],
        type: "radio",
        name: "cac",
      },
      {
        label: "Which of the following best describes your revenue challenge?",
        options: [
          "Low margins",
          "Slow conversions",
          "High churn",
          "Pricing mismatch",
          "Lack of repeat users",
          "Poor upsell strategy",
          "Limited channel reach",
          "Cash-flow gaps",
          "Unoptimized funnel",
          "No challenge — growing steadily",
        ],
        type: "radio",
        name: "revenueChallenge",
      },
      {
        label: "Upload (optional): 3-month P&L or sales report / pipeline snapshot.",
        type: "file",
        name: "salesReportUpload",
        optional: true,
      },
    ],
  },
  {
    title: "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection A — Financial Health & Strategic Control",
    questions: [
      {
        label: "Which statement best reflects your current financial health?",
        type: "radio",
        name: "financialHealth",
        options: [
          "Profitable with steady growth",
          "Breakeven with positive cash flow",
          "Slightly negative burn but manageable",
          "High burn but funded",
          "Pre-revenue building pipeline",
          "Revenue positive but cash-flow tight",
          "Loss-making but growing fast",
          "Survival mode – low runway",
          "Pivoting financial model",
          "Unsure / no financial visibility",
        ],
      },
      {
        label: "How long is your current runway (cash available at current burn)?",
        type: "radio",
        name: "runway",
        options: [
          "< 1 month",
          "1–2 months",
          "3 months",
          "4–6 months",
          "6–9 months",
          "9–12 months",
          "12–18 months",
          "> 18 months",
          "No runway (calculating)",
          "Revenue-funded sustainability",
        ],
      },
      {
        label: "What’s your current monthly burn rate (INR)?",
        type: "radio",
        name: "burnRate",
        options: [
          "< ₹ 50 K",
          "₹ 50 K–1 L",
          "₹ 1–3 L",
          "₹ 3–5 L",
          "₹ 5–10 L",
          "₹ 10–25 L",
          "₹ 25–50 L",
          "> ₹ 50 L",
          "Fluctuates seasonally",
          "Prefer not to disclose",
        ],
      },
      {
        label: "Which financial systems are in place?",
        type: "radio",
        name: "financialSystems",
        options: [
          "Cloud accounting tool (Zoho, QuickBooks etc.)",
          "Excel manual books",
          "External CA manages",
          "Dedicated finance team",
          "Automated billing + reconciliation",
          "MIS dashboard monthly",
          "No structured system",
          "ERP implemented",
          "In transition to automation",
          "Not applicable (pre-revenue)",
        ],
      },
      {
        label: "How often do you review financial metrics?",
        type: "radio",
        name: "reviewFrequency",
        options: [
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Half-yearly",
          "Annually",
          "When cash drops",
          "Only at audits",
          "Mentor-driven reviews",
          "Never formally",
        ],
      },
      {
        label: "Which financial statement do you rely on most to guide decisions?",
        type: "radio",
        name: "statementGuide",
        options: [
          "P&L",
          "Cash-flow",
          "Balance sheet",
          "Sales pipeline",
          "Unit economics",
          "Revenue forecast",
          "Investor update deck",
          "Internal dashboards",
          "All of the above",
          "None / unsure",
        ],
      },
      {
        label: "Upload (optional): latest P&L / cash-flow / burn summary (≤ 3 months).",
        type: "file",
        name: "latestPnlUpload",
        optional: true,
      },
    ],
  },
  {
    title: "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection B — Scalability & Market Size",
    questions: [
      {
        label: "Which best describes your current market stage?",
        type: "radio",
        name: "marketStage",
        options: [
          "Local pilot only",
          "City-level presence",
          "Regional multi-city",
          "Pan-India",
          "South Asia cluster",
          "MENA entry",
          "Global pilot",
          "International partners signed",
          "Fully global revenue",
          "Undecided focus",
        ],
      },
      {
        label: "How big is your addressable market (TAM)?",
        type: "radio",
        name: "tam",
        options: [
          "< ₹ 10 Cr",
          "₹ 10–50 Cr",
          "₹ 50–100 Cr",
          "₹ 100–500 Cr",
          "₹ 500 Cr–1 K Cr",
          "₹ 1–5 K Cr",
          "₹ 5–10 K Cr",
          "₹ 10–50 K Cr",
          "> ₹ 50 K Cr",
          "Not calculated yet",
        ],
      },
      {
        label: "Which growth model best fits your business now?",
        type: "radio",
        name: "growthModel",
        options: [
          "Linear sales growth",
          "Viral network growth",
          "Partner distribution",
          "Enterprise contracts",
          "Freemium to paid",
          "Subscription renewal loop",
          "Franchise / license",
          "Marketplace flywheel",
          "B2G tender-driven",
          "Hybrid multi-path",
        ],
      },
      {
        label: "What’s your average sales cycle duration?",
        type: "radio",
        name: "salesCycle",
        options: [
          "< 1 week",
          "1–2 weeks",
          "2–4 weeks",
          "1–2 months",
          "3–6 months",
          "> 6 months",
          "Varies by segment",
          "No consistent cycle",
          "Inbound only",
          "Not measured",
        ],
      },
      {
        label: "Which scalability lever do you plan to focus on during the accelerator?",
        type: "radio",
        name: "scalabilityLever",
        options: [
          "Distribution automation",
          "Channel partnerships",
          "Product innovation",
          "Pricing re-model",
          "Customer retention",
          "Brand storytelling",
          "New market entry",
          "Tech scalability",
          "Hiring leadership",
          "Regulatory expansion",
        ],
      },
      {
        label: "Current infrastructure readiness for 10× scale:",
        type: "radio",
        name: "infraReadiness",
        options: [
          "Fully ready",
          "Requires minor upgrade",
          "Needs cloud migration",
          "Depends on funding",
          "Core tech ready but ops weak",
          "Ops ready but tech weak",
          "Team capacity low",
          "Regulatory limit",
          "Supply constraint",
          "Unsure",
        ],
      },
      {
        label: "What is your customer retention period (avg)?",
        type: "radio",
        name: "retentionPeriod",
        options: [
          "< 1 month",
          "1–3 months",
          "3–6 months",
          "6–12 months",
          "12–18 months",
          "> 18 months",
          "Subscription auto-renew",
          "One-time transaction",
          "Not measured",
          "Too early to know",
        ],
      },
    ],
  },
  {
    title: "Part 2 — Financial Discipline, Market Scale & Investor Readiness\nSection C — Investment History & Readiness",
    questions: [
      {
        label: "Capital raised so far (all sources combined):",
        type: "radio",
        name: "capitalRaised",
        options: [
          "None",
          "Bootstrapped < ₹ 5 L",
          "₹ 5–10 L",
          "₹ 10–25 L",
          "₹ 25–50 L",
          "₹ 50 L–1 Cr",
          "₹ 1–3 Cr",
          "₹ 3–10 Cr",
          "> ₹ 10 Cr",
          "Grant/CSR only",
        ],
      },
      {
        label: "Primary use of previous capital:",
        type: "radio",
        name: "capitalUse",
        options: [
          "Product development",
          "Tech infrastructure",
          "Marketing & sales",
          "Hiring team",
          "Operations & delivery",
          "Debt repayment",
          "Pivot experiments",
          "Compliance & legal",
          "Brand building",
          "Other",
        ],
      },
      {
        label: "What is your next target funding round?",
        type: "radio",
        name: "nextFundingRound",
        options: [
          "Pre-seed",
          "Seed",
          "Bridge",
          "Pre-Series A",
          "Series A",
          "Series B",
          "Grant/CSR funding",
          "Convertible debt",
          "Revenue-based financing",
          "Not planning to raise",
        ],
      },
      {
        label: "How much capital do you intend to raise (in INR)?",
        type: "radio",
        name: "capitalToRaise",
        options: [
          "< ₹ 25 L",
          "₹ 25–50 L",
          "₹ 50 L–1 Cr",
          "₹ 1–3 Cr",
          "₹ 3–5 Cr",
          "₹ 5–10 Cr",
          "₹ 10–20 Cr",
          "> ₹ 20 Cr",
          "Undecided",
          "Non-equity grants",
        ],
      },
      {
        label: "Expected use of funds:",
        type: "radio",
        name: "fundsUse",
        options: [
          "Tech & product upgrade",
          "Sales & marketing",
          "Working capital",
          "Hiring & talent",
          "Geographic expansion",
          "Brand campaigns",
          "R&D and IP",
          "Compliance & certification",
          "Debt clearance",
          "Other",
        ],
      },
      {
        label: "What’s your target valuation (pre-money)?",
        type: "radio",
        name: "targetValuation",
        options: [
          "< ₹ 5 Cr",
          "₹ 5–10 Cr",
          "₹ 10–25 Cr",
          "₹ 25–50 Cr",
          "₹ 50–100 Cr",
          "₹ 100–200 Cr",
          "₹ 200–500 Cr",
          "₹ 500 Cr–1 K Cr",
          "> ₹ 1 K Cr",
          "Not decided yet",
        ],
      },
      {
        label: "Have you prepared a data room with key documents?",
        type: "radio",
        name: "dataRoom",
        options: [
          "Yes, complete",
          "Partially ready",
          "In progress",
          "Need help structuring",
          "No, but documents exist",
          "Not yet",
          "Will build during program",
          "Investor managing",
          "Law firm handling",
          "Not applicable",
        ],
      },
      {
        label: "Rate your investor-readiness confidence (1–10) and add evidence (e.g., deck, term sheet, commitment letter).",
        type: "number",
        name: "investorConfidence",
      },
      {
        label: "Upload: Pitch deck / one-pager / term sheet (optional).",
        type: "file",
        name: "pitchDeckUpload",
        optional: true,
      },
    ],
  },
 // ===== PART 3 - JUST APPENDED BELOW =====
  {
    title: "Section A — Innovation Edge & Technology Readiness",
    questions: [
      {
        label: "How would you define the core innovation in your business?",
        type: "radio",
        name: "coreInnovation",
        options: [
          "New technology application",
          "Process automation breakthrough",
          "Behavioral-design innovation",
          "Business-model reinvention",
          "Cost-efficiency disruptor",
          "Data/IP-driven differentiation",
          "User-experience simplicity",
          "Platform or ecosystem design",
          "Circular / sustainable model",
          "Still defining",
        ],
      },
      {
        label: "Which technologies power your current or future advantage?",
        type: "checkbox",
        name: "powerTech",
        options: [
          "AI/ML",
          "Blockchain",
          "IoT",
          "Data Analytics",
          "AR/VR",
          "Robotics / Automation",
          "Biotech / Healthtech",
          "GreenTech / Clean Energy",
          "Low-code / No-code systems",
          "None / non-tech differentiation",
        ],
      },
      {
        label: "Stage of product or tech maturity:",
        type: "radio",
        name: "techMaturity",
        options: [
          "Concept only",
          "Prototype",
          "Beta MVP",
          "MVP live < 50 users",
          "Live > 100 users",
          "Production stable",
          "Scalable API / microservices",
          "Enterprise-ready",
          "Patented / proprietary",
          "Legacy product being rebuilt",
        ],
      },
      {
        label: "Do you have any protected intellectual property (IP)?",
        type: "radio",
        name: "protectedIP",
        options: [
          "Patent filed",
          "Patent granted",
          "Provisional filed",
          "Trademark / Brand protected",
          "Copyright registered",
          "Trade secret only",
          "Pending applications",
          "Open-source model",
          "Confidential internal IP",
          "None",
        ],
      },
      {
        label: "How frequently do you release product or feature updates?",
        type: "radio",
        name: "releaseFrequency",
        options: [
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Half-yearly",
          "Ad-hoc",
          "Only major releases",
          "User-driven updates",
          "Continuous deployment",
          "Not yet launched",
        ],
      },
      {
        label: "Which validation metrics are tracked post-launch?",
        type: "checkbox",
        name: "validationMetrics",
        options: [
          "Activation rate",
          "Engagement / session time",
          "Conversion %",
          "Retention %",
          "NPS",
          "Feature adoption rate",
          "Crash / bug rate",
          "Churn rate",
          "Referrals",
          "None so far",
        ],
      },
      {
        label: "Upload (optional): Screenshots / prototype video / tech architecture map / patent proof.",
        type: "file",
        name: "innovationUpload",
        optional: true,
      },
    ],
  },
  {
    title: "Section B — Operational Discipline & Scalability",
    questions: [
      {
        label: "Which statement best describes your current operations?",
        type: "radio",
        name: "operationsDescription",
        options: [
          "Fully systemized SOPs",
          "Partially documented",
          "Founder-dependent",
          "Tool-based but siloed",
          "Ad-hoc execution",
          "Process audit recently done",
          "Automated via workflow tools",
          "Scaled via partners",
          "Outsourced core ops",
          "Still setting up",
        ],
      },
      {
        label: "Which tools or systems are you currently using?",
        type: "checkbox",
        name: "toolsUsed",
        options: [
          "CRM (HubSpot/Salesforce)",
          "Project tools (Notion, Asana, ClickUp)",
          "Marketing automation",
          "Finance ERP",
          "Customer success tools",
          "HRMS",
          "Custom internal system",
          "Multiple non-integrated tools",
          "Manual Excel / WhatsApp",
          "No tools yet",
        ],
      },
      {
        label: "Average order-to-delivery / service cycle time:",
        type: "radio",
        name: "orderCycle",
        options: [
          "< 24 hours",
          "1–3 days",
          "3–7 days",
          "1–2 weeks",
          "2–4 weeks",
          "> 1 month",
          "Depends on client",
          "Automated real-time",
          "Not tracked",
          "Service-based / NA",
        ],
      },
      {
        label: "Primary operations bottleneck today:",
        type: "radio",
        name: "operationsBottleneck",
        options: [
          "Manual repetition",
          "Talent shortage",
          "Delayed customer responses",
          "Supply / vendor dependency",
          "Tech integration",
          "Compliance processes",
          "Decision latency",
          "Scaling costs",
          "Cross-team alignment",
          "Unclear KPIs",
        ],
      },
      {
        label: "Operational maturity rating (1–10) + short example of efficiency initiative (≤ 60 words).",
        type: "number",
        name: "operationsMaturity",
      },
      {
        label: "Which approach best represents your leadership style?",
        type: "radio",
        name: "leadershipStyle",
        options: [
          "Delegator / coach",
          "Command-control",
          "Data-driven decision maker",
          "Visionary inspirer",
          "Empathic leader",
          "Hands-on executor",
          "Collaborative consensus",
          "Experimenter / risk-taker",
          "Structured planner",
          "Still discovering style",
        ],
      },
      {
        label: "How often do you measure team productivity?",
        type: "radio",
        name: "teamProductivityFrequency",
        options: [
          "Daily",
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Only post-projects",
          "Through OKRs",
          "Through client feedback",
          "Not measured",
          "Planning system setup",
        ],
      },
      {
        label: "Upload (optional): Internal SOP deck / process map / automation flow.",
        type: "file",
        name: "opsUpload",
        optional: true,
      },
    ],
  },
  {
    title: "Section C — Customer Experience & Retention Flywheel",
    questions: [
      {
        label: "How do you currently measure customer success?",
        type: "radio",
        name: "customerSuccessMeasure",
        options: [
          "NPS / CSAT survey",
          "Renewal rate",
          "Customer lifetime value",
          "Referral rate",
          "Churn rate",
          "Customer reviews",
          "Case studies",
          "Support tickets",
          "Custom health score",
          "Not yet measured",
        ],
      },
      {
        label: "Top 3 ways you retain customers:",
        type: "checkbox",
        name: "customerRetentionWays",
        options: [
          "Loyalty programs",
          "Superior UX/UI",
          "Relationship building",
          "Frequent updates",
          "Community engagement",
          "Pricing incentives",
          "Customer support speed",
          "Co-creation sessions",
          "Gamification",
          "Automation / reminders",
        ],
      },
      {
        label: "Customer advocacy status:",
        type: "radio",
        name: "customerAdvocacy",
        options: [
          "Referral program active",
          "Customers share testimonials",
          "User communities exist",
          "Social proof on media",
          "Corporate clients as ambassadors",
          "Zero advocacy yet",
          "Planning in next quarter",
          "Influencer partnerships",
          "B2B case studies",
          "Not relevant",
        ],
      },
      {
        label: "Main reason customers choose you over others:",
        type: "radio",
        name: "reasonCustomersChoose",
        options: [
          "Pricing",
          "Personalization",
          "Speed",
          "Trust",
          "Quality / accuracy",
          "Innovation",
          "Ease of use",
          "Support",
          "Brand reputation",
          "Combination",
        ],
      },
      {
        label: "If your product disappeared tomorrow, how would customers react?",
        type: "radio",
        name: "customerReaction",
        options: [
          "Highly disappointed",
          "Somewhat disappointed",
          "Neutral",
          "Would find alternative",
          "Would wait for return",
          "Would build in-house",
          "Not yet active customers",
          "Don’t know",
          "Pre-launch",
          "Other",
        ],
      },
    ],
  },
  {
    title: "Section D — Impact & Ethical Scalability",
    questions: [
      {
        label: "Which positive impact best represents your startup?",
        type: "radio",
        name: "positiveImpact",
        options: [
          "Job creation",
          "Health improvement",
          "Financial inclusion",
          "Education access",
          "Climate / sustainability",
          "Gender equality",
          "Rural empowerment",
          "Digital literacy",
          "Human well-being",
          "Other",
        ],
      },
      {
        label: "Which UN SDG is closest to your business model?",
        type: "radio",
        name: "closestSDG",
        options: [
          "SDG 3 – Good Health",
          "SDG 4 – Quality Education",
          "SDG 5 – Gender Equality",
          "SDG 7 – Clean Energy",
          "SDG 8 – Decent Work",
          "SDG 9 – Industry & Innovation",
          "SDG 11 – Sustainable Cities",
          "SDG 12 – Responsible Consumption",
          "SDG 13 – Climate Action",
          "Other",
        ],
      },
      {
        label: "Do you measure impact metrics?",
        type: "radio",
        name: "impactMetrics",
        options: [
          "Yes, quantified SDG indicators",
          "Yes, qualitative testimonials",
          "CSR reports",
          "Client ROI metrics",
          "Partner impact dashboard",
          "Occasional measurement",
          "Planning tool integration",
          "No measurement yet",
          "Unsure how",
          "Not applicable",
        ],
      },
      {
        label: "How do you handle data ethics & privacy?",
        type: "radio",
        name: "dataEthics",
        options: [
          "GDPR / Indian DPDP compliant",
          "Consent forms integrated",
          "Data encryption active",
          "Internal data policy",
          "Third-party audited",
          "Basic consent only",
          "Planning compliance this quarter",
          "Learning regulations",
          "No sensitive data collected",
          "Not aware",
        ],
      },
      {
        label: "At scale, what ethical risk do you foresee?",
        type: "radio",
        name: "ethicalRisk",
        options: [
          "Algorithm bias",
          "Addiction / screen time",
          "Job displacement",
          "Environmental impact",
          "Data breach",
          "Monopoly risk",
          "Inequality amplification",
          "Cultural backlash",
          "Regulatory non-compliance",
          "None",
        ],
      },
      {
        label: "Describe the legacy or impact statement you want to leave (≤ 75 words).",
        type: "text",
        name: "legacyStatement",
      },
    ],
  },
  {
    title: "Section E — Investor Narrative & Story Clarity",
    questions: [
      {
        label: "If you had to summarize your venture in one sentence for investors, which fits best?",
        type: "radio",
        name: "investorSentence",
        options: [
          "We are solving a massive inefficiency.",
          "We’re digitizing a broken industry.",
          "We create emotional connection through tech.",
          "We save time and money for millions.",
          "We enable micro-entrepreneurs.",
          "We democratize access.",
          "We build India’s next global brand.",
          "We turn data into decisions.",
          "We empower underserved communities.",
          "Other (custom line).",
        ],
      },
      {
        label: "What makes your story believable to investors?",
        type: "checkbox",
        name: "storyBelievable",
        options: [
          "Clear traction data",
          "Strong team background",
          "Market pull evidence",
          "Tech differentiation",
          "Customer love",
          "Pilot success",
          "Media recognition",
          "IP / patent",
          "Mentor endorsement",
          "Narrative coherence",
        ],
      },
      {
        label: "How prepared are you for a live pitch tomorrow?",
        type: "radio",
        name: "pitchPreparedness",
        options: [
          "Completely ready",
          "Need minor deck polish",
          "Need story practice",
          "Need financial rehearsal",
          "Need mentor feedback",
          "Have deck but no narrative",
          "No deck yet",
          "Fear public pitching",
          "Need translation help",
          "Will be ready within a week",
        ],
      },
      {
        label: "Upload (optional): 1-slide vision summary or Demo Day deck.",
        type: "file",
        name: "demoDayUpload",
        optional: true,
      },
    ],
  },
];

// --- rest of your component unchanged ---
export default function EAcceleratorScreening() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, any>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm((prev) => {
        const arr = prev[name] || [];
        if (checked) return { ...prev, [name]: [...arr, value] };
        return { ...prev, [name]: arr.filter((v: string) => v !== value) };
      });
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, sections.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Wingrox AI e-Accelerator™ — Screening & Selection Questionnaire
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Please complete each section to help us understand your growth readiness and needs. Your responses are confidential and will be used to generate personalized insights.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Section {step + 1} of {sections.length}
              </span>
            </div>
            <div className="mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900 whitespace-pre-line">
                {getPartSectionLabel(step)}
              </h2>
            </div>
          </div>
          <div className="space-y-8">
            {sections[step].questions.map((q) => (
              <div key={q.name} className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">{q.label}</label>
                {q.type === "radio" && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-400">
                        <input
                          type="radio"
                          name={q.name}
                          value={opt}
                          checked={form[q.name] === opt}
                          onChange={handleChange}
                          className="accent-blue-600 w-5 h-5"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "checkbox" && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-400">
                        <input
                          type="checkbox"
                          name={q.name}
                          value={opt}
                          checked={Array.isArray(form[q.name]) && form[q.name].includes(opt)}
                          onChange={handleChange}
                          className="accent-blue-600 w-5 h-5"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "text" && (
                  <input
                    type="text"
                    name={q.name}
                    value={form[q.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                )}
                {q.type === "number" && (
                  <input
                    type="number"
                    name={q.name}
                    value={form[q.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                )}
                {q.type === "file" && (
                  <input
                    type="file"
                    name={q.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 0}
            className={`px-6 py-3 rounded-md font-semibold transition-colors ${step === 0 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            Previous
          </button>
          {step < sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}