import mongoose, { Schema, Document } from 'mongoose';

export interface IGrowthPlan extends Document {
  name: string;
  description?: string;
  features: string[];
  price: number;
  stripeProductId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GrowthPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  features: [{ type: String }],
  price: { type: Number, required: true },
  stripeProductId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IGrowthPlan>('GrowthPlan', GrowthPlanSchema);
