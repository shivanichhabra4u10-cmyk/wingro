import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

// Extended Request interface with user property
export interface RequestWithUser extends Request {
    user?: JwtPayload & {
        userId?: string;
        email?: string;
        role?: string;
        name?: string;
    };
}

// Auth middleware object with multiple middleware functions
export const authMiddleware = {
    // Protect routes - verify token and add user to request
    protect: (req: RequestWithUser, res: Response, next: NextFunction) => {
        // In all environments, require a real JWT for authentication
    const token = req.header('Authorization')?.replace('Bearer ', '');
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            console.log('[AUTH] Decoded JWT:', decoded);
            if (typeof decoded !== 'string') {
                req.user = decoded;
                console.log('[AUTH] req.user set:', req.user);
                next();
            } else {
                console.error('[AUTH] Invalid token payload (string)');
                throw new Error('Invalid token payload');
            }
        } catch (error) {
            console.error('[AUTH] JWT verification error:', error);
            res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token.' 
            });
        }
    },
    
    // Admin role check middleware
    adminOnly: (req: RequestWithUser, res: Response, next: NextFunction) => {
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
export const validateJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Use the existing protect middleware implementation (always require real JWT)
    authMiddleware.protect(req, res, next);
};