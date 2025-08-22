"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendPasswordResetEmail = void 0;
function sendPasswordResetEmail(email, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p>`
        });
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendVerificationEmail(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please verify your email by clicking <a href='${verificationUrl}'>here</a>.</p>`
        });
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
