import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', PostSchema);
