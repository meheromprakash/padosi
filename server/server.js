require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const feedRoutes = require('./routes/feed');
const alertRoutes = require('./routes/alerts');
const listingRoutes = require('./routes/listings');
const businessRoutes = require('./routes/businesses');
const messageRoutes = require('./routes/messages');
const localityRoutes = require('./routes/localities');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// ─── Socket.io ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
  transports: ['websocket'],
});

socketHandler(io);

// Attach io to every request for use in controllers
app.use((req, _res, next) => { req.io = io; next(); });

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Global rate limit ──────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' },
}));

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ─── Static uploads (fallback if Cloudinary not configured) ─────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'Padosi API',
  timestamp: new Date().toISOString(),
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/localities', localityRoutes);

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── MongoDB + Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Padosi server running on port ${PORT}`);
      console.log(`📡 Socket.io enabled`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─── Graceful shutdown ───────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => { mongoose.connection.close(); process.exit(0); });
});
