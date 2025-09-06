<<<<<<< HEAD
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { verifyFirebaseToken } from '../utils/firebase';
import  logger  from '../utils/logger';
import { ApiResponse, FirebaseLoginRequest } from '../types';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';


export const loginWithFirebase = async (
  req: Request<{}, ApiResponse<{ token: string; user: any }>, FirebaseLoginRequest>,
  res: Response<ApiResponse<{ token: string; user: any }>>
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        ok: false,
        message: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { idToken } = req.body;

    // Verify Firebase ID token
     let decodedToken: DecodedIdToken | null = null;  // <-- fixed type
    try {
      decodedToken = await verifyFirebaseToken(idToken) as unknown as DecodedIdToken;
    } catch (error) {
      logger.error('Firebase token verification failed:', error);
      res.status(401).json({
        ok: false,
        message: 'Invalid Firebase token'
      });
      return;
    }

    if (!decodedToken) {  // <-- null check added here
      res.status(401).json({
        ok: false,
        message: 'Invalid Firebase token'
      });
      return;
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      res.status(400).json({
        ok: false,
        message: 'Email is required from Firebase token'
      });
      return;
    }

    // Check if user exists by firebaseUid or email
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        { email: email }
      ]
    });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.avatar = picture || user.avatar;
      
      // If user exists but doesn't have firebaseUid, link the accounts
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.provider = 'google';
      }
      
      await user.save();
      logger.info(`Existing user logged in via Firebase: ${email}`);
    } else {
      // Create new user
      user = new User({
        name: name || 'Google User',
        email: email,
        avatar: picture || null,
        provider: 'google',
        firebaseUid: uid,
        role: 'user'
      });
      
      await user.save();
      logger.info(`New user created via Firebase: ${email}`);
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user data (excluding sensitive fields)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(200).json({
      ok: true,
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    logger.error('Firebase login error:', error);
    res.status(500).json({
      ok: false,
      message: 'Internal server error during Firebase authentication'
    });
  }
=======
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { verifyFirebaseToken } from '../utils/firebase';
import { logger } from '../utils/logger';
import { ApiResponse, FirebaseLoginRequest } from '../types';

export const loginWithFirebase = async (
  req: Request<{}, ApiResponse<{ token: string; user: any }>, FirebaseLoginRequest>,
  res: Response<ApiResponse<{ token: string; user: any }>>
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        ok: false,
        message: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { idToken } = req.body;

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(idToken);
    } catch (error) {
      logger.error('Firebase token verification failed:', error);
      res.status(401).json({
        ok: false,
        message: 'Invalid Firebase token'
      });
      return;
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      res.status(400).json({
        ok: false,
        message: 'Email is required from Firebase token'
      });
      return;
    }

    // Check if user exists by firebaseUid or email
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        { email: email }
      ]
    });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.avatar = picture || user.avatar;
      
      // If user exists but doesn't have firebaseUid, link the accounts
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.provider = 'google';
      }
      
      await user.save();
      logger.info(`Existing user logged in via Firebase: ${email}`);
    } else {
      // Create new user
      user = new User({
        name: name || 'Google User',
        email: email,
        avatar: picture || null,
        provider: 'google',
        firebaseUid: uid,
        role: 'user'
      });
      
      await user.save();
      logger.info(`New user created via Firebase: ${email}`);
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user data (excluding sensitive fields)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(200).json({
      ok: true,
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    logger.error('Firebase login error:', error);
    res.status(500).json({
      ok: false,
      message: 'Internal server error during Firebase authentication'
    });
  }
>>>>>>> 609f8954c60f925ccf24f1a23712c8e88f626680
};