import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        ok: false,
        message: 'Access token required',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({
        ok: false,
        message: 'Server configuration error',
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: string };
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      res.status(401).json({
        ok: false,
        message: 'Invalid token - user not found',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        ok: false,
        message: 'Invalid token',
      });
      return;
    }

    res.status(500).json({
      ok: false,
      message: 'Authentication error',
    });
  }
}

/**
 * Admin Role Authorization Middleware
 * Requires user to be authenticated and have admin role
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      ok: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      ok: false,
      message: 'Admin access required',
    });
    return;
  }

  next();
}