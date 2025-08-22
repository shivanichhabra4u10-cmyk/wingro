# Assessment Administration Guide

This guide helps administrators and teachers understand how to manage and update the student assessment system.

## Understanding the Assessment Structure

The 9-10 grade assessment measures student career readiness across four key dimensions:

1. **Career Clarity** - How clear students are about their future educational and career paths
2. **Self-Confidence** - Students' confidence in making educational decisions
3. **Career Exploration** - How actively students have explored career options
4. **Academic Resilience** - Students' ability to handle challenges and setbacks

Based on their scores across these dimensions, students are matched to one of the following profiles:

- **Career Explorer** - Actively exploring but needs more clarity
- **Focused Planner** - Clear direction with high confidence
- **Resilient Learner** - Strong resilience but needs more career direction
- **Guidance Seeker** - Needs more structured career guidance

## Administering the Assessment

1. **Before the Assessment**:
   - Ensure students have access to a device with internet connection
   - Explain to students that this is not a test but a tool to help guide them
   - Encourage honest responses rather than what they think is "correct"

2. **During the Assessment**:
   - Allow approximately 15-20 minutes for completion
   - Provide a quiet environment for reflection
   - Be available to clarify any questions about the assessment

3. **After the Assessment**:
   - Review results with students individually or in groups
   - Help students interpret their profiles and recommendations
   - Use results to inform guidance sessions and career counseling

## Modifying the Assessment

### Adding New Questions

To add new questions to the assessment:

1. Identify which dimension the question will measure
2. Create a question with 8-10 response options
3. Assign appropriate scores to each option (typically 0-10)
4. Add the question to the JSON file following the existing structure

Example new question:

```json
{
  "id": 9,
  "category": "Part 3: Career Exploration",
  "question": "How often do you research information about careers that interest you?",
  "dimensionId": "exploration",
  "options": [
    {
      "option": "a",
      "text": "Very frequently, as part of a regular habit.",
      "score": 10
    },
    {
      "option": "b",
      "text": "Often, whenever I think about my future.",
      "score": 8
    },
    {
      "option": "c",
      "text": "Sometimes, when something catches my interest.",
      "score": 6
    },
    {
      "option": "d",
      "text": "Rarely, only when required for school.",
      "score": 3
    },
    {
      "option": "e",
      "text": "Never, I haven't researched careers yet.",
      "score": 0
    }
  ]
}
```

### Modifying Scoring Dimensions

If you need to add a new dimension:

1. Add the dimension to the `scoringDimensions` array in the JSON file
2. Create questions that map to this new dimension
3. Update result profiles to consider the new dimension

### Adjusting Result Profiles

To change how students are matched to profiles:

1. Modify the `conditions` object for existing profiles in the JSON file
2. You can use "high", "medium", "low" or combinations like "low-medium"
3. Test the changes with sample data to ensure accurate matching

## Interpreting Results

When reviewing results with students:

1. **Dimension Scores**: Identify strengths and areas for development
2. **Result Profile**: Discuss the overall pattern and what it suggests
3. **Recommendations**: Review specific action steps for improvement
4. **Growth Plans**: Help students create concrete plans based on their results

## Technical Support

For technical issues or questions about the assessment:

- Contact the IT department for system access issues
- Refer to the technical documentation for details on the scoring methodology
- Check the ASSESSMENT-JSON-SCHEMA.md file for guidance on making structural changes

Remember that this assessment is a tool to support student guidance, not a definitive measure of student potential or abilities.
