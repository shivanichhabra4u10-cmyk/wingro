# Digital Twin Assessment Backend Setup

## Overview
Created a dedicated backend endpoint and database collection for storing Digital Twin career assessment data separately from the general assessments.

## Backend Components Created

### 1. **Model: DigitalTwinAssessment.ts**
**Path:** `server/src/models/DigitalTwinAssessment.ts`

- **Collection Name:** `digitaltwinindividual`
- **Interface:** `IDigitalTwinIndividual`
- **Fields:**
  - `userId`: Optional user ID for logged-in users
  - `firstName`, `lastName`: Required user info
  - `email`: Required email (validated)
  - `jobTitle`, `company`, `yearsExperience`: Optional professional info
  - `linkedinUrl`: Optional LinkedIn profile URL
  - `responseData`: Stores the 10 diagnostic question responses (answers object)
  - `startedAt`: Assessment start timestamp
  - `completedAt`: Assessment completion timestamp
  - `completed`: Boolean flag for completion status
  - `assessmentType`: Fixed to 'digitaltwin'
  - Timestamps: `createdAt` and `updatedAt` (auto-managed)

### 2. **Routes: digitaltwin.routes.ts**
**Path:** `server/src/routes/digitaltwin.routes.ts`

#### Endpoints:
- **POST** `/api/digitaltwin/individual` - Start a new Digital Twin assessment
  - Validation: firstName, lastName, email (required); jobTitle, company, yearsExperience, linkedinUrl, userId (optional)
  - Returns: Assessment object with `_id`
  
- **PUT** `/api/digitaltwin/individual/:id` - Update assessment with responses
  - Validation: responseData (required)
  - Updates: responseData, completedAt, completed flag
  - Returns: Success message and completion timestamp

- **GET** `/api/digitaltwin/individual/:id` - Fetch assessment by ID
  - Returns: Full assessment object including all responses

### 3. **Controller Methods: assessment.controller.ts**
**Path:** `server/src/controllers/assessment.controller.ts`

Three new methods added to `assessmentController`:

#### a) **submitDigitalTwinIndividual**
```typescript
POST /api/digitaltwin/individual
- Extracts form data (firstName, lastName, email, jobTitle, company, yearsExperience, linkedinUrl, userId)
- Creates new DigitalTwinIndividual document in MongoDB
- Initializes responseData as empty object
- Returns assessment ID for future updates
```

#### b) **updateDigitalTwinIndividual**
```typescript
PUT /api/digitaltwin/individual/:id
- Updates assessment with response data (answers to 10 diagnostic questions)
- Sets completedAt timestamp and completed flag to true
- Uses MongoDB updateOne with direct query for reliability
- Verifies update and returns success response
```

#### c) **getDigitalTwinIndividual**
```typescript
GET /api/digitaltwin/individual/:id
- Retrieves a specific assessment by ID
- Returns full assessment object
- Returns 404 if not found
```

### 4. **Routes Index Update**
**Path:** `server/src/routes/index.ts`

Added import and registration:
```typescript
import digitalTwinRoutes from './digitaltwin.routes';
router.use('/digitaltwin', digitalTwinRoutes);
```

### 5. **Models Index Update**
**Path:** `server/src/models/index.ts`

Added export:
```typescript
export { DigitalTwinIndividual }
```

## Frontend Changes

### Updated: DigitalTwinCareer.tsx
**Path:** `client/src/pages/DigitalTwinCareer.tsx`

Changed API endpoints:
- **POST submission:** Changed from `/api/assessment/individual` → `/api/digitaltwin/individual`
- **PUT update:** Changed from `/api/assessment/individual/:id` → `/api/digitaltwin/individual/:id`

This ensures Digital Twin assessments are stored in the dedicated `digitaltwinindividual` collection instead of the general `individual_assessments` collection.

## Data Flow

### Starting an Assessment
1. User fills in personal info form
2. Frontend POST to `/api/digitaltwin/individual`
3. Backend creates new document in `digitaltwinindividual` collection
4. Returns assessment ID
5. Frontend stores ID locally and displays the 10 questions

