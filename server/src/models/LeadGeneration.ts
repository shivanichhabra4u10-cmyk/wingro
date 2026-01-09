import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadGeneration extends Document {
  name: string;
  companyName: string;
  email: string;
  contactNo: string;
  painAreas: string;
  interestedInDigitalTwin: boolean;
  createdAt: Date;
}

const leadGenerationSchema = new Schema<ILeadGeneration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    painAreas: {
      type: String,
      required: true,
      trim: true,
    },
    interestedInDigitalTwin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
leadGenerationSchema.index({ email: 1 });
leadGenerationSchema.index({ createdAt: -1 });

const LeadGeneration = mongoose.model<ILeadGeneration>('LeadGeneration', leadGenerationSchema);

export default LeadGeneration;
