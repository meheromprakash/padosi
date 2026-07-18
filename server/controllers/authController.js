const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Locality = require('../models/Locality');
const { sendOtpEmail } = require('../utils/email');
const asyncHandler = require('../utils/asyncHandler');
const { runInTransaction } = require('../utils/transaction');

// ─── Generate & hash OTP ──────────────────────────────────────────────────
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// POST /api/auth/start-signup
exports.startSignup = asyncHandler(async (req, res) => {
  const { email, address, locality, city, pincode } = req.body;
  if (!email || !address || !locality || !city || !pincode) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await runInTransaction(async (session) => {
    // Find or create locality
    let localityDoc = await Locality.findOne({
      name: { $regex: new RegExp(locality, 'i') },
      city: { $regex: new RegExp(city, 'i') },
    }).session(session);

    if (!localityDoc) {
      localityDoc = (await Locality.create([{ name: locality, city, pincode }], { session }))[0];
    }

    // Upsert user
    let user = await User.findOne({ email }).session(session);
    if (!user) {
      user = new User({ email, address, city, pincode, localityId: localityDoc._id });
    } else {
      user.address = address;
      user.city = city;
      user.pincode = pincode;
      user.localityId = localityDoc._id;
    }
    user.verification.otpHash = otpHash;
    user.verification.expiresAt = expiresAt;
    await user.save({ session });
  });

  // Send OTP outside database transaction
  await sendOtpEmail(email, otp);

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
    expiresAt,
  });
});

// POST /api/auth/verify-otp
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const result = await runInTransaction(async (session) => {
    const user = await User.findOne({ email })
      .select('+verification.otpHash +verification.expiresAt')
      .session(session);

    if (!user) {
      return { status: 404, message: 'User not found. Please start signup again.' };
    }

    if (!user.verification.otpHash || !user.verification.expiresAt) {
      return { status: 400, message: 'No OTP found. Please request a new one.' };
    }

    if (new Date() > user.verification.expiresAt) {
      return { status: 400, message: 'OTP has expired. Please request a new one.' };
    }

    const isMatch = await bcrypt.compare(otp, user.verification.otpHash);
    if (!isMatch) {
      return { status: 400, message: 'Invalid OTP. Please try again.' };
    }

    const wasVerified = user.verification.verified;
    user.verification.verified = true;
    user.verification.otpHash = null;
    user.verification.expiresAt = null;
    if (!user.trustScore) user.trustScore = 60;
    await user.save({ session });

    // Transactionally update memberCount
    if (!wasVerified && user.localityId) {
      await Locality.findByIdAndUpdate(user.localityId, { $inc: { memberCount: 1 } }).session(session);
    }

    return { success: true, user };
  });

  if (!result.success) {
    return res.status(result.status).json({ success: false, message: result.message });
  }

  const token = signToken(result.user._id);
  res.status(200).json({
    success: true,
    message: 'Email verified',
    token,
    user: result.user.toSafeObject(),
  });
});

// POST /api/auth/login-otp
exports.sendLoginOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user || !user.verification?.verified) {
    return res.status(404).json({ success: false, message: 'No verified account found. Please sign up first.' });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  user.verification.otpHash = otpHash;
  user.verification.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otp);
  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const user = await User.findOne({ email })
    .select('+verification.otpHash +verification.expiresAt')
    .populate('localityId', 'name city pincode');

  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  if (!user.verification?.verified) {
    return res.status(403).json({ success: false, message: 'Email not verified' });
  }

  if (!user.verification.otpHash || new Date() > user.verification.expiresAt) {
    return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
  }

  const isMatch = await bcrypt.compare(otp, user.verification.otpHash);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  user.verification.otpHash = null;
  user.verification.expiresAt = null;
  user.lastSeen = new Date();
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toSafeObject(),
  });
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
