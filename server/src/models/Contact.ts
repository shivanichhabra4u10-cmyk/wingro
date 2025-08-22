import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phoneNumber?: string; // Optional phone number
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phoneNumber: {
    type: String,
    trim: true,
    // Optional field
    required: false,
    // Basic phone number validation (accepts various formats)
    match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Explicitly set the collection name to lowercase 'contacts'
  collection: 'contacts'
});

// Explicitly specify the collection name as 'contacts' (lowercase)
export default mongoose.model<IContact>('Contact', ContactSchema, 'contacts');
