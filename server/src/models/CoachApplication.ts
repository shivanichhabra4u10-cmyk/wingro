import mongoose, { Schema, Document } from 'mongoose';


export interface ICoachApplication extends Document {
  applicationId: string;
  name: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  specialization: string;
  experience: string;
  currentTitle?: string;
  industry?: string;
  growthPhilosophy?: string;
  successStory?: string;
  coachingStyle?: string;
  targetClients?: string;
  hourlyRate?: string;
  availableHours?: string;
  offerPackages?: boolean;
  remoteOnly?: boolean;
  certifications?: string;
  yearsCoaching?: string;
  preferredIndustries?: string;
  languages?: string;
  groupCoaching?: boolean;
  aiToolsExperience?: string;
  referralSource?: string;
  resumeUrl?: string;
  profilePhotoUrl?: string;
  status: string;
  appliedDate: Date;
}


const CoachApplicationSchema: Schema = new Schema({
  applicationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedInUrl: { type: String },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  currentTitle: { type: String },
  industry: { type: String },
  growthPhilosophy: { type: String },
  successStory: { type: String },
  coachingStyle: { type: String },
  targetClients: { type: String },
  hourlyRate: { type: String },
  availableHours: { type: String },
  offerPackages: { type: Boolean },
  remoteOnly: { type: Boolean },
  certifications: { type: String },
  yearsCoaching: { type: String },
  preferredIndustries: { type: String },
  languages: { type: String },
  groupCoaching: { type: Boolean },
  aiToolsExperience: { type: String },
  referralSource: { type: String },
  resumeUrl: { type: String },
  profilePhotoUrl: { type: String },
  status: { type: String, default: 'Pending' },
  appliedDate: { type: Date, default: Date.now }
});

export default mongoose.model<ICoachApplication>('CoachApplication', CoachApplicationSchema);
