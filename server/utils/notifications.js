const Notification = require('../models/Notification');

exports.createNotification = async (io, { recipientId, senderId, type, entityId, entityType, content }) => {
  try {
    // Prevent self-notifications
    if (recipientId.toString() === senderId.toString()) return null;

    const notif = await Notification.create({
      recipientId,
      senderId,
      type,
      entityId,
      entityType,
      content,
    });

    await notif.populate('senderId', 'firstName avatar verification.verified');

    // Send real-time notification via Socket.io
    io?.to(`user:${recipientId}`).emit('notification', notif);

    return notif;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};
