const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

module.exports = (maxSize = 10 * 1024 * 1024) => multer({
  dest: 'uploads/',
  limits: { fileSize: maxSize },
  fileFilter,
});
