import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { loginWithFirebase } from '../controllers/firebaseAuthController';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/errorHandler.js';

const router = Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Routes
<<<<<<< HEAD

=======
// Firebase Google OAuth login
>>>>>>> 609f8954c60f925ccf24f1a23712c8e88f626680
router.post('/firebase', [
  body('idToken')
    .notEmpty()
    .withMessage('Firebase ID token is required')
], validateRequest, loginWithFirebase);

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', requireAuth, getMe);

export default router;