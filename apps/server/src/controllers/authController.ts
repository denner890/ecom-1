import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/index.js';
import logger from '../utils/logger.js';


/**
 * Register new user with email/password
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('User already exists with this email', 400);
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    passwordHash: password, // Will be hashed by pre-save middleware
  });

  // Generate JWT token
  const token = user.generateAuthToken();

  logger.info(`New user registered: ${email}`);

  const response: AuthResponse = {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };

  res.status(201).json({
    ok: true,
    message: 'User registered successfully',
    data: response,
  });
});

/**
 * Login user with email/password
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401);
  }

  // Generate JWT token
  const token = user.generateAuthToken();

  logger.info(`User logged in: ${email}`);

  const response: AuthResponse = {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };

  res.json({
    ok: true,
    message: 'Login successful',
    data: response,
  });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    ok: true,
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  });
});