import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: string;
  authorId?: mongoose.Types.ObjectId;
  content: string;
  isAnonymous: boolean;
  likes: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema: Schema = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
