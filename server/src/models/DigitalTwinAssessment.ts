import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalTwinIndividual extends Document {
  userId?: string; // Optional user ID if logged in
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  yearsExperience?: string;
  linkedinUrl?: string;
  responseData?: any; // Will store the 10 diagnostic questions responses
  startedAt: Date;
  completedAt?: Date;
  completed: boolean;
  assessmentType: string;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalTwinIndividualSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    jobTitle: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    yearsExperience: {
      type: String
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    responseData: {
      type: Schema.Types.Mixed,
      default: {}
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    completed: {
      type: Boolean,
      default: false
    },
    assessmentType: {
      type: String,
      default: 'digitaltwin'
    }
  },
  {
    collection: 'digitaltwinindividual',
    timestamps: true
  }
);

// Create and export the model
export const DigitalTwinIndividual = mongoose.model<IDigitalTwinIndividual>(
  'DigitalTwinIndividual',
  DigitalTwinIndividualSchema
);
