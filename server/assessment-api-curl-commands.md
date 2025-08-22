# Assessment API Testing Commands

## Test Individual Assessment Response Submission

Replace `YOUR_ASSESSMENT_ID` with an actual assessment ID from your database.

```powershell
$assessmentId = "YOUR_ASSESSMENT_ID"

$body = @{
  responseData = @{
    answers = @{
      "1" = 8
      "2" = 7
      "3" = 5
      "4" = 6
      "5" = 4
      "6" = 9
      "7" = 3
      "8" = 5
      "9" = 7
      "10" = 8
    }
    detailedAnswers = @{
      "1" = @{
        score = 8
        questionText = "How do you feel about your current career growth prospects?"
        category = "Career Growth"
        selectedOption = "Growth feels steady but not exciting"
        optionIndex = 2
      }
    }
    scores = @(
      @{ category = "Career Growth"; score = 7 }
      @{ category = "Purpose"; score = 6 }
      @{ category = "Skills"; score = 7 }
      @{ category = "Work-Life Balance"; score = 4 }
      @{ category = "Financial Security"; score = 8 }
    )
    completedAt = (Get-Date).ToString("o")
    categories = @{
      "Career Growth" = @{ score = 7 }
      "Purpose" = @{ score = 6 }
      "Skills" = @{ score = 7 }
      "Work-Life Balance" = @{ score = 4 }
      "Financial Security" = @{ score = 8 }
    }
    rawQuestionCount = 10
    answeredQuestionCount = 10
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3001/api/assessment/individual/$assessmentId" -Method PUT -ContentType "application/json" -Body $body
```

## Create a New Individual Assessment and Then Update It

1. First create a new assessment:

```powershell
$newAssessment = @{
  firstName = "John"
  lastName = "Doe"
  email = "john.doe@example.com"
  jobTitle = "Software Developer"
  company = "Tech Company"
  yearsExperience = "5-10 years"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3001/api/assessment/individual" -Method POST -ContentType "application/json" -Body $newAssessment

# Store the ID for the next step
$assessmentId = $result.data._id
Write-Host "Created assessment with ID: $assessmentId"
```

2. Then update it with responses:

```powershell
$responseData = @{
  responseData = @{
    answers = @{
      "1" = 8
      "2" = 7
      "3" = 5
      # Add more answers here
    }
    completedAt = (Get-Date).ToString("o")
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://localhost:3001/api/assessment/individual/$assessmentId" -Method PUT -ContentType "application/json" -Body $responseData
```

## Testing Using curl (in PowerShell)

```powershell
# Create a new assessment
$newAssessment = @"
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "jobTitle": "Product Manager",
  "company": "Acme Inc",
  "yearsExperience": "3-5 years"
}
"@

curl.exe -X POST `
  -H "Content-Type: application/json" `
  -d $newAssessment `
  http://localhost:3001/api/assessment/individual

# Update with responses (replace YOUR_ID with actual ID)
$responses = @"
{
  "responseData": {
    "answers": {
      "1": 8,
      "2": 7,
      "3": 6,
      "4": 5,
      "5": 9
    },
    "completedAt": "$(Get-Date -Format o)"
  }
}
"@

curl.exe -X PUT `
  -H "Content-Type: application/json" `
  -d $responses `
  http://localhost:3001/api/assessment/individual/YOUR_ID
```

## Troubleshooting

If you encounter issues:

1. Verify that MongoDB is running and accessible
2. Check server logs for detailed error messages
3. Verify that the assessment ID exists in the database
4. Make sure the request format matches the expected schema
5. Check network connectivity between frontend and backend
