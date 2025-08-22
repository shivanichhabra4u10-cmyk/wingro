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
const CoachSchema = new mongoose_1.Schema({
    certifications: { type: String, trim: true },
    yearsCoaching: { type: String, trim: true },
    preferredIndustries: { type: String, trim: true },
    languages: { type: String, trim: true },
    aiToolsExperience: { type: String, trim: true },
    referralSource: { type: String, trim: true },
    name: { type: String, required: [true, 'Coach name is required'], trim: true },
    email: { type: String, required: [true, 'Coach email is required'], trim: true },
    phone: { type: String, trim: true },
    title: { type: String, required: [true, 'Coach title is required'], trim: true },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    clientCount: { type: Number, default: 0 },
    topPercentage: { type: Number },
    specializations: [{ type: String, required: [true, 'At least one specialization is required'] }],
    tags: [{ type: String }],
    imageUrl: { type: String },
    pricingModel: { type: String, enum: ['hourly', 'monthly', 'package'], default: 'monthly' },
    matchPercentage: { type: Number },
    isActive: { type: Boolean, default: true },
    linkedinUrl: { type: String, trim: true },
    industry: { type: String, trim: true },
    growthPhilosophy: { type: String, trim: true },
    successStory: { type: String, trim: true },
    coachingStyle: { type: String, trim: true },
    targetClients: { type: String, trim: true },
    hourlyRate: { type: String, trim: true },
    availableHours: { type: String, trim: true },
    offerPackages: { type: Boolean, default: false },
    remoteOnly: { type: Boolean, default: true },
    resumeUrl: { type: String, trim: true },
    profilePhotoUrl: { type: String, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', required: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Coach', CoachSchema);
