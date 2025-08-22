# Verify Student Assessment Data

Write-Host "Verifying student assessment data..." -ForegroundColor Green -BackgroundColor Black

# Check if node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed or not in your PATH. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check if MongoDB connection works
Write-Host "`nChecking MongoDB connection..." -ForegroundColor Cyan
$mongoCheck = node -e "
try {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017', { serverSelectionTimeoutMS: 2000 });
  client.connect().then(() => {
    console.log('MongoDB connection successful');
    process.exit(0);
  }).catch(err => {
    console.error('MongoDB connection failed');
    process.exit(1);
  });
} catch (err) {
  console.error('Error testing MongoDB connection', err);
  process.exit(1);
}
" 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "MongoDB is not running. Please start MongoDB and try again." -ForegroundColor Red
    Write-Host "You can run: ./start-mongodb-api.ps1" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "MongoDB is running" -ForegroundColor Green
}

# Define a simple script to check for student assessments
$verifyScript = @"
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: \${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: \${err.message}`);
    process.exit(1);
  }
};

// Define schema for individual assessment
const IndividualAssessmentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  jobTitle: String,
  company: String,
  yearsExperience: String,
  individualType: String,
  educationLevel: String,
  category: String,
  assessmentType: String,
  responseData: mongoose.Schema.Types.Mixed,
  completedAt: Date,
  createdAt: Date
}, {
  collection: 'individual_assessments'
});

// Create model
const IndividualAssessment = mongoose.model('IndividualAssessment', IndividualAssessmentSchema);

// Function to find student assessments
const findStudentAssessments = async () => {
  try {
    // Find assessments that include "9-10" in category or individualType
    const studentAssessments = await IndividualAssessment.find({
      $or: [
        { category: { \$regex: '9-10', \$options: 'i' } },
        { individualType: { \$regex: '9-10', \$options: 'i' } }
      ]
    }).select('firstName lastName email educationLevel category responseData createdAt completedAt completed').lean();
    
    console.log('\n===== STUDENT 9-10 ASSESSMENTS =====');
    console.log(`Found \${studentAssessments.length} student assessments\n`);
    
    if (studentAssessments.length === 0) {
      console.log('No student assessments found. Try taking a student assessment first.');
      return;
    }
    
    studentAssessments.forEach((assessment, index) => {
      console.log(`--- Assessment \${index + 1} ---`);
      console.log(`ID: \${assessment._id}`);
      console.log(`Name: \${assessment.firstName} \${assessment.lastName}`);
      console.log(`Email: \${assessment.email}`);
      console.log(`Grade: \${assessment.educationLevel || 'N/A'}`);
      console.log(`Category: \${assessment.category || 'N/A'}`);
      console.log(`Created: \${assessment.createdAt}`);      console.log(`Completed: \${assessment.completedAt ? 'Yes, on ' + assessment.completedAt : 'Not completed'}`);
      console.log(`Completed Status: \${assessment.completed ? '✅ Completed' : '❌ Not completed'}`);
      
      // Check for responseData
      if (assessment.responseData && Object.keys(assessment.responseData).length > 0) {
        console.log('\n✅ Response Data found!');
        
        // Check if answers are present
        if (assessment.responseData.answers) {
          const answersCount = Object.keys(assessment.responseData.answers).length;
          console.log(`Questions answered: \${answersCount}`);
        } else {
          console.log('❌ No answers found in response data');
        }
        
        // Check if categories are present
        if (assessment.responseData.categories) {
          const categoriesCount = Object.keys(assessment.responseData.categories).length;
          console.log(`Categories found: \${categoriesCount}`);
        }
        
        // Check if overallScore is present
        if (assessment.responseData.overallScore !== undefined) {
          console.log(`Overall score: \${assessment.responseData.overallScore}`);
        }
      } else {
        console.log('\n❌ No response data found - assessment not completed');
      }
      
      console.log('----------------------------');
    });
  } catch (error) {
    console.error('Error finding student assessments:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
connectDB()
  .then(() => findStudentAssessments())
  .catch(err => console.error(err));
"@

# Save the script to a temporary file
$scriptPath = Join-Path $PSScriptRoot "verify-student-assessments.js"
$verifyScript | Set-Content -Path $scriptPath -Encoding UTF8

Write-Host "`nRunning verification script for student assessment data..." -ForegroundColor Cyan
node $scriptPath

# Clean up temporary file
Remove-Item -Path $scriptPath -Force

Write-Host "`nReminder about relevant MongoDB commands:" -ForegroundColor Yellow
Write-Host "use wingrox_db" -ForegroundColor DarkCyan
Write-Host "db.individual_assessments.find({category: /9-10/}).pretty()" -ForegroundColor DarkCyan
Write-Host "db.individual_assessments.findOne({email: 'student@example.com'})" -ForegroundColor DarkCyan
