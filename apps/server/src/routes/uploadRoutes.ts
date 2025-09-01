import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple, handleImageUpload, handleMultipleImageUpload } from '../utils/cloudinary.js';

const router = Router();

// Image upload routes (admin only)
router.post('/image', requireAuth, requireAdmin, uploadSingle, handleImageUpload);
router.post('/images', requireAuth, requireAdmin, uploadMultiple, handleMultipleImageUpload);

export default router;