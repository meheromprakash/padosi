const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, maxlength: 500 },
  media: [{ type: String }],
  localityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['general', 'alert', 'event', 'help', 'recommendation', 'listing'],
    default: 'general',
  },
  reactions: {
    like: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
  },
  commentsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

postSchema.index({ localityId: 1, category: 1, createdAt: -1 });
postSchema.index({ localityId: 1, isActive: 1, createdAt: -1 });
postSchema.index({ authorId: 1 });

module.exports = mongoose.model('Post', postSchema);
