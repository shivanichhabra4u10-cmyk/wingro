# Digital Twin Assessment API - Quick Reference

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/digitaltwin/individual` | Start new Digital Twin assessment |
| PUT | `/api/digitaltwin/individual/:id` | Submit assessment responses |
| GET | `/api/digitaltwin/individual/:id` | Retrieve assessment by ID |

## Database Collection
- **Collection Name:** `digitaltwinindividual`
- **Storage:** MongoDB
- **Auto-indexed:** `_id` (MongoDB ObjectId)

## API Request/Response Examples

### 1. POST - Start Assessment
```
POST /api/digitaltwin/individual
Content-Type: application/json

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

Response (201 Created):
{
  "success": true,
  "message": "Digital Twin assessment started successfully",
  "data": {
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
    "assessmentType": "digitaltwin",
    "startedAt": "2025-11-23T10:30:00.000Z",
    "createdAt": "2025-11-23T10:30:00.000Z",
    "updatedAt": "2025-11-23T10:30:00.000Z"
  }
}
```

### 2. PUT - Submit Responses
```
PUT /api/digitaltwin/individual/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "responseData": {
    "answers": {
      "1": "a",
      "2": "c",
      "3": "f",
      "4": "b",
      "5": "d",
      "6": "e",
      "7": "h",
      "8": "g",
      "9": "j",
      "10": "i"
    },
    "completedAt": "2025-11-23T10:45:00.000Z"
  }
}

Response (200 OK):
{
  "success": true,
  "message": "Digital Twin assessment responses saved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "completedAt": "2025-11-23T10:45:00.000Z"
  }
}
```

### 3. GET - Retrieve Assessment
```
GET /api/digitaltwin/individual/507f1f77bcf86cd799439011

Response (200 OK):
{
  "success": true,
  "message": "Digital Twin assessment retrieved successfully",
  "data": {
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
      "completedAt": "2025-11-23T10:45:00.000Z"
    },
    "completed": true,
    "completedAt": "2025-11-23T10:45:00.000Z",
    "assessmentType": "digitaltwin",
    "startedAt": "2025-11-23T10:30:00.000Z",
    "createdAt": "2025-11-23T10:30:00.000Z",
    "updatedAt": "2025-11-23T10:45:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid response data format",
  "errors": [
    {
      "msg": "First name is required",
      "param": "firstName"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Assessment not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error while processing your request"
}
```

## Question Format
Each of the 10 questions expects an answer key (a-j):

1. **a** = Option 1
2. **b** = Option 2
3. **c** = Option 3
4. **d** = Option 4
5. **e** = Option 5
6. **f** = Option 6
7. **g** = Option 7
8. **h** = Option 8
9. **i** = Option 9
10. **j** = Option 10

## Frontend Integration

The DigitalTwinCareer.tsx page automatically:
1. Calls POST on form submission to start assessment
2. Stores the returned `_id` as `assessmentId`
3. Calls PUT when user submits all answers
4. Sends responses in the format: `{ "1": "a", "2": "c", ... "10": "j" }`

## Files Modified/Created

### Backend
- ✅ Created: `server/src/models/DigitalTwinAssessment.ts` (New model)
- ✅ Created: `server/src/routes/digitaltwin.routes.ts` (New routes)
- ✅ Modified: `server/src/controllers/assessment.controller.ts` (Added 3 methods)
- ✅ Modified: `server/src/routes/index.ts` (Added route registration)
- ✅ Modified: `server/src/models/index.ts` (Export new model)

### Frontend
- ✅ Modified: `client/src/pages/DigitalTwinCareer.tsx` (Updated endpoints)

### Documentation
- ✅ Created: `DIGITAL-TWIN-BACKEND-SETUP.md` (Full setup guide)
- ✅ Created: `DIGITAL-TWIN-API-QUICK-REFERENCE.md` (This file)

## Validation Rules

### POST /api/digitaltwin/individual
- **firstName** (required): Non-empty string
- **lastName** (required): Non-empty string
- **email** (required): Valid email format
- **jobTitle** (optional): String
- **company** (optional): String
- **yearsExperience** (optional): String
- **linkedinUrl** (optional): String
- **userId** (optional): String

### PUT /api/digitaltwin/individual/:id
- **responseData** (required): Object with answers
- Must contain valid assessment answers

## Notes

1. **Separate Collection:** All Digital Twin assessments are stored in the `digitaltwinindividual` collection (distinct from `individual_assessments`)

2. **Assessment Type:** All documents have `assessmentType: "digitaltwin"` to help identify them

3. **Timestamps:** All assessments automatically track:
   - `startedAt`: When assessment was created
   - `completedAt`: When responses were submitted
   - `createdAt`: MongoDB creation timestamp
   - `updatedAt`: MongoDB last update timestamp

4. **Response Storage:** The `responseData` field stores the user's answers to all 10 diagnostic questions along with metadata

5. **User Tracking:** Optional `userId` field allows linking assessments to user accounts if needed