### Submitting Responses
1. User completes all 10 questions
2. Frontend PUT to `/api/digitaltwin/individual/:id` with responseData
3. Backend updates document with:
   - User's answers to all 10 questions
   - Timestamp when completed
   - Completion flag
4. Returns success confirmation

### Retrieving Assessment
1. Frontend GET to `/api/digitaltwin/individual/:id`
2. Backend returns full assessment including responses and answers

## Data Structure Example

### Initial POST Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "jobTitle": "Product Manager",
  "company": "Acme Corp",
  "yearsExperience": "5-7 years",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "userId": "user123"  // optional
}
```

### Returned Assessment
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "jobTitle": "Product Manager",
  "company": "Acme Corp",
  "yearsExperience": "5-7 years",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "userId": "user123",
  "responseData": {},
  "completed": false,
  "startedAt": "2025-11-23T10:30:00Z",
  "createdAt": "2025-11-23T10:30:00Z",
  "updatedAt": "2025-11-23T10:30:00Z",
  "assessmentType": "digitaltwin"
}
```

### PUT Update Request (Submit Answers)
```json
{
  "responseData": {
    "answers": {
      "1": "a",  // Q1: Identity & Purpose Alignment
      "2": "c",  // Q2: Flow & Strength Expression
      "3": "f",  // Q3: Career Trajectory Perception
      "4": "b",  // Q4: Emotional Relationship with Work
      "5": "d",  // Q5: Energy & Workload Reality
      "6": "e",  // Q6: Cultural Tension Signal
      "7": "h",  // Q7: Leadership Energy Drain/Boost
      "8": "g",  // Q8: Meaning & Values Alignment
      "9": "j",  // Q9: Reinvention & Future-Readiness
      "10": "i"  // Q10: Hidden Passion & Future Self Expression
    },
    "completedAt": "2025-11-23T10:45:00Z"
  }
}
```

### Updated Document (After PUT)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "jobTitle": "Product Manager",
  "company": "Acme Corp",
  "yearsExperience": "5-7 years",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "userId": "user123",
  "responseData": {
    "answers": {
      "1": "a",
      "2": "c",
      ...
      "10": "i"
    },
    "completedAt": "2025-11-23T10:45:00Z"
  },
  "completed": true,
  "completedAt": "2025-11-23T10:45:00Z",
  "startedAt": "2025-11-23T10:30:00Z",
  "createdAt": "2025-11-23T10:30:00Z",
  "updatedAt": "2025-11-23T10:45:00Z",
  "assessmentType": "digitaltwin"
}
```

## MongoDB Collection
**Collection Name:** `digitaltwinindividual`

This collection now stores all Digital Twin career assessments separately from:
- `individual_assessments` - General/student assessments
- `organization_assessments` - Organization/company assessments

## Testing the Endpoints

### 1. Start Assessment
```powershell
$data = @{
  firstName = "Jane"
  lastName = "Smith"
  email = "jane@example.com"
  jobTitle = "Software Engineer"
  company = "Tech Startup"
  yearsExperience = "3-5"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/digitaltwin/individual" `
  -Method POST `
  -ContentType "application/json" `
  -Body $data

$assessmentId = $response.data._id
Write-Host "Assessment ID: $assessmentId"
```

### 2. Submit Responses
```powershell
$answers = @{
  responseData = @{
    answers = @{
      "1" = "a"
      "2" = "c"
      "3" = "f"
      "4" = "b"
      "5" = "d"
      "6" = "e"
      "7" = "h"
      "8" = "g"
      "9" = "j"
      "10" = "i"
    }
  }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/digitaltwin/individual/$assessmentId" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $answers
```

### 3. Retrieve Assessment
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/digitaltwin/individual/$assessmentId" `
  -Method GET
```

## Summary

✅ **Complete Digital Twin Assessment Backend**
- Dedicated MongoDB collection: `digitaltwinindividual`
- Three API endpoints: POST (create), PUT (update), GET (retrieve)
- Full request validation with express-validator
- Proper error handling and logging
- Separate from general and organization assessments
- Frontend already updated to use new endpoints

The Digital Twin assessments will now be stored completely separately from other assessment types, making it easy to query and analyze career-focused diagnostic data independently.
