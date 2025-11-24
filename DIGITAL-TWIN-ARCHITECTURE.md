# Digital Twin Assessment - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                             │
│                   client/src/pages/DigitalTwinCareer.tsx            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User fills form (name, email, job title)                       │
│     ↓                                                               │
│  2. POST /api/digitaltwin/individual (form data)                   │
│     ↓                                                               │
│  3. Get assessment ID back                                         │
│     ↓                                                               │
│  4. Display 10 diagnostic questions                                │
│     ↓                                                               │
│  5. User selects answers (a-j) for each question                  │
│     ↓                                                               │
│  6. PUT /api/digitaltwin/individual/{id} (response data)          │
│     ↓                                                               │
│  7. Display results/report                                         │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ HTTP/JSON
                         │
┌────────────────────────▼────────────────────────────────────────────┐
│                      BACKEND (Express)                              │
│                 server/src/routes/digitaltwin.routes.ts            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ POST /api/digitaltwin/individual (Create Assessment)        │  │
│  │  - Validate input: firstName, lastName, email (required)    │  │
│  │  - Validate: jobTitle, company (optional)                  │  │
│  │  - Call controller.submitDigitalTwinIndividual()           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ PUT /api/digitaltwin/individual/:id (Submit Responses)      │  │
│  │  - Validate: responseData (required)                        │  │
│  │  - Call controller.updateDigitalTwinIndividual()           │  │
│  │  - Store answers + timestamps                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ GET /api/digitaltwin/individual/:id (Retrieve Assessment)   │  │
│  │  - Call controller.getDigitalTwinIndividual()              │  │
│  │  - Return assessment with responses                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│              server/src/controllers/assessment.controller.ts       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ submitDigitalTwinIndividual()                              │  │
│  │  - Extract form data                                       │  │
│  │  - Create DigitalTwinIndividual document                   │  │
│  │  - Return with _id                                         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ updateDigitalTwinIndividual()                              │  │
│  │  - Update responseData field                               │  │
│  │  - Set completedAt timestamp                               │  │
│  │  - Mark completed = true                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ getDigitalTwinIndividual()                                 │  │
│  │  - Fetch assessment by _id                                 │  │
│  │  - Return full document                                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                                │
│         server/src/models/DigitalTwinAssessment.ts                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Collection: digitaltwinindividual                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Document Structure:                                         │  │
│  │ {                                                           │  │
│  │   _id: ObjectId,                                           │  │
│  │   firstName: String (required),                            │  │
│  │   lastName: String (required),                             │  │
│  │   email: String (required, validated),                     │  │
│  │   jobTitle: String (optional),                             │  │
│  │   company: String (optional),                              │  │
│  │   yearsExperience: String (optional),                      │  │
│  │   linkedinUrl: String (optional),                          │  │
│  │   userId: String (optional),                               │  │
│  │   responseData: {                                          │  │
│  │     answers: {                                             │  │
│  │       "1": "a",  // Q1 answer                              │  │
│  │       "2": "c",  // Q2 answer                              │  │
│  │       ...                                                  │  │
│  │       "10": "i"  // Q10 answer                             │  │
│  │     },                                                     │  │
│  │     completedAt: ISODate                                   │  │
│  │   },                                                       │  │
│  │   completed: Boolean,                                      │  │
│  │   completedAt: ISODate,                                    │  │
│  │   startedAt: ISODate,                                      │  │
│  │   assessmentType: "digitaltwin",                           │  │
│  │   createdAt: ISODate,                                      │  │
│  │   updatedAt: ISODate                                       │  │
│  │ }                                                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### Sequence 1: Create Assessment
```
User                Frontend                Backend                 Database
  │                    │                       │                       │
  ├─ Fill form ──→     │                       │                       │
  │                    ├─ POST /api/digitaltwin/individual ──→         │
  │                    │                       ├─ Validate input       │
  │                    │                       ├─ Create model ──────→ │
  │                    │                       │                       ├─ Insert doc
  │                    │ ←────── Response ─────┤                       │
  │                    │    (assessmentId)     │ ←─ Return _id ───────┤
  │    ←── ID ────────  │                       │                       │
  │                    │                       │                       │
```

