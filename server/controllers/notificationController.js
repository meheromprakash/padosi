const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/notifications — Retrieve user notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const userId = req.userId;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipientId: userId })
      .populate('senderId', 'firstName avatar verification.verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Notification.countDocuments({ recipientId: userId }),
  ]);

  const formatted = notifications.map((n) => ({ ...n, sender: n.senderId }));

  res.status(200).json({
    success: true,
    notifications: formatted,
    hasMore: skip + notifications.length < total,
    total,
  });
});

// PUT /api/notifications/:id/read — Mark notification as read
exports.markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.userId },
    { isRead: true },
    { new: true }
  );
  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  res.status(200).json({
    success: true,
    notification: notif,
  });
});

// PUT /api/notifications/read-all — Mark all notifications as read
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipientId: req.userId, isRead: false },
    { isRead: true }
  );
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});
