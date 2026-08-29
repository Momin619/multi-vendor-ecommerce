import cloudinary from "../config/cloudinary.js";

export const deleteCloudinaryImage = async (
  publicId: string,
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};