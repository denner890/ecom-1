// Cloudinary upload helper for image management
// Supports both unsigned uploads (demo) and signed uploads (production)

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

interface UploadOptions {
  folder?: string;
  transformation?: string;
  tags?: string[];
}

/**
 * Upload image to Cloudinary using unsigned upload preset (demo mode)
 * For production, use signed uploads via server endpoint for security
 */
export async function uploadToCloudinary(
  file: File, 
  options: UploadOptions = {}
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  // Optional parameters
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.tags) {
    formData.append('tags', options.tags.join(','));
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Generate Cloudinary transformation URL
 * @param publicId - The public ID of the uploaded image
 * @param transformations - Transformation string (e.g., 'w_300,h_300,c_fill')
 */
export function getCloudinaryUrl(publicId: string, transformations?: string): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME not configured');
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
}

/**
 * PRODUCTION SETUP NOTES:
 * 
 * For production applications, implement signed uploads for security:
 * 
 * 1. Create a server endpoint (e.g., POST /api/cloudinary/signature) that:
 *    - Validates the user's permission to upload
 *    - Generates a signature using your Cloudinary API secret
 *    - Returns the signature, timestamp, and other upload parameters
 * 
 * 2. Modify the upload function to:
 *    - First call your server to get the signature
 *    - Include the signature in the upload request
 *    - Remove the upload_preset (not needed for signed uploads)
 * 
 * Example server endpoint (Node.js):
 * ```javascript
 * const cloudinary = require('cloudinary').v2;
 * 
 * app.post('/api/cloudinary/signature', async (req, res) => {
 *   const timestamp = Math.round(new Date().getTime() / 1000);
 *   const signature = cloudinary.utils.api_sign_request(
 *     { timestamp, folder: 'products' },
 *     process.env.CLOUDINARY_API_SECRET
 *   );
 *   
 *   res.json({
 *     signature,
 *     timestamp,
 *     api_key: process.env.CLOUDINARY_API_KEY,
 *     cloud_name: process.env.CLOUDINARY_CLOUD_NAME
 *   });
 * });
 * ```
 * 
 * This approach ensures upload security and prevents unauthorized uploads.
 */

// Utility function for batch uploads
export async function uploadMultipleImages(
  files: File[], 
  options: UploadOptions = {}
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToCloudinary(file, options));
  return Promise.all(uploadPromises);
}

// Image optimization presets
export const imagePresets = {
  thumbnail: 'w_150,h_150,c_fill,q_auto,f_auto',
  productCard: 'w_400,h_400,c_fill,q_auto,f_auto',
  productDetail: 'w_800,h_800,c_fit,q_auto,f_auto',
  hero: 'w_1200,h_600,c_fill,q_auto,f_auto',
};