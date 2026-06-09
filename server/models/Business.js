const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  category: {
    type: String,
    enum: ['plumber', 'electrician', 'carpenter', 'doctor', 'restaurant', 'grocery', 'pharmacy', 'salon', 'gym', 'tutor', 'other'],
    required: true,
  },
  localityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  contact: { type: String, default: null },
  whatsapp: { type: String, default: null },
  address: { type: String, default: '' },
  description: { type: String, maxlength: 300, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

businessSchema.index({ localityId: 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ name: 'text' });

module.exports = mongoose.model('Business', businessSchema);
