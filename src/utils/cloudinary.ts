import cloudinary from "../config/cloudinary.config";
import { Readable } from "stream";

interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload image buffer to Cloudinary
 */
export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder: string = "products"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Upload image from URL to Cloudinary
 */
export const uploadImageFromUrl = async (
  imageUrl: string,
  folder: string = "products"
): Promise<UploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error(`Failed to upload image from URL: ${error}`);
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // Don't throw error, just log it
  }
};

/**
 * Upload multiple images (mix of files and URLs)
 */
export const uploadMultipleImages = async (
  files: Express.Multer.File[] = [],
  urls: string[] = [],
  folder: string = "products"
): Promise<string[]> => {
  const uploadPromises: Promise<UploadResult>[] = [];

  // Upload files
  for (const file of files) {
    uploadPromises.push(uploadImageToCloudinary(file.buffer, folder));
  }

  // Upload URLs
  for (const url of urls) {
    if (url && url.trim()) {
      uploadPromises.push(uploadImageFromUrl(url, folder));
    }
  }

  const results = await Promise.all(uploadPromises);
  return results.map((result) => result.url);
};
