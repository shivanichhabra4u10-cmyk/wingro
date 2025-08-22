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
exports.AppError = exports.errorHandler = void 0;
const appInsights = __importStar(require("applicationinsights"));
class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    // Log error to Application Insights if configured
    if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
        const client = appInsights.defaultClient;
        client === null || client === void 0 ? void 0 : client.trackException({
            exception: err,
            properties: {
                url: req.url,
                method: req.method,
                body: req.body,
                params: req.params,
                query: req.query
            }
        });
    }
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }
    res.status(status).json({
        error: Object.assign({ message,
            status }, (process.env.NODE_ENV === 'development' && { stack: err.stack }))
    });
};
exports.errorHandler = errorHandler;
