import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  emailVerified?: boolean;
  role: 'user' | 'admin' | 'coach';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'coach'],
    default: 'user',
    required: true,
  },
  cart: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        image: { type: String },
      }
    ],
    default: [],
    required: false,
  },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);

