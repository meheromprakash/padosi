const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['Post', 'Comment', 'User', 'Listing'], required: true },
  reason: { type: String, required: true, trim: true, maxlength: 200 },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, { timestamps: true });

reportSchema.index({ status: 1 });
reportSchema.index({ targetId: 1 });

module.exports = mongoose.model('Report', reportSchema);
