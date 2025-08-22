import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPlan extends Document {
  userId: string;
  planId: string;
  assessmentType: string;
  purchasedAt?: Date;
}

const UserPlanSchema: Schema = new Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  assessmentType: { type: String, required: true },
  purchasedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUserPlan>('UserPlan', UserPlanSchema);
