## Real Example: Selecting the 2nd Option for All Questions (9-10 Assessment)

Suppose you select the 2nd option for every question in the 9-10 assessment. Here’s how the score is calculated:

| Q# | Dimension    | 2nd Option Score |
|----|--------------|------------------|
| 1  | clarity      | 9                |
| 2  | clarity      | 8                |
| 3  | confidence   | 9                |
| 4  | exploration  | 9                |
| 5  | exploration  | 9                |
| 6  | exploration  | 9                |
| 7  | resilience   | 9                |
| 8  | resilience   | 9                |

**Dimension Scores:**
- clarity: (9 + 8) / (10 + 10) = 17/20 = 85%
- confidence: 9 / 10 = 90%
- exploration: (9 + 9 + 9) / (10 + 10 + 10) = 27/30 = 90%
- resilience: (9 + 9) / (10 + 10) = 18/20 = 90%

**Overall Score:** (85 + 90 + 90 + 90) / 4 = 88.75% (rounded to 89%)

This is what you’ll see in the report if you select the 2nd option for every question.
# Assessment Scoring System Guide

## Overview
This document explains how the assessment scoring logic works for the WinGroX AI platform, and how you can update or extend it by editing the question JSON file and the scoring service.

## Where is the scoring logic?
- **Questions & Scoring Data:**
  - Located in `client/src/data/student-9-10-questions.json`.
  - Each question includes a `scoringLogic` field (e.g., `"sum"`).
  - Each option has a `score` value.
- **Scoring Service:**
  - Main logic in `client/src/services/assessmentScoringService.js`.
  - Reads the `scoringLogic` field to determine how to score each question.

## How to Edit Questions or Scoring
1. **Edit Questions:**
   - Open `client/src/data/student-9-10-questions.json`.
   - Add, remove, or update questions and options as needed.
   - For each question, set the `scoringLogic` field:
     - `"sum"`: Default, adds up the selected option's score.
     - (Future) `"custom"`: For advanced logic, see below.
2. **Edit Option Scores:**
   - Change the `score` value for any option to adjust its impact.
3. **Add Custom Scoring:**
   - If you need a new scoring method, add a new value for `scoringLogic` (e.g., `"custom"`).
   - Update `assessmentScoringService.js` to handle your new logic.

## Example Question (JSON)
## Sample Scoring Calculation Table

Suppose you have 2 dimensions (Clarity, Confidence) and 2 questions in each. Here’s how the scoring works:

| Dimension   | Q1 Score | Q2 Score | Raw | Max | %    |
|-------------|----------|----------|-----|-----|------|
| Clarity     | 8        | 7        | 15  | 20  | 75%  |
| Confidence  | 6        | 5        | 11  | 20  | 55%  |

**Overall Score:** (75 + 55) / 2 = 65% (Growth Track)

**Strengths:** Top 2–3 dimensions with the highest %

**Opportunities:** Bottom 2–3 dimensions with the lowest %

**Banding:**
- 0–40: High Risk
- 41–70: Growth Track
- 71–100: Strength Track

**Radar Chart:**
Plot each dimension’s % (0–100) for a clear, visual comparison.
```json
{
  "id": 1,
  "category": "Career Path Clarity",
  "question": "How clear are you about what to do after 10th?",
  "dimensionId": "clarity",
  "options": [
    { "option": "a", "text": "I have complete clarity and a strong plan.", "score": 10 },
    { "option": "b", "text": "I have a good idea and have started preparing.", "score": 9 }
  ],
  "scoringLogic": "sum"
}
```

## How to Add a New Scoring Logic
1. Add a new value for `scoringLogic` in your question(s).
2. In `assessmentScoringService.js`, update the scoring function to handle your new logic.
3. Test thoroughly.

## Best Practices
- Always keep a backup of the JSON file before making large changes.
- Validate your JSON (no comments, proper commas, etc.).
- After editing, test the assessment end-to-end.

## Need Help?
See `COACH-PRODUCT-MANAGEMENT.md` or ask a team lead for guidance.
