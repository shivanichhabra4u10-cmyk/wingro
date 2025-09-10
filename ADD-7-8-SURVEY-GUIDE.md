
# How to Add a Custom-Scored Survey for Class 7-8 (EQ)
---

## Backend Steps (Using the Same Assessment Model)

If you are using the existing `Assessment` model for all surveys (including 7-8):

1. **No schema/model changes needed.**
  - The current `Assessment` model can store responses for all classes. Just ensure the `type` or `assessmentType` field is set to something like `"class-7-8"` or `"eq-7-8"` when saving responses.

2. **API/Controller:**
  - In your assessment controller, accept and process 7-8 survey submissions just like other surveys.
  - Example: In `controllers/assessment.controller.ts`:
    ```ts
    // When saving a response
    const newAssessment = new Assessment({
     user: req.user.id,
     answers: req.body.answers,
     type: 'class-7-8', // or 'eq-7-8'
     ...otherFields
    });
    await newAssessment.save();
    ```

3. **Routes:**
  - You may add a new route for 7-8, or use a generic endpoint that handles all types.
  - Example:
    ```ts
    router.post('/assessment/7-8', assessmentController.submit);
    // or
    router.post('/assessment', assessmentController.submit); // with type in body
    ```

4. **Analytics/Admin:**
  - To fetch or analyze 7-8 survey data, filter by `type` in your queries.

5. **Validation:**
  - Ensure backend validation accepts the 7-8 survey structure.

---

This guide explains how to add a new survey for class 7-8 (e.g., Emotional Quotient) with custom scoring in the WinGroX codebase.

---

## 1. Create the Survey JSON
- Copy `client/src/data/student-9-10-questions.json` as a template.
- Name it `student-7-8-questions.json`.
- Update:
  - `assessmentMetadata` (id, title, scoringDimensions, resultProfiles)
  - `questions` (your custom questions, options, and scores)

## 2. Add Scoring Logic
- If your scoring is similar to 9-10, you can reuse the logic.
- For custom logic:
  - Update `client/src/utils/assessmentScoringUtils.js` to add a scorer for 7-8.
  - Update `client/src/services/assessmentScoringService.js` to import and use the new JSON and scorer.

## 3. Create a Survey Page/Component
- Copy `CareerAssessment910Page.js` or similar as `CareerAssessment78Page.js`.
- Update the import to use your new JSON file.
- Adjust UI text for class 7-8.

## 4. Add a Route
- In your router (e.g., `App.tsx`), add a route for the new page:
  ```tsx
  <Route path="/assessment/7-8" element={<CareerAssessment78Page />} />
  ```

## 5. Add to Navigation (Optional)
- Update your navigation/menu to link to the new survey.

## 6. Test
- Visit the new route, complete the survey, and verify scoring and results.

---

## Example File Structure
```
client/src/data/student-7-8-questions.json
client/src/pages/CareerAssessment78Page.js
client/src/utils/assessmentScoringUtils.js (updated)
client/src/services/assessmentScoringService.js (updated)
```

---

## Tips
- Keep your JSON structure consistent with other surveys.
- For advanced scoring, add new functions in the utils/service files.
- Test thoroughly with different answer patterns.

---

For questions or help, see the codebase guides or ask the dev team.
