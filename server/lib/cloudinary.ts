import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { storage } from '../storage';

// Configure Cloudinary from database settings
export async function configureCloudinary() {
  const settings = await storage.getSiteSettings();
  
  if (settings.cloudinaryCloudName && settings.cloudinaryApiKey) {
    cloudinary.config({
      cloud_name: settings.cloudinaryCloudName,
      api_key: settings.cloudinaryApiKey,
      api_secret: process.env.CLOUDINARY_API_SECRET, // Secret should still be in ENV for security
    });
    return true;
  }
  
  // Fallback to Env if DB settings aren't set yet
  if (process.env.CLOUDINARY_URL) {
    return true;
  }
  
  return false;
}

// Multer storage for Cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'dine_restaurant',
      allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
      resource_type: 'auto',
    };
  },
});

export const upload = multer({ storage: cloudinaryStorage });
