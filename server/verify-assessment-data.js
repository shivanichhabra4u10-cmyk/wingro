// Script to verify assessment data in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
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
  responseData: mongoose.Schema.Types.Mixed,
  createdAt: Date
}, {
  collection: 'individual_assessments'
});

// Create model
const IndividualAssessment = mongoose.model('IndividualAssessment', IndividualAssessmentSchema);

// Function to list all individual assessments
const listIndividualAssessments = async () => {
  try {
    const assessments = await IndividualAssessment.find()
      .select('firstName lastName email jobTitle createdAt responseData')
      .lean();
    
    console.log('\n===== INDIVIDUAL ASSESSMENTS =====');
    console.log(`Found ${assessments.length} assessments\n`);
    
    assessments.forEach((assessment, index) => {
      console.log(`--- Assessment ${index + 1} ---`);
      console.log(`ID: ${assessment._id}`);
      console.log(`Name: ${assessment.firstName} ${assessment.lastName}`);
      console.log(`Email: ${assessment.email}`);
      console.log(`Job Title: ${assessment.jobTitle}`);
      console.log(`Created: ${assessment.createdAt}`);
        // Print detailed structure info about the document
      console.log('\nDocument structure:');
      console.log('- Top-level fields:', Object.keys(assessment));
      
      // Check for responseData directly in MongoDB document
      if (assessment.responseData) {
        console.log('\n✅ Response Data found!');
        console.log('Response Data type:', typeof assessment.responseData);
        console.log('Response Data keys:', Object.keys(assessment.responseData));
        
        // Check if answers are present
        if (assessment.responseData.answers) {
          console.log(`\nQuestions answered: ${Object.keys(assessment.responseData.answers).length}`);
          console.log('Answer scores:', assessment.responseData.answers);
        } else {
          console.log('\n❌ No answers found in response data');
        }
        
        // Check if category scores are present
        if (assessment.responseData.categories) {
          console.log('\nCategory Scores:');
          Object.entries(assessment.responseData.categories).forEach(([category, data]) => {
            console.log(`- ${category}: ${data.score}/10`);
          });
        }
        
        // Check completion status
        if (assessment.responseData.completedAt) {
          console.log(`\nCompleted at: ${assessment.responseData.completedAt}`);
        } else {
          console.log('\nAssessment not completed yet');
        }
      } else {
        console.log('\n❌ No responseData field found in document!');
        console.log('Available fields:', Object.keys(assessment));
      }
      
      console.log('\n');
    });
  } catch (error) {
    console.error('Error listing assessments:', error);
  }
};

// Function to get one assessment by ID
const getAssessmentById = async (id) => {
  try {
    const assessment = await IndividualAssessment.findById(id).lean();
    
    if (!assessment) {
      console.log(`No assessment found with ID: ${id}`);
      return;
    }
    
    console.log('\n===== ASSESSMENT DETAILS =====');
    console.log(`ID: ${assessment._id}`);
    console.log(`Name: ${assessment.firstName} ${assessment.lastName}`);
    console.log(`Email: ${assessment.email}`);
    
    if (assessment.responseData) {
      console.log('\nRESPONSE DATA:');
      console.log(JSON.stringify(assessment.responseData, null, 2));
    } else {
      console.log('\nNo response data found');
    }
  } catch (error) {
    console.error('Error getting assessment:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  if (args.length > 0) {
    await getAssessmentById(args[0]);
  } else {
    await listIndividualAssessments();
  }
  
  mongoose.disconnect();
};

// Run the script
main().catch(err => {
  console.error('Error in main function:', err);
  process.exit(1);
});

// USAGE:
// List all assessments: node verify-assessment-data.js
// Get specific assessment: node verify-assessment-data.js <assessment-id>