### Sequence 2: Submit Answers
```
User                Frontend                Backend                 Database
  │                    │                       │                       │
  ├─ Answer 10 Q's ──→ │                       │                       │
  │                    ├─ PUT /api/digitaltwin/individual/{id} ──→     │
  │                    │   (answers a-j)       ├─ Validate data       │
  │                    │                       ├─ Update doc ──────→  │
  │                    │                       │                       ├─ updateOne
  │                    │                       │                       │   (set responses)
  │                    │ ←────── Success ──────┤                       │
  │                    │    (confirmed)        │ ←─ Confirmation ────┤
  │    ←── Show Results │                       │                       │
```

### Sequence 3: Retrieve Assessment
```
User                Frontend                Backend                 Database
  │                    │                       │                       │
  ├─ View Report ────→ │                       │                       │
  │                    ├─ GET /api/digitaltwin/individual/{id} ──→     │
  │                    │                       ├─ Query by _id        │
  │                    │ ←────── Full Doc ─────┤ ←──────────────────  │
  │                    │   (with responses)    │      (find)           │
  │    ←── Display ─── │                       │                       │
  │       Report       │                       │                       │
```

## File Organization

```
wingro/
├── client/
│   └── src/
│       └── pages/
│           └── DigitalTwinCareer.tsx          ✅ Updated to use /digitaltwin endpoints
│
├── server/
│   └── src/
│       ├── models/
│       │   ├── DigitalTwinAssessment.ts       ✅ NEW - Database model
│       │   └── index.ts                       ✅ Updated - Export new model
│       │
│       ├── routes/
│       │   ├── digitaltwin.routes.ts          ✅ NEW - API routes
│       │   └── index.ts                       ✅ Updated - Register routes
│       │
│       └── controllers/
│           └── assessment.controller.ts       ✅ Updated - Added 3 methods
│
└── Documentation/
    ├── DIGITAL-TWIN-IMPLEMENTATION-COMPLETE.md
    ├── DIGITAL-TWIN-BACKEND-SETUP.md
    └── DIGITAL-TWIN-API-QUICK-REFERENCE.md
```

## Key Features

### ✅ Validation
- Express-validator on all endpoints
- Email format validation
- Required field checking
- Input sanitization (trim, lowercase)

### ✅ Error Handling
- 400: Bad Request (validation failed)
- 404: Not Found (assessment ID invalid)
- 500: Server Error (with logging)
- Comprehensive logging for debugging

### ✅ Database Features
- MongoDB ObjectId auto-generation
- Auto-timestamps (createdAt, updatedAt)
- Proper indexing via Mongoose
- Collection-level organization

### ✅ API Features
- RESTful design (POST, PUT, GET)
- JSON request/response format
- Consistent response structure
- Timeout handling (10s for PUT)

## Collections in MongoDB

```
wingro_db (Main Database)
├── individual_assessments     (General assessments)
├── organization_assessments   (Company assessments)
├── digitaltwinindividual      (Digital Twin career) ✅ NEW
├── products
├── coaches
└── ... (other collections)
```

## Integration with Existing Code

The Digital Twin assessment:
- ✅ Uses existing Express app structure
- ✅ Follows existing controller patterns
- ✅ Uses same validation approach
- ✅ Integrates with existing MongoDB connection
- ✅ No breaking changes to other endpoints
- ✅ Separate collection prevents conflicts

## Performance Considerations

1. **Separate Collection** - Queries don't affect other assessments
2. **Indexes** - MongoDB auto-creates _id index
3. **Timestamps** - Auto-managed by Mongoose
4. **Query Pattern** - Simple findById and updateOne (fast)
5. **Scalability** - Can easily add compound indexes if needed

## Security

- ✅ Input validation on all fields
- ✅ Email format validation
- ✅ MongoDB injection prevention (via Mongoose)
- ✅ Error messages don't expose system details
- ✅ Ready for JWT auth integration if needed
