const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  price: { type: Number, default: 0, min: 0 },
  isFree: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ['electronics', 'furniture', 'clothing', 'books', 'vehicles', 'toys', 'kitchen', 'other'],
    default: 'other',
  },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair'], default: 'good' },
  images: [{ type: String }],
  localityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
}, { timestamps: true });

listingSchema.index({ localityId: 1, createdAt: -1 });
listingSchema.index({ sellerId: 1 });
listingSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Listing', listingSchema);
