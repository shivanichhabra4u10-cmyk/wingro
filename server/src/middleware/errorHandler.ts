import { Request, Response, NextFunction } from 'express';


class AppError extends Error {
    status: number;
    
    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';



    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(status).json({
        error: {
            message,
            status,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

export { errorHandler, AppError };
