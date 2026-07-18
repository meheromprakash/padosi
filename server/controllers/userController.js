const fs = require('fs');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate('localityId', 'name city pincode memberCount');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({
    success: true,
    user: user.toSafeObject(),
  });
});

// PUT /api/users/me
exports.updateMe = asyncHandler(async (req, res) => {
  const { firstName, bio } = req.body;
  const user = await User.findById(req.userId);
  if (!user) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (firstName) user.firstName = firstName.trim().slice(0, 50);
  if (bio !== undefined) user.bio = bio.trim().slice(0, 200);

  // Avatar upload
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.path, 'padosi/avatars');
      user.avatar = result.secure_url;
    } finally {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Temp file cleanup failed:', err.message);
      });
    }
  }

  // Boost trust score on profile completion
  if (firstName && (!user.trustScore || user.trustScore < 70)) {
    user.trustScore = Math.min(100, (user.trustScore || 50) + 15);
  }

  await user.save();
  await User.populate(user, { path: 'localityId', select: 'name city pincode' });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toSafeObject(),
  });
});
