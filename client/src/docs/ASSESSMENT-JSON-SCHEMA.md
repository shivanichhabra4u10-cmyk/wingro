# Assessment JSON Schema Structure

This document outlines the JSON schema structure used for assessments with scoring capabilities.

## Top-Level Structure

```json
{
  "assessmentMetadata": {
    "id": "assessment-unique-id",
    "title": "Assessment Title",
    "version": "1.0",
    "scoringDimensions": [...],
    "resultProfiles": [...]
  },
  "questions": [...]
}
```

## Scoring Dimensions

Each scoring dimension represents a specific aspect being assessed:

```json
"scoringDimensions": [
  {
    "id": "dimension-id",
    "name": "Dimension Name",
    "description": "Description of what this dimension measures",
    "maxScore": 100,
    "thresholds": {
      "high": 80,
      "medium": 40, 
      "low": 0
    }
  }
]
```

## Result Profiles

Profiles match students to general result categories based on their dimension scores:

```json
"resultProfiles": [
  {
    "id": "profile-id",
    "name": "Profile Name",
    "description": "Description of this profile type",
    "conditions": {
      "dimension-id-1": "high",
      "dimension-id-2": "low-medium"
    }
  }
]
```

Note: Conditions can use "high", "medium", "low" or combinations like "low-medium".

## Questions

Each question is linked to a scoring dimension:

```json
"questions": [
  {
    "id": 1,
    "category": "Question Category",
    "question": "Question text?",
    "dimensionId": "dimension-id",
    "options": [
      {
        "option": "a",
        "text": "Option text",
        "score": 10
      },
      {
        "option": "b",
        "text": "Option text",
        "score": 8
      }
      // Additional options...
    ]
  }
]
```

## Key Features

1. **Dimensional Scoring**: Each question contributes to one specific dimension score.

2. **Weighted Options**: Each answer option carries a specific score value (typically 0-10).

3. **Threshold-Based Classification**: Scores are classified as high/medium/low based on configurable thresholds.

4. **Profile Matching**: Students are matched to result profiles based on their pattern of dimension scores.

5. **Extensible**: The schema allows for any number of dimensions, profiles, and questions.

## Implementation Notes

- Ensure each question has a valid dimensionId that exists in the scoringDimensions array.
- Maintain consistent scoring patterns (e.g., higher values for more positive/confident responses).
- Option scores typically range from 0-10 to maintain consistency and simplify normalization.
- Result profile conditions should use the exact dimension IDs and level values.
