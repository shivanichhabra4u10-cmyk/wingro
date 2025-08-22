"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.sanitizeUser = exports.formatTimestamp = exports.validateEnv = exports.asyncHandler = exports.handleError = void 0;
/**
 * Generic error handler for API responses
 */
const handleError = (res, error) => {
    console.error('Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({ error: message });
};
exports.handleError = handleError;
/**
 * Wraps async route handlers to automatically catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
/**
 * Validates required environment variables
 */
const validateEnv = () => {
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
exports.validateEnv = validateEnv;
/**
 * Formats a date to ISO string
 */
const formatTimestamp = (date) => {
    return date.toISOString();
};
exports.formatTimestamp = formatTimestamp;
const sanitizeUser = (user) => {
    const { password } = user, sanitizedUser = __rest(user, ["password"]);
    return sanitizedUser;
};
exports.sanitizeUser = sanitizeUser;
/**
 * Generates a unique ID
 */
const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
exports.generateId = generateId;
