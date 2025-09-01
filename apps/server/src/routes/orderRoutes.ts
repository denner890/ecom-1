import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/errorHandler.js';

const router = Router();

// Validation rules
const createOrderValidation = [
  body('shippingAddress.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shipping name is required'),
  body('shippingAddress.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shipping street is required'),
  body('shippingAddress.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shipping city is required'),
  body('shippingAddress.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shipping state is required'),
  body('shippingAddress.zip')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shipping zip is required'),
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Valid status is required'),
];

// User routes
router.post('/', requireAuth, createOrderValidation, validateRequest, createOrder);
router.get('/my', requireAuth, getMyOrders);

// Admin routes
router.get('/', requireAuth, requireAdmin, getAllOrders);
router.patch('/:id/status', requireAuth, requireAdmin, updateStatusValidation, validateRequest, updateOrderStatus);

export default router;