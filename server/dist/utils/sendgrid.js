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
exports.sendPasswordResetEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
mail_1.default.setApiKey(config_1.config.sendgridApiKey);
function sendPasswordResetEmail(to, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const msg = {
            to,
            from: config_1.config.sendgridFromEmail,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p>`
        };
        yield mail_1.default.send(msg);
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
