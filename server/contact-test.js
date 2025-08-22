/**
 * Contact Form Test Script
 * -----------------------
 * This script tests the contact form submission functionality
 * by directly connecting to MongoDB and creating a contact record.
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Define Contact schema matching the one in your application
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Contact model
const Contact = mongoose.model('Contact', ContactSchema);

async function testContactFormSubmission() {
  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect('mongodb://localhost:27017/wingrox_db');
  console.log('Connected to MongoDB successfully!');
  
  try {
    // Create a test contact submission
    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '123-456-7890',
      subject: 'Test Contact Form',
      message: 'This is a test message sent from the contact-test script.'
    };
    
    console.log('\nCreating test contact submission:');
    console.log(testContact);
    
    // Save to database
    const contact = new Contact(testContact);
    const savedContact = await contact.save();
    
    console.log('\n✅ Contact submission successful!');
    console.log('Saved contact record:');
    console.log(JSON.stringify(savedContact, null, 2));
    
    // List all contact submissions
    const allContacts = await Contact.find();
    console.log(`\nAll contacts in database (${allContacts.length} total):`);
    allContacts.forEach((contact, index) => {
      console.log(`\n--- Contact #${index + 1} ---`);
      console.log(`Name: ${contact.name}`);
      console.log(`Email: ${contact.email}`);
      console.log(`Subject: ${contact.subject}`);
      console.log(`Created: ${contact.createdAt}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating contact submission:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Execute the test
testContactFormSubmission()
  .then(() => console.log('\nTest completed!'))
  .catch(err => console.error('Test failed:', err));
