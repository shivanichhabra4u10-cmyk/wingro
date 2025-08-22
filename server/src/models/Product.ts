
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  category: string;
  productType: 'individual' | 'enterprise';
  images: string[];
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  oldPrice: {
    type: Number
  },
  badge: {
    type: String,
    enum: ['', 'New', 'Best Seller', 'Popular', 'Premium', 'AI-Powered', 'Quick Win', 'Flagship', 'Enterprise', 'Teams'],
    default: '',
    required: false
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['digital', 'platform', 'service']
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['individual', 'enterprise']
  },
  isFree: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  files: {
    type: Array,
    default: []
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
