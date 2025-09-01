import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import multer from 'multer';
import logger from './logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer from multer
 * @param folder - Cloudinary folder (optional)
 * @param publicId - Custom public ID (optional)
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder?: string,
  publicId?: string
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
}> {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || 'merch-app',
          public_id: publicId,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Generate signed upload parameters for client-side uploads
 * This is more secure than unsigned uploads
 */
export function generateSignedUploadParams(folder?: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder: folder || 'merch-app',
    quality: 'auto',
    fetch_format: 'auto',
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    ...params,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

/**
 * Middleware to handle single image upload
 */
export const uploadSingle = upload.single('image');

/**
 * Middleware to handle multiple image uploads
 */
export const uploadMultiple = upload.array('images', 10);

/**
 * Express route handler for image upload
 * POST /api/upload/image
 */
export const handleImageUpload = asyncHandler(async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    res.status(400).json({
      ok: false,
      message: 'No image file provided',
    });
    return;
  }

  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      'products',
      `product-${Date.now()}`
    );

    res.json({
      ok: true,
      message: 'Image uploaded successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Image upload failed:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to upload image',
    });
  }
});

/**
 * Express route handler for multiple image uploads
 * POST /api/upload/images
 */
export const handleMultipleImageUpload = asyncHandler(async (req: Request & { files?: Express.Multer.File[] }, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({
      ok: false,
      message: 'No image files provided',
    });
    return;
  }

  try {
    const uploadPromises = req.files.map((file, index) =>
      uploadToCloudinary(
        file.buffer,
        'products',
        `product-${Date.now()}-${index}`
      )
    );

    const results = await Promise.all(uploadPromises);
    
    res.json({
      ok: true,
      message: 'Images uploaded successfully',
      data: results,
    });
  } catch (error) {
    logger.error('Multiple image upload failed:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to upload images',
    });
  }
});