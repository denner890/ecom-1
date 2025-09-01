import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/errorHandler.js';

const router = Router();

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('qty')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

const updateCartValidation = [
  body('qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

// All cart routes require authentication
router.use(requireAuth);

// Routes
router.get('/', getCart);
router.post('/', addToCartValidation, validateRequest, addToCart);
router.patch('/:itemId', updateCartValidation, validateRequest, updateCartItem);
router.delete('/:itemId', removeFromCart);

export default router;