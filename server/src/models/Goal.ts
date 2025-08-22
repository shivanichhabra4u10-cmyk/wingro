import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  planId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status?: string;
  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const GoalSchema: Schema = new Schema({
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'GrowthPlan',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: 'pending',
  },
  deadline: {
    type: Date,
    required: false,
  },
}, { timestamps: true });

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
