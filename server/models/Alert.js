const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['safety', 'utility', 'emergency', 'general'], default: 'general' },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  localityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isOfficial: { type: Boolean, default: false },
  notifiedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

alertSchema.index({ localityId: 1, createdAt: -1 });
alertSchema.index({ severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);
