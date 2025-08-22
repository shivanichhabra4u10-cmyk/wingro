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
exports.OrganizationAssessment = exports.IndividualAssessment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Create schemas for both assessment types
const IndividualAssessmentSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    yearsExperience: {
        type: String
    },
    individualType: {
        type: String
    },
    educationLevel: {
        type: String
    },
    linkedinUrl: {
        type: String,
        trim: true
    },
    category: {
        type: String
    },
    assessmentType: {
        type: String,
        default: 'individual' // Default value for assessment type
    },
    responseData: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {} // Explicitly set default empty object
    }, completedAt: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'individual_assessments'
});
const OrganizationAssessmentSchema = new mongoose_1.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    contactName: {
        type: String,
        required: [true, 'Contact name is required'],
        trim: true
    },
    contactEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    contactPhone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    companySize: {
        type: String,
        required: [true, 'Company size is required']
    },
    industry: {
        type: String,
        required: [true, 'Industry is required']
    },
    challengeArea: {
        type: String
    },
    message: {
        type: String,
        trim: true
    },
    organizationType: {
        type: String
    },
    yearsFounded: {
        type: String
    },
    teamSize: {
        type: String
    },
    linkedinUrl: {
        type: String,
        trim: true
    },
    category: {
        type: String
    },
    assessmentType: {
        type: String,
        default: 'organization' // Default value for assessment type
    },
    responseData: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {} // Explicitly set default empty object
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'organization_assessments'
});
// Create and export both models
exports.IndividualAssessment = mongoose_1.default.model('IndividualAssessment', IndividualAssessmentSchema);
exports.OrganizationAssessment = mongoose_1.default.model('OrganizationAssessment', OrganizationAssessmentSchema);
