/**
 * MongoDB Collections and Documents Inspector
 * -----------------------------------------
 * This script checks collections and creates a contacts document
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function inspectAndFixContacts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/wingrox_db');
    console.log('Connected to MongoDB successfully!\n');
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    console.log('Current collections in database:');
    const collections = await db.listCollections().toArray();
    for (const coll of collections) {
      console.log(`- ${coll.name}`);
    }
    
    // Check for contacts collection (case-insensitive)
    const contactsCollection = collections.find(c => 
      c.name.toLowerCase() === 'contacts' || 
      c.name === 'Contact' || 
      c.name === 'contact'
    );
    
    if (contactsCollection) {
      console.log(`\nFound contacts collection: "${contactsCollection.name}"`);
      
      // Count documents
      const docCount = await db.collection(contactsCollection.name).countDocuments();
      console.log(`Collection has ${docCount} documents`);
      
      if (docCount > 0) {
        // Show sample document
        const sampleDoc = await db.collection(contactsCollection.name).findOne({});
        console.log('Sample document:');
        console.log(JSON.stringify(sampleDoc, null, 2));
      }
    } else {
      console.log('\nContacts collection not found. Creating it now...');
    }
    
    // Define contacts schema with explicit collection name
    const ContactSchema = new mongoose.Schema({
      name: String,
      email: String, 
      phoneNumber: String,
      subject: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    }, { collection: 'contacts' });
    
    // Create model with explicit collection name
    const ContactModel = mongoose.model('ContactFixed', ContactSchema, 'contacts');
    
    // Create test document
    console.log('\nCreating test contact document...');
    const newContact = await ContactModel.create({
      name: 'Test User ' + new Date().toISOString(),
      email: 'test@example.com',
      phoneNumber: '555-123-4567',
      subject: 'Testing Contact Collection',
      message: 'This is a test message to verify contacts collection is working'
    });
    
    console.log('\nCreated new contact:');
    console.log(JSON.stringify(newContact, null, 2));
    
    // Verify document exists
    console.log('\nVerifying document was saved...');
    const foundContact = await ContactModel.findById(newContact._id);
    
    if (foundContact) {
      console.log('✅ Document successfully saved and retrieved');
    } else {
      console.log('❌ Document not found after saving');
    }
    
    // List collections again to confirm
    console.log('\nVerifying collections after document creation:');
    const collectionsAfter = await db.listCollections().toArray();
    for (const coll of collectionsAfter) {
      console.log(`- ${coll.name}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
inspectAndFixContacts().catch(console.error);
