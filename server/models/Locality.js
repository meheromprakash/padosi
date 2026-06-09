const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  pincode: { type: String, required: true },
  state: { type: String, default: 'Gujarat' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  memberCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

localitySchema.index({ location: '2dsphere' });
localitySchema.index({ name: 'text', city: 'text' });
localitySchema.index({ pincode: 1 });

module.exports = mongoose.model('Locality', localitySchema);
