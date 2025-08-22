# Assessment Scoring System Documentation

This document explains the scoring system implemented for the 9-10 grade student assessment.

## Overview

The scoring system is designed to calculate scores across multiple dimensions based on student responses, determine appropriate result profiles, and provide tailored recommendations. The system is built with flexibility in mind, allowing for easy adjustment of scoring parameters.

## File Structure

1. **Data Files:**
   - `student-9-10-questions-with-scoring.json` - Contains questions, options, scoring values, dimensions, and result profiles

2. **JavaScript Services:**
   - `assessmentScoringService.js` - Contains scoring logic, recommendation generation, and report creation

3. **React Components:**
   - `AssessmentWithScoring.js` - UI component for displaying and taking the assessment

## JSON Structure

The assessment data is stored in a structured JSON format with the following key sections:

### Assessment Metadata

```json
"assessmentMetadata": {
  "id": "student-9-10-assessment",
  "title": "Student Assessment for Grades 9-10",
  "version": "1.0",
  "scoringDimensions": [...],
  "resultProfiles": [...]
}
```

### Scoring Dimensions

Each dimension represents a different aspect being measured:

```json
{
  "id": "clarity",
  "name": "Career Clarity",
  "description": "How clear a student is about their future path",
  "maxScore": 100,
  "thresholds": {
    "high": 80,
    "medium": 40,
    "low": 0
  }
}
```

### Result Profiles

Profiles are determined by combinations of dimension scores:

```json
{
  "id": "focused-planner",
  "name": "Focused Planner",
  "description": "You have a clear direction and are confidently working towards it",
  "conditions": {
    "clarity": "high",
    "confidence": "high"
  }
}
```

### Questions and Options

Each question is associated with a specific dimension and has options with score values:

```json
{
  "id": 1,
  "category": "Part 1: Clarity & Identity Confusion",
  "question": "How clear are you about what to do after 10th?",
  "dimensionId": "clarity",
  "options": [
    {
      "option": "a",
      "text": "I have complete clarity and a strong plan.",
      "score": 10
    },
    ...
  ]
}
```

## Scoring Logic

The scoring system works as follows:

1. **Raw Score Calculation:**
   - For each question answered, the score value of the selected option is added to the raw score of the corresponding dimension.

2. **Percentage Calculation:**
   - Raw scores are converted to percentages based on the maximum possible score for each dimension.

3. **Level Determination:**
   - Based on thresholds defined in the metadata, each dimension score is classified as "high", "medium", or "low".

4. **Profile Matching:**
   - The system compares the user's dimension levels against the conditions defined in result profiles.
   - A user can match multiple profiles, but the first match is considered the primary profile.

5. **Recommendation Generation:**
   - Based on dimension levels and profile matches, personalized recommendations are generated.

## How to Use the System

### Adding a New Question

To add a new question to the assessment:

1. Decide which dimension the question relates to
2. Add a new question object to the `questions` array in the JSON file:

```json
{
  "id": [next available id],
  "category": "Category Name",
  "question": "Your question text here?",
  "dimensionId": "dimension-id",
  "options": [
    {
      "option": "a",
      "text": "Option text",
      "score": 10
    },
    ...
  ]
}
```

3. Ensure each option has an appropriate score value

### Modifying Score Values

To adjust the scoring:

1. Locate the question and option you want to modify
2. Update the `score` property with the new value

### Adding a New Dimension

To add a new assessment dimension:

1. Add a new dimension object to the `scoringDimensions` array:

```json
{
  "id": "new-dimension",
  "name": "Display Name",
  "description": "Description of what this dimension measures",
  "maxScore": 100,
  "thresholds": {
    "high": 75,
    "medium": 40,
    "low": 0
  }
}
```

2. Update relevant questions to use the new dimension or add new questions

### Adding a New Result Profile

To add a new result profile:

1. Add a new profile object to the `resultProfiles` array:

```json
{
  "id": "new-profile",
  "name": "Profile Display Name",
  "description": "Description of this profile type",
  "conditions": {
    "dimension1": "high",
    "dimension2": "low-medium"  // For composite conditions
  }
}
```

2. Update the recommendation logic in `assessmentScoringService.js` if needed

## Best Practices

1. **Balanced Scoring:**
   - Ensure that options are scored consistently across questions
   - Higher scores should consistently represent more positive/desirable responses
   - Consider the relative weight of questions within each dimension

2. **Coherent Dimensions:**
   - Each dimension should represent a cohesive concept
   - Questions within a dimension should relate clearly to that dimension

3. **Meaningful Thresholds:**
   - Set thresholds that create meaningful separations between levels
   - Test with sample data to ensure appropriate distribution

4. **Clear Profile Conditions:**
   - Define profile conditions that create distinct, meaningful categories
   - Avoid overly specific conditions that few users would match

## Extending the System

This scoring system can be extended in several ways:

1. **Additional Dimensions:**
   - Add new dimensions to measure different aspects of student readiness

2. **Weighted Questions:**
   - Modify the system to apply different weights to questions based on importance

3. **Adaptive Assessment:**
   - Implement logic to show different questions based on previous answers

4. **Time-Based Comparison:**
   - Add functionality to compare results over time as students retake the assessment

5. **Detailed Analytics:**
   - Expand the reporting to include more detailed analysis and visualization of results

## Troubleshooting

If you encounter issues with the scoring system:

1. **Unexpected Scores:**
   - Check that question dimension IDs match the defined dimensions
   - Verify that score values are appropriate for each option

2. **No Profile Match:**
   - Review profile conditions to ensure they can be satisfied
   - Check that dimension thresholds are appropriate

3. **Missing Recommendations:**
   - Ensure that recommendation logic covers all potential profile and dimension combinations

4. **UI Display Issues:**
   - Verify that the component correctly accesses and displays data from the scoring service
