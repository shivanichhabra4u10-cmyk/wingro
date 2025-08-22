import { Response, NextFunction } from 'express';
import { RequestWithUser } from './auth';

export function adminOnly(req: RequestWithUser, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
}
