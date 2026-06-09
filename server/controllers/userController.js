const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('localityId', 'name city pincode memberCount');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toSafeObject() });
  } catch (err) { next(err); }
};

// PUT /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { firstName, bio } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName.trim().slice(0, 50);
    if (bio !== undefined) user.bio = bio.trim().slice(0, 200);

    // Avatar upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'padosi/avatars');
      user.avatar = result.secure_url;
    }

    // Boost trust score on profile completion
    if (firstName && !user.trustScore || user.trustScore < 70) {
      user.trustScore = Math.min(100, (user.trustScore || 50) + 15);
    }

    await user.save();
    await User.populate(user, { path: 'localityId', select: 'name city pincode' });
    res.json({ user: user.toSafeObject() });
  } catch (err) { next(err); }
};
