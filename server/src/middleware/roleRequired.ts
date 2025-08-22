// Middleware to restrict access based on user roles
import { Response, NextFunction } from 'express';
import { RequestWithUser } from './auth';

export function roleRequired(roles: string[]) {
  return function(req: RequestWithUser, res: Response, next: NextFunction) {
    if (!req.user || typeof req.user.role !== 'string' || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
