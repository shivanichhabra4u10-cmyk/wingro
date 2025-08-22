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
exports.CommunityPostModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CommunityPostSchema = new mongoose_1.Schema({
    author: { type: String, required: true },
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
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
    answererCoachId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Coach' },
    reflection: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.CommunityPostModel = mongoose_1.default.model('CommunityPost', CommunityPostSchema);
