const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Locality = require('../models/Locality');
const { sendOtpEmail } = require('../utils/email');

// ─── Generate & hash OTP ──────────────────────────────────────────────────
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// POST /api/auth/start-signup
exports.startSignup = async (req, res, next) => {
  try {
    const { email, address, locality, city, pincode } = req.body;
    if (!email || !address || !locality || !city || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Find or create locality
    let localityDoc = await Locality.findOne({
      name: { $regex: new RegExp(locality, 'i') }, city: { $regex: new RegExp(city, 'i') }
    });
    if (!localityDoc) {
      localityDoc = await Locality.create({ name: locality, city, pincode });
    }

    // Upsert user
    let user = await User.findOne({ email });
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
    await user.save();

    // Send OTP
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email', expiresAt });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email }).select('+verification.otpHash +verification.expiresAt');
    if (!user) return res.status(404).json({ message: 'User not found. Please start signup again.' });

    if (!user.verification.otpHash || !user.verification.expiresAt) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }
    if (new Date() > user.verification.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.verification.otpHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    user.verification.verified = true;
    user.verification.otpHash = null;
    user.verification.expiresAt = null;
    if (!user.trustScore) user.trustScore = 60;
    await user.save();

    const token = signToken(user._id);
    res.json({ message: 'Email verified', token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login-otp  (send OTP for login)
exports.sendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user || !user.verification?.verified) {
      return res.status(404).json({ message: 'No verified account found. Please sign up first.' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    user.verification.otpHash = otpHash;
    user.verification.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email })
      .select('+verification.otpHash +verification.expiresAt')
      .populate('localityId', 'name city pincode');

    if (!user) return res.status(404).json({ message: 'Account not found' });
    if (!user.verification?.verified) return res.status(403).json({ message: 'Email not verified' });

    if (!user.verification.otpHash || new Date() > user.verification.expiresAt) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.verification.otpHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    user.verification.otpHash = null;
    user.verification.expiresAt = null;
    user.lastSeen = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({ message: 'Login successful', token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
