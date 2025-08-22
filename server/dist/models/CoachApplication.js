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
const CoachApplicationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedInUrl: { type: String },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    currentTitle: { type: String },
    industry: { type: String },
    growthPhilosophy: { type: String },
    successStory: { type: String },
    coachingStyle: { type: String },
    targetClients: { type: String },
    hourlyRate: { type: String },
    availableHours: { type: String },
    offerPackages: { type: Boolean },
    remoteOnly: { type: Boolean },
    certifications: { type: String },
    yearsCoaching: { type: String },
    preferredIndustries: { type: String },
    languages: { type: String },
    groupCoaching: { type: Boolean },
    aiToolsExperience: { type: String },
    referralSource: { type: String },
    resumeUrl: { type: String },
    profilePhotoUrl: { type: String },
    status: { type: String, default: 'Pending' },
    appliedDate: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('CoachApplication', CoachApplicationSchema);
