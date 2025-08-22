"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Product', ProductSchema);
