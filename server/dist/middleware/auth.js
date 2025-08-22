"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Auth middleware object with multiple middleware functions
exports.authMiddleware = {
    // Protect routes - verify token and add user to request
    protect: (req, res, next) => {
        var _a;
        // In all environments, require a real JWT for authentication
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        console.log('[AUTH] Incoming token:', token);
        console.log('[AUTH] JWT_SECRET at runtime:', process.env.JWT_SECRET);
        if (!token) {
            console.warn('[AUTH] No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log('[AUTH] Decoded JWT:', decoded);
            if (typeof decoded !== 'string') {
                req.user = decoded;
                console.log('[AUTH] req.user set:', req.user);
                next();
            }
            else {
                console.error('[AUTH] Invalid token payload (string)');
                throw new Error('Invalid token payload');
            }
        }
        catch (error) {
            console.error('[AUTH] JWT verification error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }
    },
    // Admin role check middleware
    adminOnly: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    }
};
// Export validateJWT as a named function that our routes are importing
const validateJWT = (req, res, next) => {
    // Use the existing protect middleware implementation (always require real JWT)
    exports.authMiddleware.protect(req, res, next);
};
exports.validateJWT = validateJWT;
