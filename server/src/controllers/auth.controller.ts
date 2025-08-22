// Add RequestWithUser interface for controller methods
interface RequestWithUser extends Request {
    user?: JwtPayload;
}
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import GrowthPlan from '../models/GrowthPlan';
import { Goal } from '../models/Goal';
import { JwtPayload } from 'jsonwebtoken';



export const authController = {
    requestPasswordReset: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Email required' });
            const user = await User.findOne({ email });
            if (!user) return res.status(200).json({ message: 'If this email exists, a reset link will be sent.' });
            // Generate reset token
            const resetToken = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
            // Send email using Gmail (Nodemailer)
            const { sendPasswordResetEmail } = await import('../utils/mailer');
            await sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({ message: 'If this email exists, a reset link will be sent.' });
        } catch (err) {
            console.error('Password reset email error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // List all users (admin only)
    listUsers: async (req: RequestWithUser, res: Response) => {
        try {
            const users = await User.find({}, 'id name email role createdAt updatedAt').sort({ createdAt: -1 });
            res.json({ users });
        } catch (error) {
            console.error('List users error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Update user role (admin only)
    updateUserRole: async (req: RequestWithUser, res: Response) => {
        try {
            const { userId, role } = req.body;
            if (!userId || !role) {
                return res.status(400).json({ error: 'User ID and role required' });
            }
            const validRoles = ['user', 'admin', 'coach'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user, message: 'Role updated successfully.' });
        } catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Update user details (admin only)
    updateUserDetails: async (req: RequestWithUser, res: Response) => {
        try {
            const { id } = req.params;
            const { name, email, role } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'User ID required' });
            }
            // Only allow valid roles if role is being updated
            const update: any = {};
            if (name !== undefined) update.name = name;
            if (email !== undefined) update.email = email;
            if (role !== undefined) {
                const validRoles = ['user', 'admin', 'coach'];
                if (!validRoles.includes(role)) {
                    return res.status(400).json({ error: 'Invalid role' });
                }
                update.role = role;
            }
            const user = await User.findByIdAndUpdate(id, update, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user, message: 'User updated successfully.' });
        } catch (error) {
            console.error('Update user details error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { token, password } = req.body;
            if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
            const payload = jwt.verify(token, config.jwtSecret) as { userId: string, email: string };
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.findByIdAndUpdate(payload.userId, { password: hashedPassword });
            res.json({ message: 'Password reset successful. You can now log in.' });
        } catch (err) {
            res.status(400).json({ error: 'Invalid or expired token' });
        }
    },
    sendOtp: async (req: Request, res: Response) => {
        try {
            const { phone } = req.body;
            if (!phone) return res.status(400).json({ error: 'Phone number required' });
            // Generate OTP (for demo, use 123456)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            // Store OTP in memory (for demo, use a simple object)
            (global as any).otpStore = (global as any).otpStore || {};
            (global as any).otpStore[phone] = otp;
            // TODO: Send OTP via SMS provider
            console.log(`OTP for ${phone}: ${otp}`);
            res.json({ message: 'OTP sent' });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    verifyOtp: async (req: Request, res: Response) => {
        try {
            const { phone, otp } = req.body;
            if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });
            const store = (global as any).otpStore || {};
            if (store[phone] === otp) {
                // Find or create user by phone
                let user = await User.findOne({ phone });
                if (!user) {
                    user = await User.create({ phone, name: 'User', emailVerified: true, password: '' });
                }
                // Issue JWT
                const token = jwt.sign(
                    { userId: user.id, phone: user.phone },
                    config.jwtSecret,
                    { expiresIn: '24h' }
                );
                // Clear OTP
                delete store[phone];
                res.json({ user, token });
            } else {
                res.status(400).json({ error: 'Invalid OTP' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },
    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                return res.status(400).json({ error: 'Invalid token' });
            }
            const payload = jwt.verify(token, config.jwtSecret) as { userId: string, email: string };
            await User.findByIdAndUpdate(payload.userId, { emailVerified: true });
            res.send('Email verified successfully! You can now log in.');
        } catch (err) {
            console.error('Email verification error:', err);
            res.status(400).send('Invalid or expired token');
        }
    },
    register: async (req: Request, res: Response) => {
        try {
            const { email, password, name, phone } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({ email, password: hashedPassword, name, phone, emailVerified: false });

            // Generate email verification token
            const verificationToken = jwt.sign(
                { userId: user.id, email: user.email },
                config.jwtSecret,
                { expiresIn: '1d' }
            );

            // Send verification email
            try {
              const { sendVerificationEmail } = await import('../utils/mailer');
              await sendVerificationEmail(user.email, verificationToken);
            } catch (err) {
              console.error('Error sending verification email:', err);
            }

            res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role, name: user.name },
                config.jwtSecret,
                { expiresIn: '24h' }
            );
            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getProfile: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            // Include createdAt and updatedAt fields
            const user = await User.findById(userId, 'id email name role phone emailVerified createdAt updatedAt');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getGrowthPlans: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;

            const plans = await GrowthPlan.find({ userId }).sort({ createdAt: -1 });
            res.json({ plans });
        } catch (error) {
            console.error('Get growth plans error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    createGrowthPlan: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { title, description } = req.body;

            const plan = await GrowthPlan.create({ title, description, userId });
            res.status(201).json({ plan });
        } catch (error) {
            console.error('Create growth plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getGoals: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            const planId = req.params.planId;

            const goals = await Goal.find({ userId, planId }).sort({ createdAt: -1 });
            res.json({ goals });
        } catch (error) {
            console.error('Get goals error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    createGoal: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            const planId = req.params.planId;
            const { title, description, targetDate } = req.body;

            const goal = await Goal.create({ title, description, deadline: targetDate, userId, planId });
            res.status(201).json({ goal });
        } catch (error) {
            console.error('Create goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    updateGoal: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            const goalId = req.params.id;
            const { title, description, targetDate, completed } = req.body;

            const goal = await Goal.findOneAndUpdate(
                { _id: goalId, userId },
                { title, description, deadline: targetDate, status: completed ? 'completed' : 'pending' },
                { new: true }
            );
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            res.json({ goal });
        } catch (error) {
            console.error('Update goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    deleteGoal: async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.userId;
            const goalId = req.params.id;

            const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Delete goal error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};
