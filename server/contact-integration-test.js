/**
 * Contact Form API Integration Test
 * ---------------------------------
 * This script verifies that the contact form API can save a document
 * to the MongoDB database.
 */

const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const API_URL = 'http://localhost:3001/api/contact';
const MONGODB_URI = 'mongodb://localhost:27017/wingrox_db';

// Test contact data
const contactData = {
  name: 'API Integration Test',
  email: 'integration@test.com',
  phoneNumber: '555-987-6543',
  subject: 'Contact API Integration Test',
  message: 'This message tests the complete flow from API to database storage.'
};

async function verifyContactSubmission() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Count existing contacts before API call
    const contactsCountBefore = await mongoose.connection.db.collection('contacts').countDocuments();
    console.log(`Initial contacts count: ${contactsCountBefore}`);
    
    console.log('\nSending contact form submission to API...');
    console.log(contactData);
    
    try {
      const response = await axios.post(API_URL, contactData);
      console.log('\nAPI Response:');
      console.log(`Status: ${response.status}`);
      console.log(response.data);
      
      // Get document ID from response
      const submittedId = response.data.data?._id;
      console.log(`Submitted document ID: ${submittedId || 'not available'}`);
      
      // Check if document count increased
      const contactsCountAfter = await mongoose.connection.db.collection('contacts').countDocuments();
      console.log(`\nContacts count after submission: ${contactsCountAfter}`);
      
      if (contactsCountAfter > contactsCountBefore) {
        console.log('✅ PASSED: New contact document was added to the database');
        
        // Find the specific document
        if (submittedId) {
          try {
            const savedDoc = await mongoose.connection.db.collection('contacts').findOne({ _id: new mongoose.Types.ObjectId(submittedId) });
            if (savedDoc) {
              console.log('\nFound the saved document:');
              console.log(JSON.stringify(savedDoc, null, 2));
            }
          } catch (err) {
            console.log('Could not find document by ID');
          }
        }
        
        // Show the most recent document
        const latestContact = await mongoose.connection.db.collection('contacts')
          .find({})
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();
          
        if (latestContact.length > 0) {
          console.log('\nMost recent contact document:');
          console.log(JSON.stringify(latestContact[0], null, 2));
        }
      } else {
        console.log('❌ FAILED: No new document was added to the database');
      }
      
    } catch (apiError) {
      console.error('\nAPI call failed:');
      if (apiError.response) {
        console.error(`Status: ${apiError.response.status}`);
        console.error('Response:', apiError.response.data);
      } else {
        console.error(apiError.message);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nTest complete');
  }
}

// Run the test
verifyContactSubmission().catch(console.error);
