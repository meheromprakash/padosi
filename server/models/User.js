const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 200, default: '' },
  trustScore: { type: Number, default: 50, min: 0, max: 100 },
  localityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality', default: null },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  verification: {
    otpHash: { type: String, default: null, select: false },
    expiresAt: { type: Date, default: null, select: false },
    verified: { type: Boolean, default: false },
  },
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });

// Indexes
userSchema.index({ localityId: 1 });

// Methods
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.verification.otpHash;
  delete obj.verification.expiresAt;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
