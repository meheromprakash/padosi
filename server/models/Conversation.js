const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  unreadCounts: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

// Index on participants and updatedAt for fast inbox thread retrieval
conversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
