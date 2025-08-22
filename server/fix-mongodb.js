// Direct script to fix MongoDB assessment records - IMMEDIATE FIX APPROACH
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wingrox";

// Create a new MongoClient
const client = new MongoClient(uri);

async function fixAssessments() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");
    
    // Get the database
    const db = client.db();
    
    // Fix individual assessments
    console.log("Fixing individual assessments...");
    const individualResult = await db.collection("individual_assessments").updateMany(
      // Match documents where responseData doesn't exist or is null
      { $or: [{ responseData: { $exists: false } }, { responseData: null }] },
      // Set responseData to an empty object
      { $set: { responseData: {} } }
    );
    
    console.log(`Modified ${individualResult.modifiedCount} individual assessments`);
    
    // Fix organization assessments
    console.log("Fixing organization assessments...");
    const organizationResult = await db.collection("organization_assessments").updateMany(
      // Match documents where responseData doesn't exist or is null
      { $or: [{ responseData: { $exists: false } }, { responseData: null }] },
      // Set responseData to an empty object
      { $set: { responseData: {} } }
    );
    
    console.log(`Modified ${organizationResult.modifiedCount} organization assessments`);
    
    // Fix specific assessment if ID is provided
    const args = process.argv.slice(2);
    if (args.length > 0) {
      const id = args[0];
      console.log(`Fixing specific assessment with ID: ${id}`);
      
      // Try to fix in individual assessments
      const individualSpecificResult = await db.collection("individual_assessments").updateOne(
        { _id: new ObjectId(id) },
        { $set: { responseData: {} } }
      );
      
      if (individualSpecificResult.matchedCount > 0) {
        console.log(`Fixed individual assessment with ID: ${id}`);
      } else {
        // Try to fix in organization assessments
        const organizationSpecificResult = await db.collection("organization_assessments").updateOne(
          { _id: new ObjectId(id) },
          { $set: { responseData: {} } }
        );
        
        if (organizationSpecificResult.matchedCount > 0) {
          console.log(`Fixed organization assessment with ID: ${id}`);
        } else {
          console.log(`No assessment found with ID: ${id}`);
        }
      }
    }
    
    // Verify the results
    console.log("\nVerifying fixes...");
    
    // Check individual assessments
    const individualCount = await db.collection("individual_assessments").countDocuments();
    const individualWithResponseData = await db.collection("individual_assessments").countDocuments({ 
      responseData: { $exists: true } 
    });
    console.log(`Individual assessments: ${individualWithResponseData}/${individualCount} have responseData`);
    
    // Check organization assessments
    const organizationCount = await db.collection("organization_assessments").countDocuments();
    const organizationWithResponseData = await db.collection("organization_assessments").countDocuments({ 
      responseData: { $exists: true } 
    });
    console.log(`Organization assessments: ${organizationWithResponseData}/${organizationCount} have responseData`);
    
    // If specific ID was provided, show the document
    if (args.length > 0) {
      const id = args[0];
      
      // Try to find in individual assessments
      const individual = await db.collection("individual_assessments").findOne({ _id: new ObjectId(id) });
      if (individual) {
        console.log("\nFound individual assessment:");
        console.log(`ID: ${individual._id}`);
        console.log(`Name: ${individual.firstName} ${individual.lastName}`);
        console.log(`Fields: ${Object.keys(individual).join(', ')}`);
        console.log(`Has responseData: ${individual.responseData !== undefined}`);
        if (individual.responseData) {
          console.log(`responseData: ${JSON.stringify(individual.responseData)}`);
        }
      }
      
      // Try to find in organization assessments
      const organization = await db.collection("organization_assessments").findOne({ _id: new ObjectId(id) });
      if (organization) {
        console.log("\nFound organization assessment:");
        console.log(`ID: ${organization._id}`);
        console.log(`Name: ${organization.companyName}`);
        console.log(`Fields: ${Object.keys(organization).join(', ')}`);
        console.log(`Has responseData: ${organization.responseData !== undefined}`);
        if (organization.responseData) {
          console.log(`responseData: ${JSON.stringify(organization.responseData)}`);
        }
      }
    }
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the connection
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the fix
fixAssessments().catch(console.error);

// USAGE:
// Fix all assessments: node fix-mongodb.js
// Fix specific assessment: node fix-mongodb.js <assessment-id>
