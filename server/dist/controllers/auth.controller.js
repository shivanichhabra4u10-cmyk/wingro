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
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const GrowthPlan_1 = __importDefault(require("../models/GrowthPlan"));
const Goal_1 = require("../models/Goal");
exports.authController = {
    requestPasswordReset: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email)
                return res.status(400).json({ error: 'Email required' });
            const user = yield User_1.User.findOne({ email });
            if (!user)
                return res.status(200).json({ message: 'If this email exists, a reset link will be sent.' });
            // Generate reset token
            const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '1h' });
            // Send email using Gmail (Nodemailer)
            const { sendPasswordResetEmail } = yield Promise.resolve().then(() => __importStar(require('../utils/mailer')));
            yield sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({ message: 'If this email exists, a reset link will be sent.' });
        }
        catch (err) {
            console.error('Password reset email error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    // List all users (admin only)
    listUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield User_1.User.find({}, 'id name email role createdAt updatedAt').sort({ createdAt: -1 });
            res.json({ users });
        }
        catch (error) {
            console.error('List users error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    // Update user role (admin only)
    updateUserRole: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, role } = req.body;
            if (!userId || !role) {
                return res.status(400).json({ error: 'User ID and role required' });
            }
            const validRoles = ['user', 'admin', 'coach'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            const user = yield User_1.User.findByIdAndUpdate(userId, { role }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user, message: 'Role updated successfully.' });
        }
        catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    // Update user details (admin only)
    updateUserDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, email, role } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'User ID required' });
            }
            // Only allow valid roles if role is being updated
            const update = {};
            if (name !== undefined)
                update.name = name;
            if (email !== undefined)
                update.email = email;
            if (role !== undefined) {
                const validRoles = ['user', 'admin', 'coach'];
                if (!validRoles.includes(role)) {
                    return res.status(400).json({ error: 'Invalid role' });
                }
                update.role = role;
            }
            const user = yield User_1.User.findByIdAndUpdate(id, update, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user, message: 'User updated successfully.' });
        }
        catch (error) {
            console.error('Update user details error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            if (!token || !password)
                return res.status(400).json({ error: 'Token and password required' });
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            yield User_1.User.findByIdAndUpdate(payload.userId, { password: hashedPassword });
            res.json({ message: 'Password reset successful. You can now log in.' });
        }
        catch (err) {
            res.status(400).json({ error: 'Invalid or expired token' });
        }
    }),
    sendOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { phone } = req.body;
            if (!phone)
                return res.status(400).json({ error: 'Phone number required' });
            // Generate OTP (for demo, use 123456)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            // Store OTP in memory (for demo, use a simple object)
            global.otpStore = global.otpStore || {};
            global.otpStore[phone] = otp;
            // TODO: Send OTP via SMS provider
            console.log(`OTP for ${phone}: ${otp}`);
            res.json({ message: 'OTP sent' });
        }
        catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }),
    verifyOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { phone, otp } = req.body;
            if (!phone || !otp)
                return res.status(400).json({ error: 'Phone and OTP required' });
            const store = global.otpStore || {};
            if (store[phone] === otp) {
                // Find or create user by phone
                let user = yield User_1.User.findOne({ phone });
                if (!user) {
                    user = yield User_1.User.create({ phone, name: 'User', emailVerified: true, password: '' });
                }
                // Issue JWT
                const token = jsonwebtoken_1.default.sign({ userId: user.id, phone: user.phone }, config_1.config.jwtSecret, { expiresIn: '24h' });
                // Clear OTP
                delete store[phone];
                res.json({ user, token });
            }
            else {
                res.status(400).json({ error: 'Invalid OTP' });
            }
        }
        catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                return res.status(400).json({ error: 'Invalid token' });
            }
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            yield User_1.User.findByIdAndUpdate(payload.userId, { emailVerified: true });
            res.send('Email verified successfully! You can now log in.');
        }
        catch (err) {
            console.error('Email verification error:', err);
            res.status(400).send('Invalid or expired token');
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, name, phone } = req.body;
            // Check if user exists
            const userExists = yield User_1.User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }
            // Hash password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            // Create user
            const user = yield User_1.User.create({ email, password: hashedPassword, name, phone, emailVerified: false });
            // Generate email verification token
            const verificationToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '1d' });
            // Send verification email
            try {
                const { sendVerificationEmail } = yield Promise.resolve().then(() => __importStar(require('../utils/mailer')));
                yield sendVerificationEmail(user.email, verificationToken);
            }
            catch (err) {
                console.error('Error sending verification email:', err);
            }
            res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
        }
        catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Check if user exists
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role, name: user.name }, config_1.config.jwtSecret, { expiresIn: '24h' });
            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    getProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            // Include createdAt and updatedAt fields
            const user = yield User_1.User.findById(userId, 'id email name role phone emailVerified createdAt updatedAt');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        }
        catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    getGrowthPlans: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
            const plans = yield GrowthPlan_1.default.find({ userId }).sort({ createdAt: -1 });
            res.json({ plans });
        }
        catch (error) {
            console.error('Get growth plans error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    createGrowthPlan: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
            const { title, description } = req.body;
            const plan = yield GrowthPlan_1.default.create({ title, description, userId });
            res.status(201).json({ plan });
        }
        catch (error) {
            console.error('Create growth plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    getGoals: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        try {
            const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId;
            const planId = req.params.planId;
            const goals = yield Goal_1.Goal.find({ userId, planId }).sort({ createdAt: -1 });
            res.json({ goals });
        }
        catch (error) {
            console.error('Get goals error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    createGoal: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        try {
            const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId;
            const planId = req.params.planId;
            const { title, description, targetDate } = req.body;
            const goal = yield Goal_1.Goal.create({ title, description, deadline: targetDate, userId, planId });
            res.status(201).json({ goal });
        }
        catch (error) {
            console.error('Create goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    updateGoal: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        try {
            const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.userId;
            const goalId = req.params.id;
            const { title, description, targetDate, completed } = req.body;
            const goal = yield Goal_1.Goal.findOneAndUpdate({ _id: goalId, userId }, { title, description, deadline: targetDate, status: completed ? 'completed' : 'pending' }, { new: true });
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            res.json({ goal });
        }
        catch (error) {
            console.error('Update goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }),
    deleteGoal: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        try {
            const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.userId;
            const goalId = req.params.id;
            const goal = yield Goal_1.Goal.findOneAndDelete({ _id: goalId, userId });
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            res.status(204).send();
        }
        catch (error) {
            console.error('Delete goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    })
};
