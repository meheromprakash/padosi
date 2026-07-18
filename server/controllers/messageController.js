const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { runInTransaction } = require('../utils/transaction');

// GET /api/messages/conversations — Get all active user threads
exports.getConversations = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate('participants', 'firstName avatar verification.verified')
    .populate({
      path: 'lastMessageId',
      select: 'content senderId receiverId readAt createdAt',
    })
    .sort({ updatedAt: -1 })
    .lean();

  const formatted = conversations
    .map((c) => {
      const partner = c.participants.find((p) => p._id.toString() !== userId.toString());
      if (!partner) return null; // Avoid self-chat errors

      const lastMsg = c.lastMessageId;
      const unreadCount = c.unreadCounts ? (c.unreadCounts[userId] || 0) : 0;

      return {
        _id: c._id,
        userId: partner._id,
        name: partner.firstName || 'Neighbor',
        avatar: partner.avatar,
        verified: partner.verification?.verified || false,
        lastMessage: lastMsg ? lastMsg.content : '',
        time: lastMsg ? lastMsg.createdAt : c.updatedAt,
        unread: unreadCount,
      };
    })
    .filter(Boolean);

  res.status(200).json({
    success: true,
    conversations: formatted,
  });
});

// GET /api/messages/:userId — Get chat logs with a specific user
exports.getMessages = asyncHandler(async (req, res) => {
  const { userId: partnerId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const userId = req.userId;

  const result = await runInTransaction(async (session) => {
    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, partnerId] },
    }).session(session);

    if (!conversation) {
      conversation = (await Conversation.create([{
        participants: [userId, partnerId],
      }], { session }))[0];
    }

    const messages = await Message.find({
      conversationId: conversation._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .session(session)
      .lean();

    // Mark messages from other user as read
    await Message.updateMany(
      { conversationId: conversation._id, receiverId: userId, readAt: null },
      { readAt: new Date() }
    ).session(session);

    // Clear unread counts for current user
    if (conversation.unreadCounts && conversation.unreadCounts.get(userId) > 0) {
      conversation.unreadCounts.set(userId, 0);
      await conversation.save({ session });
    }

    return { success: true, messages };
  });

  res.status(200).json({
    success: true,
    messages: result.messages.reverse(),
  });
});

// POST /api/messages — Send a direct message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const userId = req.userId;

  if (!receiverId || !content?.trim()) {
    return res.status(400).json({ success: false, message: 'Receiver and content required' });
  }

  const result = await runInTransaction(async (session) => {
    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    }).session(session);

    if (!conversation) {
      conversation = (await Conversation.create([{
        participants: [userId, receiverId],
      }], { session }))[0];
    }

    // Create message
    const message = (await Message.create([{
      conversationId: conversation._id,
      senderId: userId,
      receiverId,
      content: content.trim(),
    }], { session }))[0];

    // Update conversation metadata
    conversation.lastMessageId = message._id;
    const currentUnread = conversation.unreadCounts ? (conversation.unreadCounts.get(receiverId) || 0) : 0;
    conversation.unreadCounts.set(receiverId, currentUnread + 1);
    await conversation.save({ session });

    return { success: true, message };
  });

  // Emit via socket
  req.io?.to(`user:${receiverId}`).emit('message:receive', result.message);

  res.status(201).json({
    success: true,
    message: result.message,
  });
});
