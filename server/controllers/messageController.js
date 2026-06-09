const Message = require('../models/Message');

// GET /api/messages/:userId — conversation between two users
exports.getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Mark messages from other user as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.userId, readAt: null },
      { readAt: new Date() }
    );

    res.json({ messages: messages.reverse() });
  } catch (err) { next(err); }
};

// POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: 'Receiver and content required' });
    }

    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      content: content.trim(),
    });

    // Emit via socket
    req.io?.to(`user:${receiverId}`).emit('message:receive', message);

    res.status(201).json({ message });
  } catch (err) { next(err); }
};
