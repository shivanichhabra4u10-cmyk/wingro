import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GrowthPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  planId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}