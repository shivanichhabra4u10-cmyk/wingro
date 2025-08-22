"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    mongodbUri: process.env.MONGODB_URI || '',
    mongodb: {
        uri: process.env.MONGODB_URI || '',
        // You can add options here if needed
    },
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || '',
    azure: {
        appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',
    },
};
