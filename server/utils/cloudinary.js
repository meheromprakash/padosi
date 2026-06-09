const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (filePath, folder = 'padosi') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }],
    });
    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch (_) {}
    return result;
  } catch (err) {
    try { fs.unlinkSync(filePath); } catch (_) {}
    throw new Error('Image upload failed: ' + err.message);
  }
};

exports.deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (_) {}
};
