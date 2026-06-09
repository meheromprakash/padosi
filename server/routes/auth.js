const router = require('express').Router();
const { startSignup, verifyOtp, login, sendLoginOtp, logout } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,   // 50/15min in dev, 5/15min in production
  message: { message: 'Too many OTP requests. Try again in 15 minutes.' },
  skipSuccessfulRequests: false,
});

router.post('/start-signup', otpLimiter, startSignup);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/login-otp', otpLimiter, sendLoginOtp);
router.post('/login', otpLimiter, login);
router.post('/logout', logout);

module.exports = router;
