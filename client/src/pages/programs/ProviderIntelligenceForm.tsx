import React, { useState } from "react";

const steps: string[] = [
  "Founder & Growth Readiness DNA",
  "Financial Discipline, Market Scale & Investor Readiness",
  "Innovation, Operational Excellence & Impact Leadership",
  "Final Readiness & Selection Matrix",
];

// Each step contains an array of question objects: { label, options, type }
type Question = {
  label: string;
  options?: string[];
  type: "radio" | "checkbox" | "text" | "file";
  name: string;
};

const questionnaire: Question[][] = [
  // Part 1
  [
    { label: "1️⃣ What best describes your reason for joining an accelerator now?", options: [
      "To scale sales and revenue",
      "To raise institutional funding",
      "To enter new markets or geographies",
      "To refine strategy and unit economics",
      "To access mentors & playbooks",
      "To build investor-ready storytelling",
      "To validate product-market fit (PMF)",
      "To recruit senior talent",
      "To prepare for international expansion",
      "To learn from peer founders"
    ], type: "radio", name: "reasonForJoining" },
    { label: "2️⃣ Which statement best defines your current company stage?", options: [
      "Idea stage, validating problem",
      "Prototype ready",
      "MVP tested with early users",
      "Paying customers (< ₹1 L MRR)",
      "Consistent revenue (₹1–10 L MRR)",
      "Scalable traction (₹10–50 L MRR)",
      "Profitable but stagnant growth",
      "Seed-funded, pre-Series A",
      "Series A + seeking global expansion",
      "Pivoting after a failed model"
    ], type: "radio", name: "companyStage" },
    { label: "3️⃣ What outcome would make the accelerator a huge success for you?", options: [
      "Achieving 3× revenue growth",
      "Securing seed/VC funding",
      "Expanding to new regions",
      "Acquiring marquee clients",
      "Establishing strong unit economics",
      "Building a leadership team",
      "Launching a new product line",
      "Strengthening brand credibility",
      "Learning a scalable system",
      "Finding the right strategic partner"
    ], type: "radio", name: "successOutcome" },
    { label: "4️⃣ What motivates you most to keep building?", options: [
      "Freedom & ownership",
      "Purpose & social impact",
      "Creating jobs & opportunities",
      "Recognition & credibility",
      "Investor confidence",
      "Customer transformation",
      "Legacy for family/community",
      "Curiosity for innovation",
      "Competition drive",
      "Learning through building"
    ], type: "radio", name: "motivation" },
    { label: "5️⃣ How do you define ‘growth’ for your venture today?", options: [
      "Top-line revenue increase",
      "Profitability & healthy margins",
      "Customer retention & referrals",
      "Market share gain",
      "Product adoption & stickiness",
      "Brand awareness & media visibility",
      "Funding milestones",
      "Employee growth & culture",
      "Impact & SDG alignment",
      "Combination of the above"
    ], type: "radio", name: "growthDefinition" },
    { label: "6️⃣ Current founder focus ratio (where your weekly time goes):", options: [
      "60 % operations / 40 % strategy",
      "70 % sales / 30 % product",
      "40 % sales / 60 % tech",
      "50 % fundraising / 50 % execution",
      "80 % delivery / 20 % growth",
      "100 % execution (no time for thinking)",
      "60 % hiring / 40 % culture",
      "30 % learning / 70 % execution",
      "Balanced 50-50 strategy & ops",
      "I don’t track time consciously"
    ], type: "radio", name: "founderFocus" },
    { label: "7️⃣ How many core members are actively driving the company?", options: [
      "1 (solo founder)", "2", "3", "4–5", "6–10", "> 10 core leaders", "Extended consultants only", "Forming new leadership", "Advisory-driven", "In transition"
    ], type: "radio", name: "coreMembers" },
    { label: "8️⃣ What best describes your team’s decision-making style?", options: [
      "Data-driven", "Customer-driven", "Consensus-based", "Founder-dominant", "Experiment-led", "Mentor-guided", "Gut instinct", "Hierarchy-based", "AI-assisted tools", "Still evolving"
    ], type: "radio", name: "decisionStyle" },
    { label: "9️⃣ Which skill gap currently limits growth the most?", options: [
      "Sales & distribution", "Technology scalability", "Marketing & branding", "Finance & funding", "Product-market fit clarity", "Operations & delivery speed", "Leadership depth", "Customer success & retention", "Legal & compliance", "Analytics & data infrastructure"
    ], type: "radio", name: "skillGap" },
    { label: "🔟 Average execution cycle for experiments or product changes:", options: [
      "< 1 week", "1 – 2 weeks", "2 – 4 weeks", "Monthly", "Quarterly", "Ad-hoc", "Only on crisis", "Never measured", "Planned from next quarter", "Depend on client approvals"
    ], type: "radio", name: "executionCycle" },
    { label: "11️⃣ What defines success for your team at the end of each week?", options: [
      "Number of closed deals", "Feature shipped", "Customer NPS improvement", "Revenue generated", "User growth %", "Operational efficiency metric", "Learning log updates", "Investor updates sent", "OKR milestones met", "We haven’t defined weekly success yet"
    ], type: "radio", name: "weeklySuccess" },
    { label: "12️⃣ Rate your team’s overall learning velocity (1–10) + choose your proof:", options: [
      "Weekly retros & dashboards", "Post-mortem reports", "Experiment logs", "Growth reviews", "Mentor syncs", "Customer calls", "OKR tracking", "Not tracked yet", "Ad-hoc feedback only", "Planning structured reviews soon"
    ], type: "radio", name: "learningVelocity" },
    { label: "13️⃣ What is your single biggest growth constraint right now?", options: [
      "Weak conversion funnel", "Low retention", "Poor differentiation", "High CAC", "Cash-flow pressure", "Talent retention", "Leadership burnout", "Weak brand story", "Unclear ICP", "Operational inefficiency"
    ], type: "radio", name: "growthConstraint" },
    { label: "14️⃣ What caused the constraint?", options: [
      "Lack of right data visibility", "Poor process discipline", "Over-reliance on founder", "Team skill gaps", "Wrong KPIs", "Market shift", "Pricing mismatch", "Unclear ownership", "Tech debt", "External dependency"
    ], type: "radio", name: "constraintCause" },
    { label: "15️⃣ Which resource would most accelerate your growth in 90 days?", options: [
      "Mentor with go-to-market expertise", "Funding bridge or CSR partner", "Enterprise pilot intros", "Pricing & finance coaching", "Marketing & branding sprint", "Sales automation tool", "Product-UX revamp", "Data & analytics setup", "Leadership coaching", "Access to Growth Architects network"
    ], type: "radio", name: "growthResource" },
    { label: "16️⃣ How does your organization currently use data in decision-making?", options: [
      "Fully instrumented dashboards", "Basic Google Analytics only", "Sales CRM + Excel", "Manual spreadsheets", "Only monthly reports", "No data visibility", "Starting to automate", "AI tools pilot underway", "Data team < 2 people", "Unsure what to track"
    ], type: "radio", name: "dataUsage" },
    { label: "17️⃣ When growth stalls, your first reaction is…", options: [
      "Dive into numbers", "Talk to customers", "Brainstorm new experiments", "Seek mentor advice", "Cut costs", "Blame market", "Blame team", "Pause for reflection", "Ask AI tools for insights", "Don’t track slowdown"
    ], type: "radio", name: "growthStallReaction" },
    { label: "18️⃣ How would you rate your clarity of 90-day priorities? (1 = chaos … 10 = crystal-clear)", type: "text", name: "clarity90Day" },
    { label: "19️⃣ Upload (optional): Dashboard snapshot / OKR tracker / growth funnel image.", type: "file", name: "dashboardUpload" },
    { label: "20️⃣ What is your current monthly recurring revenue (MRR)?", options: [
      "Pre-revenue", "₹ 0–50 K", "₹ 50 K–1 L", "₹ 1–5 L", "₹ 5–10 L", "₹ 10–25 L", "₹ 25–50 L", "₹ 50 L–1 Cr", "> ₹ 1 Cr", "Prefer not to say"
    ], type: "radio", name: "mrr" },
    { label: "21️⃣ Revenue source composition:", options: [
      "B2C subscriptions", "B2B contracts", "Marketplace commission", "Ad-based", "Transaction fee", "CSR / grant funded", "Licensing / royalty", "Affiliate / channel partner", "Mixed model", "Still evolving"
    ], type: "radio", name: "revenueSource" },
    { label: "22️⃣ What percentage of revenue is repeat/renewal?", options: [
      "0 %", "< 10 %", "10–25 %", "25–50 %", "50–75 %", "> 75 %", "Subscription model with auto-renew", "Mostly one-time projects", "Not tracked yet", "Too early to measure"
    ], type: "radio", name: "revenueRepeat" },
    { label: "23️⃣ What’s your average customer acquisition cost (CAC)?", options: [
      "₹ < 500", "₹ 500–1 K", "₹ 1–5 K", "₹ 5–10 K", "₹ 10–25 K", "₹ 25 K–50 K", "> ₹ 50 K", "Unknown", "Varies by channel", "Not applicable (enterprise sales cycle)"
    ], type: "radio", name: "cac" },
    { label: "24️⃣ Which of the following best describes your revenue challenge?", options: [
      "Low margins", "Slow conversions", "High churn", "Pricing mismatch", "Lack of repeat users", "Poor upsell strategy", "Limited channel reach", "Cash-flow gaps", "Unoptimized funnel", "No challenge — growing steadily"
    ], type: "radio", name: "revenueChallenge" },
    { label: "25️⃣ Upload (optional): 3-month P&L or sales report / pipeline snapshot.", type: "file", name: "pnlUpload" },
  ],
  // Part 2
  [
    { label: "1️⃣ Which statement best reflects your current financial health?", options: [
      "Profitable with steady growth",
      "Breakeven with positive cash flow",
      "Slightly negative burn but manageable",
      "High burn but funded",
      "Pre-revenue building pipeline",
      "Revenue positive but cash-flow tight",
      "Loss-making but growing fast",
      "Survival mode – low runway",
      "Pivoting financial model",
      "Unsure / no financial visibility"
    ], type: "radio", name: "financialHealth" },
    { label: "2️⃣ How long is your current runway (cash available at current burn)?", options: [
      "< 1 month", "1–2 months", "3 months", "4–6 months", "6–9 months", "9–12 months", "12–18 months", "> 18 months", "No runway (calculating)", "Revenue-funded sustainability"
    ], type: "radio", name: "runway" },
    { label: "3️⃣ What’s your current monthly burn rate (INR)?", options: [
      "< ₹ 50 K", "₹ 50 K–1 L", "₹ 1–3 L", "₹ 3–5 L", "₹ 5–10 L", "₹ 10–25 L", "₹ 25–50 L", "> ₹ 50 L", "Fluctuates seasonally", "Prefer not to disclose"
    ], type: "radio", name: "burnRate" },
    { label: "4️⃣ Which financial systems are in place?", options: [
      "Cloud accounting tool (Zoho, QuickBooks etc.)", "Excel manual books", "External CA manages", "Dedicated finance team", "Automated billing + reconciliation", "MIS dashboard monthly", "No structured system", "ERP implemented", "In transition to automation", "Not applicable (pre-revenue)"
    ], type: "radio", name: "financialSystems" },
    { label: "5️⃣ How often do you review financial metrics?", options: [
      "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Half-yearly", "Annually", "When cash drops", "Only at audits", "Mentor-driven reviews", "Never formally"
    ], type: "radio", name: "reviewFrequency" },
    { label: "6️⃣ Which financial statement do you rely on most to guide decisions?", options: [
      "P&L", "Cash-flow", "Balance sheet", "Sales pipeline", "Unit economics", "Revenue forecast", "Investor update deck", "Internal dashboards", "All of the above", "None / unsure"
    ], type: "radio", name: "statementGuide" },
    { label: "7️⃣ Upload (optional): latest P&L / cash-flow / burn summary (≤ 3 months).", type: "file", name: "latestPnlUpload" },
    { label: "8️⃣ Which best describes your current market stage?", options: [
      "Local pilot only", "City-level presence", "Regional multi-city", "Pan-India", "South Asia cluster", "MENA entry", "Global pilot", "International partners signed", "Fully global revenue", "Undecided focus"
    ], type: "radio", name: "marketStage" },
    { label: "9️⃣ How big is your addressable market (TAM)?", options: [
      "< ₹ 10 Cr", "₹ 10–50 Cr", "₹ 50–100 Cr", "₹ 100–500 Cr", "₹ 500 Cr–1 K Cr", "₹ 1–5 K Cr", "₹ 5–10 K Cr", "₹ 10–50 K Cr", "> ₹ 50 K Cr", "Not calculated yet"
    ], type: "radio", name: "tam" },
    { label: "🔟 Which growth model best fits your business now?", options: [
      "Linear sales growth", "Viral network growth", "Partner distribution", "Enterprise contracts", "Freemium to paid", "Subscription renewal loop", "Franchise / license", "Marketplace flywheel", "B2G tender-driven", "Hybrid multi-path"
    ], type: "radio", name: "growthModel" },
    { label: "11️⃣ What’s your average sales cycle duration?", options: [
      "< 1 week", "1–2 weeks", "2–4 weeks", "1–2 months", "3–6 months", "> 6 months", "Varies by segment", "No consistent cycle", "Inbound only", "Not measured"
    ], type: "radio", name: "salesCycle" },
    { label: "12️⃣ Which scalability lever do you plan to focus on during the accelerator?", options: [
      "Distribution automation", "Channel partnerships", "Product innovation", "Pricing re-model", "Customer retention", "Brand storytelling", "New market entry", "Tech scalability", "Hiring leadership", "Regulatory expansion"
    ], type: "radio", name: "scalabilityLever" },
    { label: "13️⃣ Current infrastructure readiness for 10× scale:", options: [
      "Fully ready", "Requires minor upgrade", "Needs cloud migration", "Depends on funding", "Core tech ready but ops weak", "Ops ready but tech weak", "Team capacity low", "Regulatory limit", "Supply constraint", "Unsure"
    ], type: "radio", name: "infraReadiness" },
    { label: "14️⃣ What is your customer retention period (avg)?", options: [
      "< 1 month", "1–3 months", "3–6 months", "6–12 months", "12–18 months", "> 18 months", "Subscription auto-renew", "One-time transaction", "Not measured", "Too early to know"
    ], type: "radio", name: "retentionPeriod" },
    { label: "15️⃣ Capital raised so far (all sources combined):", options: [
      "None", "Bootstrapped < ₹ 5 L", "₹ 5–10 L", "₹ 10–25 L", "₹ 25–50 L", "₹ 50 L–1 Cr", "₹ 1–3 Cr", "₹ 3–10 Cr", "> ₹ 10 Cr", "Grant/CSR only"
    ], type: "radio", name: "capitalRaised" },
    { label: "16️⃣ Primary use of previous capital:", options: [
      "Product development", "Tech infrastructure", "Marketing & sales", "Hiring team", "Operations & delivery", "Debt repayment", "Pivot experiments", "Compliance & legal", "Brand building", "Other"
    ], type: "radio", name: "capitalUse" },
    { label: "17️⃣ What is your next target funding round?", options: [
      "Pre-seed", "Seed", "Bridge", "Pre-Series A", "Series A", "Series B", "Grant/CSR funding", "Convertible debt", "Revenue-based financing", "Not planning to raise"
    ], type: "radio", name: "nextFundingRound" },
    { label: "18️⃣ How much capital do you intend to raise (in INR)?", options: [
      "< ₹ 25 L", "₹ 25–50 L", "₹ 50 L–1 Cr", "₹ 1–3 Cr", "₹ 3–5 Cr", "₹ 5–10 Cr", "₹ 10–20 Cr", "> ₹ 20 Cr", "Undecided", "Non-equity grants"
    ], type: "radio", name: "capitalToRaise" },
    { label: "19️⃣ Expected use of funds:", options: [
      "Tech & product upgrade", "Sales & marketing", "Working capital", "Hiring & talent", "Geographic expansion", "Brand campaigns", "R&D and IP", "Compliance & certification", "Debt clearance", "Other"
    ], type: "radio", name: "fundsUse" },
    { label: "20️⃣ What’s your target valuation (pre-money)?", options: [
      "< ₹ 5 Cr", "₹ 5–10 Cr", "₹ 10–25 Cr", "₹ 25–50 Cr", "₹ 50–100 Cr", "₹ 100–200 Cr", "₹ 200–500 Cr", "₹ 500 Cr–1 K Cr", "> ₹ 1 K Cr", "Not decided yet"
    ], type: "radio", name: "targetValuation" },
    { label: "21️⃣ Have you prepared a data room with key documents?", options: [
      "Yes, complete", "Partially ready", "In progress", "Need help structuring", "No, but documents exist", "Not yet", "Will build during program", "Investor managing", "Law firm handling", "Not applicable"
    ], type: "radio", name: "dataRoom" },
    { label: "22️⃣ Rate your investor-readiness confidence (1–10) and add evidence (e.g., deck, term sheet, commitment letter).", type: "text", name: "investorConfidence" },
    { label: "23️⃣ Upload: Pitch deck / one-pager / term sheet (optional).", type: "file", name: "pitchDeckUpload" },
  ],
  // Part 3
  [
    { label: "1️⃣ How would you define the core innovation in your business?", options: [
      "New technology application", "Process automation breakthrough", "Behavioral-design innovation", "Business-model reinvention", "Cost-efficiency disruptor", "Data/IP-driven differentiation", "User-experience simplicity", "Platform or ecosystem design", "Circular / sustainable model", "Still defining"
    ], type: "radio", name: "coreInnovation" },
    { label: "2️⃣ Which technologies power your current or future advantage?", options: [
      "AI/ML", "Blockchain", "IoT", "Data Analytics", "AR/VR", "Robotics / Automation", "Biotech / Healthtech", "GreenTech / Clean Energy", "Low-code / No-code systems", "None / non-tech differentiation"
    ], type: "checkbox", name: "techAdvantage" },
    { label: "3️⃣ Stage of product or tech maturity:", options: [
      "Concept only", "Prototype", "Beta MVP", "MVP live < 50 users", "Live > 100 users", "Production stable", "Scalable API / microservices", "Enterprise-ready", "Patented / proprietary", "Legacy product being rebuilt"
    ], type: "radio", name: "techMaturity" },
    { label: "4️⃣ Do you have any protected intellectual property (IP)?", options: [
      "Patent filed", "Patent granted", "Provisional filed", "Trademark / Brand protected", "Copyright registered", "Trade secret only", "Pending applications", "Open-source model", "Confidential internal IP", "None"
    ], type: "radio", name: "ipProtection" },
    { label: "5️⃣ How frequently do you release product or feature updates?", options: [
      "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Half-yearly", "Ad-hoc", "Only major releases", "User-driven updates", "Continuous deployment", "Not yet launched"
    ], type: "radio", name: "releaseFrequency" },
    { label: "6️⃣ Which validation metrics are tracked post-launch?", options: [
      "Activation rate", "Engagement / session time", "Conversion %", "Retention %", "NPS", "Feature adoption rate", "Crash / bug rate", "Churn rate", "Referrals", "None so far"
    ], type: "checkbox", name: "validationMetrics" },
    { label: "7️⃣ Upload (optional): Screenshots / prototype video / tech architecture map / patent proof.", type: "file", name: "innovationUpload" },
    { label: "8️⃣ Which statement best describes your current operations?", options: [
      "Fully systemized SOPs", "Partially documented", "Founder-dependent", "Tool-based but siloed", "Ad-hoc execution", "Process audit recently done", "Automated via workflow tools", "Scaled via partners", "Outsourced core ops", "Still setting up"
    ], type: "radio", name: "operations" },
    { label: "9️⃣ Which tools or systems are you currently using?", options: [
      "CRM (HubSpot/Salesforce)", "Project tools (Notion, Asana, ClickUp)", "Marketing automation", "Finance ERP", "Customer success tools", "HRMS", "Custom internal system", "Multiple non-integrated tools", "Manual Excel / WhatsApp", "No tools yet"
    ], type: "checkbox", name: "toolsSystems" },
    { label: "🔟 Average order-to-delivery / service cycle time:", options: [
      "< 24 hours", "1–3 days", "3–7 days", "1–2 weeks", "2–4 weeks", "> 1 month", "Depends on client", "Automated real-time", "Not tracked", "Service-based / NA"
    ], type: "radio", name: "orderCycle" },
    { label: "11️⃣ Primary operations bottleneck today:", options: [
      "Manual repetition", "Talent shortage", "Delayed customer responses", "Supply / vendor dependency", "Tech integration", "Compliance processes", "Decision latency", "Scaling costs", "Cross-team alignment", "Unclear KPIs"
    ], type: "radio", name: "opsBottleneck" },
    { label: "12️⃣ Operational maturity rating (1–10) + short example of efficiency initiative (≤ 60 words).", type: "text", name: "opsMaturity" },
    { label: "13️⃣ Which approach best represents your leadership style?", options: [
      "Delegator / coach", "Command-control", "Data-driven decision maker", "Visionary inspirer", "Empathic leader", "Hands-on executor", "Collaborative consensus", "Experimenter / risk-taker", "Structured planner", "Still discovering style"
    ], type: "radio", name: "leadershipStyle" },
    { label: "14️⃣ How often do you measure team productivity?", options: [
      "Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Only post-projects", "Through OKRs", "Through client feedback", "Not measured", "Planning system setup"
    ], type: "radio", name: "productivityMeasure" },
    { label: "15️⃣ Upload (optional): Internal SOP deck / process map / automation flow.", type: "file", name: "sopUpload" },
    { label: "16️⃣ How do you currently measure customer success?", options: [
      "NPS / CSAT survey", "Renewal rate", "Customer lifetime value", "Referral rate", "Churn rate", "Customer reviews", "Case studies", "Support tickets", "Custom health score", "Not yet measured"
    ], type: "radio", name: "customerSuccess" },
    { label: "17️⃣ Top 3 ways you retain customers:", options: [
      "Loyalty programs", "Superior UX/UI", "Relationship building", "Frequent updates", "Community engagement", "Pricing incentives", "Customer support speed", "Co-creation sessions", "Gamification", "Automation / reminders"
    ], type: "checkbox", name: "retainWays" },
    { label: "18️⃣ Customer advocacy status:", options: [
      "Referral program active", "Customers share testimonials", "User communities exist", "Social proof on media", "Corporate clients as ambassadors", "Zero advocacy yet", "Planning in next quarter", "Influencer partnerships", "B2B case studies", "Not relevant"
    ], type: "radio", name: "advocacyStatus" },
    { label: "19️⃣ Main reason customers choose you over others:", options: [
      "Pricing", "Personalization", "Speed", "Trust", "Quality / accuracy", "Innovation", "Ease of use", "Support", "Brand reputation", "Combination"
    ], type: "radio", name: "chooseReason" },
    { label: "20️⃣ If your product disappeared tomorrow, how would customers react?", options: [
      "Highly disappointed", "Somewhat disappointed", "Neutral", "Would find alternative", "Would wait for return", "Would build in-house", "Not yet active customers", "Don’t know", "Pre-launch", "Other"
    ], type: "radio", name: "disappearReaction" },
    { label: "21️⃣ Which positive impact best represents your startup?", options: [
      "Job creation", "Health improvement", "Financial inclusion", "Education access", "Climate / sustainability", "Gender equality", "Rural empowerment", "Digital literacy", "Human well-being", "Other"
    ], type: "radio", name: "positiveImpact" },
    { label: "22️⃣ Which UN SDG is closest to your business model?", options: [
      "SDG 3 – Good Health", "SDG 4 – Quality Education", "SDG 5 – Gender Equality", "SDG 7 – Clean Energy", "SDG 8 – Decent Work", "SDG 9 – Industry & Innovation", "SDG 11 – Sustainable Cities", "SDG 12 – Responsible Consumption", "SDG 13 – Climate Action", "Other"
    ], type: "radio", name: "sdg" },
    { label: "23️⃣ Do you measure impact metrics?", options: [
      "Yes, quantified SDG indicators", "Yes, qualitative testimonials", "CSR reports", "Client ROI metrics", "Partner impact dashboard", "Occasional measurement", "Planning tool integration", "No measurement yet", "Unsure how", "Not applicable"
    ], type: "radio", name: "impactMetrics" },
    { label: "24️⃣ How do you handle data ethics & privacy?", options: [
      "GDPR / Indian DPDP compliant", "Consent forms integrated", "Data encryption active", "Internal data policy", "Third-party audited", "Basic consent only", "Planning compliance this quarter", "Learning regulations", "No sensitive data collected", "Not aware"
    ], type: "radio", name: "dataEthics" },
    { label: "25️⃣ At scale, what ethical risk do you foresee?", options: [
      "Algorithm bias", "Addiction / screen time", "Job displacement", "Environmental impact", "Data breach", "Monopoly risk", "Inequality amplification", "Cultural backlash", "Regulatory non-compliance", "None"
    ], type: "radio", name: "ethicalRisk" },
    { label: "26️⃣ Describe the legacy or impact statement you want to leave (≤ 75 words).", type: "text", name: "legacyStatement" },
    { label: "27️⃣ If you had to summarize your venture in one sentence for investors, which fits best?", options: [
      "We are solving a massive inefficiency.", "We’re digitizing a broken industry.", "We create emotional connection through tech.", "We save time and money for millions.", "We enable micro-entrepreneurs.", "We democratize access.", "We build India’s next global brand.", "We turn data into decisions.", "We empower underserved communities.", "Other (custom line)."
    ], type: "radio", name: "investorSummary" },
    { label: "28️⃣ What makes your story believable to investors?", options: [
      "Clear traction data", "Strong team background", "Market pull evidence", "Tech differentiation", "Customer love", "Pilot success", "Media recognition", "IP / patent", "Mentor endorsement", "Narrative coherence"
    ], type: "radio", name: "storyBelievability" },
    { label: "29️⃣ How prepared are you for a live pitch tomorrow?", options: [
      "Completely ready", "Need minor deck polish", "Need story practice", "Need financial rehearsal", "Need mentor feedback", "Have deck but no narrative", "No deck yet", "Fear public pitching", "Need translation help", "Will be ready within a week"
    ], type: "radio", name: "pitchPreparedness" },
    { label: "30️⃣ Upload (optional): 1-slide vision summary or Demo Day deck.", type: "file", name: "visionUpload" },
  ],
  // Part 4
  [
    { label: "1️⃣ How do you typically respond when growth slows down or metrics fall?", options: [
      "Double down on sales and outreach", "Pause → analyze → re-strategize", "Experiment with new channels", "Seek mentor support or peer advice", "Revisit customer insights", "Blame external factors (economy / market)", "Reflect and pivot rapidly", "Freeze or delay decisions", "Rally team for brainstorm sprints", "Ignore data and trust instinct"
    ], type: "radio", name: "growthSlowResponse" },
    { label: "2️⃣ What best describes your mindset under extreme pressure?", options: [
      "Calm & analytical", "Emotional but resilient", "High-energy problem-solver", "Avoidant / defensive", "Collaborative responder", "Command-style leader", "Creative under chaos", "Reactive / impulsive", "Mindful / centered", "Still learning to handle it"
    ], type: "radio", name: "pressureMindset" },
    { label: "3️⃣ If your main experiment fails, what’s your default next step?", options: [
      "Run a retrospective to extract lessons", "Pivot to adjacent market", "Re-evaluate assumptions with mentor", "Cut losses & move on", "Scale back & iterate small", "Rebuild team energy", "Rebrand or reposition", "Wait for better timing", "Run A/B tests to validate", "Take a short break to recover"
    ], type: "radio", name: "experimentFailStep" },
    { label: "4️⃣ Rate your personal grit (1–10) and share one proof moment (≤ 50 words).", type: "text", name: "personalGrit" },
    { label: "5️⃣ When you face contradictory mentor advice, you usually…", options: [
      "Choose data over emotion", "Follow gut instinct", "Synthesize both and test", "Seek a third view", "Delay decision", "Vote within team", "Pick the most aligned to vision", "Ignore both and experiment", "Benchmark competitors", "Still confused — need guidance"
    ], type: "radio", name: "mentorAdviceResponse" },
    { label: "6️⃣ Upload (optional): short video (≤ 1 min) on “How I handle setbacks.”", type: "file", name: "setbackVideoUpload" },
    { label: "7️⃣ What best describes how you learn new concepts or skills?", options: [
      "Hands-on application", "Self-study / online learning", "Mentorship shadowing", "Peer collaboration", "Trial and error", "Structured reading & journaling", "Micro-courses & AI tools", "Case-study learning", "Live workshops", "Prefer delegating to experts"
    ], type: "radio", name: "learningStyle" },
    { label: "8️⃣ How often do you intentionally step outside your comfort zone?", options: [
      "Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Rarely", "Only when forced", "During programs", "Planned habitually", "Never"
    ], type: "radio", name: "comfortZone" },
    { label: "9️⃣ How frequently do you seek feedback from your team or customers?", options: [
      "Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Ad-hoc", "Never", "Only on launches", "After issues", "Planned survey roll-out"
    ], type: "radio", name: "feedbackFrequency" },
    { label: "🔟 Learning agility score (1–10) + example of rapid course-correction (≤ 50 words).", type: "text", name: "learningAgility" },
    { label: "11️⃣ How do you balance ambition with ethics in decision-making?", options: [
      "Always choose values over speed", "Prefer compliance before growth", "Assess impact on stakeholders", "Follow industry regulations strictly", "Do what’s right even if slower", "Shortcuts if impact is good", "Decide based on ROI", "Mentor-approved judgment", "AI-supported risk modeling", "Don’t consider ethical trade-offs yet"
    ], type: "radio", name: "ethicsBalance" },
    { label: "12️⃣ Which leadership archetype describes you best?", options: [
      "The Visionary", "The Operator", "The Empath", "The Strategist", "The Experimenter", "The Builder", "The Connector", "The Analyst", "The Evangelist", "The Rebel"
    ], type: "radio", name: "leadershipArchetype" },
    { label: "13️⃣ If your team disagrees on a moral choice (e.g., customer data use), you would…", options: [
      "Hold a values review session", "Follow the law strictly", "Seek third-party ethics advisor", "Run stakeholder poll", "Vote democratically", "Decide as founder", "Pause project until resolved", "Communicate transparently to users", "Ignore if minor", "Unsure — need guidance"
    ], type: "radio", name: "moralChoiceResponse" },
    { label: "14️⃣ Describe how your values show up in day-to-day work (≤ 75 words).", type: "text", name: "valuesDayToDay" },
    { label: "15️⃣ Why do you believe the Wingrox AI e-Accelerator™ is right for you now?", options: [
      "Need structured playbooks to scale", "Seeking funding readiness", "Want to fix unit economics", "Need mentors for growth ops", "Looking for AI-powered growth insights", "Need peer community support", "Seeking corporate pilot opportunities", "Want investor visibility", "Looking for accountability system", "All of the above"
    ], type: "radio", name: "acceleratorReason" },
    { label: "16️⃣ Time commitment you can realistically dedicate to the program:", options: [
      "< 5 hrs per week", "5–10 hrs", "10–15 hrs", "15–20 hrs", "20–30 hrs", "> 30 hrs", "Flexible based on sprints", "Weekend-only", "Delegated to team", "Unsure"
    ], type: "radio", name: "timeCommitment" },
    { label: "17️⃣ How do you prefer to interact with mentors and Growth Architects?", options: [
      "Weekly 1:1 calls", "Live cohorts", "Slack/WhatsApp async", "AI mentor chatbot", "Workshops + office hours", "Peer hot-seats", "Email updates", "As needed only", "In-person (Delhi/Bangalore)", "Flexible"
    ], type: "radio", name: "mentorInteraction" },
    { label: "18️⃣ What type of feedback style works best for you?", options: [
      "Direct & brutal truth", "Encouraging & affirming", "Structured with data", "Collaborative discussion", "Step-by-step guidance", "Visual dashboards", "AI summary reports", "Silent observation then review", "Peer coaching", "Mix of all"
    ], type: "radio", name: "feedbackStyle" },
    { label: "19️⃣ How do you plan to contribute back to the cohort or ecosystem?", options: [
      "Mentor junior founders", "Share learnings in demo stories", "Help peers with my domain", "Offer pilot collaborations", "Invest back in future batches", "Volunteer as Growth Coach", "Support alumni network", "Build community events", "Publish insight articles", "All of the above"
    ], type: "radio", name: "contributionPlan" },
    { label: "20️⃣ If selected, how soon can you begin?", options: [
      "Immediately", "Within a week", "Within 2 weeks", "Within a month", "After funding closure", "Post team alignment", "After product launch", "Pending travel plan", "Flexible", "Other"
    ], type: "radio", name: "startTimeline" },
    { label: "21️⃣ Complete the sentence: “In the next 90 days, my startup will be unrecognizable because…” (≤ 40 words)", type: "text", name: "startup90Days" },
    { label: "22️⃣ If not selected, what will you improve before re-applying?", options: [
      "Financial discipline", "Revenue traction", "Team capacity", "Pitch clarity", "Unit economics", "Customer retention", "Leadership systems", "Impact measurement", "Investor network", "Other"
    ], type: "radio", name: "improveBeforeReapply" },
  ],
];

type FormState = {
  [key: string]: unknown;
};

export default function ProviderIntelligenceForm() {
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<FormState>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const arr: string[] = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];
        if (checked) return { ...prev, [name]: [...arr, value] };
        return { ...prev, [name]: arr.filter((v: string) => v !== value) };
      });
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => setStep((s: number) => Math.min(s + 1, questionnaire.length - 1));
  const handlePrev = () => setStep((s: number) => Math.max(s - 1, 0));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit logic here
    alert("Submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">Wingrox AI e-Accelerator™ — Screening & Selection Questionnaire</h1>
        <div className="flex items-center mb-6">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${step === idx ? 'bg-blue-600' : 'bg-blue-300'}`}>{idx + 1}</div>
              {idx < steps.length - 1 && <div className="w-8 h-1 bg-blue-300 mx-2 rounded" />}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {/* ...existing code for provider-specific multi-step form questions... */}
          <div className="flex justify-between mt-8">
            <button type="button" onClick={handlePrev} disabled={step === 0} className={`px-6 py-2 rounded-full font-semibold shadow ${step === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Previous</button>
            {step < questionnaire.length - 1 ? (
              <button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow">Next</button>
            ) : (
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow">Submit</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
