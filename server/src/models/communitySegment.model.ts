import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunitySegment extends Document {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isMatched: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunitySegmentSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    isMatched: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommunitySegmentModel = mongoose.model<ICommunitySegment>('CommunitySegment', CommunitySegmentSchema);
