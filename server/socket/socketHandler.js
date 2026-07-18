const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).lean();
      if (!user) return next(new Error('User not found'));

      socket.userId = user._id.toString();
      socket.localityId = user.localityId?.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const localityId = socket.localityId;

    console.log(`🔌 Socket connected: ${userId}`);
    onlineUsers.set(userId, socket.id);

    // Join rooms
    socket.join(`user:${userId}`);
    if (localityId) {
      socket.join(`locality:${localityId}`);
      io.to(`locality:${localityId}`).emit('users:online', Array.from(onlineUsers.keys()));
    }

    // Join locality room
    socket.on('join:locality', (lId) => {
      socket.join(`locality:${lId}`);
    });

    // Typing indicator
    socket.on('typing:start', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:start', { senderId: userId });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:stop', { senderId: userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${userId}`);
      onlineUsers.delete(userId);
      if (localityId) {
        io.to(`locality:${localityId}`).emit('users:online', Array.from(onlineUsers.keys()));
      }
    });
  });

  return { onlineUsers };
};
