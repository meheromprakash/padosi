const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'heart', 'support'], default: 'like' },
}, { timestamps: true });

// Prevent duplicate reactions from the same user on the same post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
reactionSchema.index({ userId: 1, postId: 1 });

module.exports = mongoose.model('Reaction', reactionSchema);
