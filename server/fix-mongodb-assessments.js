// Script to add responseData field to existing assessments
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

// Define schema for organization assessment
const OrganizationAssessmentSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  companySize: String,
  industry: String,
  challengeArea: String,
  message: String,
  responseData: mongoose.Schema.Types.Mixed,
  createdAt: Date
}, {
  collection: 'organization_assessments'
});

// Create models
const IndividualAssessment = mongoose.model('IndividualAssessment', IndividualAssessmentSchema);
const OrganizationAssessment = mongoose.model('OrganizationAssessment', OrganizationAssessmentSchema);

// Function to fix individual assessments
const fixIndividualAssessments = async () => {
  try {
    // Find all individual assessments without responseData field or with null responseData
    const assessments = await IndividualAssessment.find({
      $or: [
        { responseData: { $exists: false } },
        { responseData: null }
      ]
    });
    
    console.log(`Found ${assessments.length} individual assessments without responseData`);
    
    // Update each assessment
    for (const assessment of assessments) {
      assessment.responseData = {}; // Initialize with empty object
      await assessment.save();
      console.log(`Updated assessment for ${assessment.firstName} ${assessment.lastName} (${assessment._id})`);
    }
    
    console.log('Individual assessment fix completed');
  } catch (error) {
    console.error('Error fixing individual assessments:', error);
  }
};

// Function to fix organization assessments
const fixOrganizationAssessments = async () => {
  try {
    // Find all organization assessments without responseData field or with null responseData
    const assessments = await OrganizationAssessment.find({
      $or: [
        { responseData: { $exists: false } },
        { responseData: null }
      ]
    });
    
    console.log(`Found ${assessments.length} organization assessments without responseData`);
    
    // Update each assessment
    for (const assessment of assessments) {
      assessment.responseData = {}; // Initialize with empty object
      await assessment.save();
      console.log(`Updated assessment for ${assessment.companyName} (${assessment._id})`);
    }
    
    console.log('Organization assessment fix completed');
  } catch (error) {
    console.error('Error fixing organization assessments:', error);
  }
};

// Function to update a specific assessment by ID
const fixSpecificAssessment = async (id) => {
  try {
    // Try fixing as individual assessment first
    let assessment = await IndividualAssessment.findById(id);
    
    if (assessment) {
      console.log(`Found individual assessment: ${assessment.firstName} ${assessment.lastName}`);
      assessment.responseData = assessment.responseData || {};
      await assessment.save();
      console.log(`Updated individual assessment: ${assessment._id}`);
      return;
    }
    
    // Try as organization assessment
    assessment = await OrganizationAssessment.findById(id);
    
    if (assessment) {
      console.log(`Found organization assessment: ${assessment.companyName}`);
      assessment.responseData = assessment.responseData || {};
      await assessment.save();
      console.log(`Updated organization assessment: ${assessment._id}`);
      return;
    }
    
    console.log(`No assessment found with ID: ${id}`);
  } catch (error) {
    console.error(`Error fixing assessment ${id}:`, error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // If ID is provided, fix specific assessment
    await fixSpecificAssessment(args[0]);
  } else {
    // Otherwise fix all assessments
    await fixIndividualAssessments();
    await fixOrganizationAssessments();
  }
  
  console.log('Done!');
  mongoose.disconnect();
};

// Run the script
main().catch(err => {
  console.error(err);
  process.exit(1);
});

// USAGE:
// Fix all assessments: node fix-mongodb-assessments.js
// Fix specific assessment: node fix-mongodb-assessments.js your-assessment-id
