import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for both assessment types

export interface IIndividualAssessment extends Document {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company?: string;
  yearsExperience?: string;
  individualType?: string; // 9-10-grade, 11-12-grade, working-professional
  educationLevel?: string;
  linkedinUrl?: string;
  category?: string; // Store the assessment category
  assessmentType?: string; // Store the type of assessment (individual)
  createdAt: Date;
  completedAt?: Date; // Add completedAt field to track when assessment was completed
  completed?: boolean; // Flag to indicate if the assessment is completed
  responseData?: any; // Will store the actual assessment responses when user completes the assessment
}

export interface IOrganizationAssessment extends Document {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companySize: string;
  industry: string;
  challengeArea?: string;
  message?: string;
  organizationType?: string; // early-stage-startup, established-startup-sme
  yearsFounded?: string;
  teamSize?: string;
  linkedinUrl?: string;
  category?: string; // Store the assessment category
  assessmentType?: string; // Store the type of assessment (organization)
  createdAt: Date;
  responseData?: any; // Will store the actual assessment responses when completed
}

// Create schemas for both assessment types

const IndividualAssessmentSchema: Schema = new Schema({
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
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: String
  },
  individualType: {
    type: String
  },
  educationLevel: {
    type: String
  },
   linkedinUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String
  },
  assessmentType: {
    type: String,
    default: 'individual' // Default value for assessment type
  },
  responseData: {
    type: Schema.Types.Mixed,
    default: {} // Explicitly set default empty object
  },  completedAt: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'individual_assessments'
});

const OrganizationAssessmentSchema: Schema = new Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  contactPhone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required']
  },
  challengeArea: {
    type: String
  },
  message: {
    type: String,
    trim: true
  },
  organizationType: {
    type: String
  },
  yearsFounded: {
    type: String
  },
  teamSize: {
    type: String
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String
  },
  assessmentType: {
    type: String,
    default: 'organization' // Default value for assessment type
  },
  responseData: {
    type: Schema.Types.Mixed,
    default: {} // Explicitly set default empty object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'organization_assessments'
});

// Create and export both models
export const IndividualAssessment = mongoose.model<IIndividualAssessment>('IndividualAssessment', IndividualAssessmentSchema);
export const OrganizationAssessment = mongoose.model<IOrganizationAssessment>('OrganizationAssessment', OrganizationAssessmentSchema);
