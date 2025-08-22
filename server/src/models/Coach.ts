import mongoose, { Schema, Document } from 'mongoose';

export interface ICoach extends Document {
  applicationId: string;
  certifications?: string;
  yearsCoaching?: string;
  preferredIndustries?: string;
  languages?: string;
  aiToolsExperience?: string;
  referralSource?: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  // bio: string; // Removed as per new requirements
  // experience: number; // Removed as per new requirements
  rating: number;
  clientCount: number;
  topPercentage?: number;
  specializations: string[];
  tags: string[];
  imageUrl?: string;
  // startingPrice: number; // Removed as per new requirements
  pricingModel: 'hourly' | 'monthly' | 'package';
  matchPercentage?: number;
  isActive: boolean;
  linkedinUrl?: string;
  industry?: string;
  growthPhilosophy?: string;
  successStory?: string;
  coachingStyle?: string;
  targetClients?: string;
  hourlyRate?: string;
  availableHours?: string;
  offerPackages?: boolean;
  remoteOnly?: boolean;
  resumeUrl?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    certifications: { type: String, trim: true },
    yearsCoaching: { type: String, trim: true },
    preferredIndustries: { type: String, trim: true },
    languages: { type: String, trim: true },
    aiToolsExperience: { type: String, trim: true },
    referralSource: { type: String, trim: true },
    name: { type: String, required: [true, 'Coach name is required'], trim: true },
    email: { type: String, required: [true, 'Coach email is required'], trim: true },
    phone: { type: String, trim: true },
    title: { type: String, required: [true, 'Coach title is required'], trim: true },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    clientCount: { type: Number, default: 0 },
    topPercentage: { type: Number },
    specializations: [{ type: String, required: [true, 'At least one specialization is required'] }],
    tags: [{ type: String }],
    imageUrl: { type: String },
    pricingModel: { type: String, enum: ['hourly', 'monthly', 'package'], default: 'monthly' },
    matchPercentage: { type: Number },
    isActive: { type: Boolean, default: true },
    linkedinUrl: { type: String, trim: true },
    industry: { type: String, trim: true },
    growthPhilosophy: { type: String, trim: true },
    successStory: { type: String, trim: true },
    coachingStyle: { type: String, trim: true },
    targetClients: { type: String, trim: true },
    hourlyRate: { type: String, trim: true },
    availableHours: { type: String, trim: true },
    offerPackages: { type: Boolean, default: false },
    remoteOnly: { type: Boolean, default: true },
    resumeUrl: { type: String, trim: true },
    profilePhotoUrl: { type: String, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', required: true }
  },
  {
    timestamps: true
  }
);



export default mongoose.model<ICoach>('Coach', CoachSchema);
