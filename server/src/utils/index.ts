import { Request, Response, NextFunction } from 'express';

/**
 * Generic error handler for API responses
 */
export const handleError = (res: Response, error: Error & { status?: number }) => {
    console.error('Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({ error: message });
};

/**
 * Wraps async route handlers to automatically catch errors
 */
export const asyncHandler = 
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

/**
 * Validates required environment variables
 */
export const validateEnv = (): void => {
    const required = [
        'NODE_ENV',
        'PORT',
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'JWT_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

/**
 * Formats a date to ISO string
 */
export const formatTimestamp = (date: Date): string => {
    return date.toISOString();
};

/**
 * Removes sensitive data from user object
 */
export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    [key: string]: any;
}

export const sanitizeUser = (user: User): Omit<User, 'password'> => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};