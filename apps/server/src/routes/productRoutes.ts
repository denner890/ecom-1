import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/errorHandler.js';

const router = Router();

// Validation rules
const productValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
];

const updateProductValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', requireAuth, requireAdmin, productValidation, validateRequest, createProduct);
router.patch('/:id', requireAuth, requireAdmin, updateProductValidation, validateRequest, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;