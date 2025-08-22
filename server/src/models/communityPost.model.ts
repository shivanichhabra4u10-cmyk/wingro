import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityPost extends Document {
  author: string;
  authorId?: mongoose.Types.ObjectId;
  role?: string;
  question: string;
  details?: string;
  segmentId: string;
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  isAnonymous: boolean;
  isAnswered: boolean;
  answer?: string;
  answeredBy?: string;
  answererRole?: string;
  answererCoachId?: mongoose.Types.ObjectId;
  reflection?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunityPostSchema: Schema = new Schema(
  {
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    question: { type: String, required: true },
    details: { type: String },
    segmentId: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    isAnonymous: { type: Boolean, default: false },
    isAnswered: { type: Boolean, default: false },
    answer: { type: String },
    answeredBy: { type: String },
    answererRole: { type: String },
    answererCoachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    reflection: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommunityPostModel = mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
