# 🏘️ Padosi — Hyperlocal Neighborhood Social Network

> *पड़ोसी · Your Neighbor · Trusted. Local. Real.*

A production-quality full-stack MERN application connecting verified neighbors within Indian colonies, apartments, and gated communities — inspired by Nextdoor.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Resend account (free) for email OTP (optional, falls back to console logs)
- Cloudinary account (free) for image uploads (optional, falls back to local disk storage)

### 1. Setup Environment Files
Create `.env` files for both client and server by copying the provided example templates:
```bash
# Setup frontend environment variables
cp client/.env.example client/.env

# Setup backend environment variables
cp server/.env.example server/.env
```
Fill in the configuration details inside `server/.env` and `client/.env` (see the **Configuration** section below).

### 2. Install Dependencies
You can install dependencies for the root, client, and server with a single command from the root directory:
```bash
npm run install-all
```

### 3. Run Development Servers
Start both the client and server concurrently from the root directory:
```bash
npm run dev
```
- Client runs at: **http://localhost:5173**
- Server API runs at: **http://localhost:5000**

---

## 🔧 Configuration

### Client Configuration (`client/.env`)
Create `client/.env` and define:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Server Configuration (`server/.env`)
Create `server/.env` and define:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/padosi
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_your_key_here        # from resend.com (free, optional)
EMAIL_FROM=Padosi <noreply@yourdomain.com>
CLOUDINARY_CLOUD_NAME=...              # from cloudinary.com (free, optional)
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> 💡 **Dev tip:** If `RESEND_API_KEY` is not set, OTPs are printed directly to the terminal console instead of being emailed.
> 💡 **Dev tip:** If Cloudinary credentials are not set, the server automatically falls back to local storage (saving files in the `server/uploads/` directory).

---

## 📁 Project Structure

```
Padosi/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── api/               # Axios instance
│       ├── components/        # Reusable UI components
│       ├── context/           # AuthContext, SocketContext, LocalityContext
│       ├── hooks/             # useFeed, useAlerts, useListings, etc.
│       ├── pages/             # All app pages
│       ├── routes/            # ProtectedRoute
│       └── utils/             # dateUtils
│
└── server/                    # Express + Socket.io backend
    ├── controllers/           # Business logic
    ├── middleware/            # auth, errorHandler
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routes
    ├── socket/                # Socket.io handler
    └── utils/                 # email, cloudinary
```

---

## 🧩 Features Implemented

### Auth Flow (Nextdoor-style)
- [x] Welcome/Onboarding screen
- [x] Address verification with colony search
- [x] Email OTP via Resend
- [x] 6-digit OTP input (auto-verify, paste, keyboard nav)
- [x] Profile setup with avatar upload
- [x] JWT authentication (30-day expiry)

### Feed
- [x] Hyperlocal posts by locality
- [x] Category filters (alerts, events, help, etc.)
- [x] Post composer with image upload
- [x] Like/reaction system (optimistic updates)
- [x] Verified neighbor badges

### Safety Alerts
- [x] Severity levels (critical/high/medium/info)
- [x] Real-time broadcast via Socket.io
- [x] Create alert modal

### Marketplace
- [x] Grid listing view
- [x] Free/paid listings
- [x] Category filters
- [x] Image upload

### Business Directory
- [x] Category icons & filters
- [x] Rating & review count
- [x] One-tap Call & WhatsApp
- [x] Verified business badge

### Messaging
- [x] Conversation list
- [x] Real-time chat via Socket.io
- [x] Typing indicators
- [x] Read receipts

### Profile
- [x] Trust score
- [x] Avatar upload
- [x] Edit name & bio
- [x] Logout

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Forest Green | `#2D6A4F` |
| Accent Sage | `#52B788` |
| Background Warm | `#FAF7F2` |
| Font | Inter + Poppins |
| Border Radius | 16px–24px |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/start-signup` | Send OTP for signup |
| POST | `/api/auth/verify-otp` | Verify OTP + issue JWT |
| POST | `/api/auth/login-otp` | Send OTP for login |
| POST | `/api/auth/login` | Verify login OTP |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/feed` | Get locality feed |
| POST | `/api/posts` | Create post |
| GET | `/api/alerts` | Get alerts |
| POST | `/api/alerts` | Create alert |
| GET | `/api/listings` | Get marketplace |
| POST | `/api/listings` | Create listing |
| GET | `/api/businesses` | Get directory |
| GET | `/api/messages/:userId` | Get messages |
| POST | `/api/messages` | Send message |
| GET | `/api/localities/search` | Search localities |

---

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:locality` | Client → Server | Join locality room |
| `message:send` | Client → Server | Send DM |
| `message:receive` | Server → Client | Receive DM |
| `alert:new` | Server → Client | New safety alert |
| `users:online` | Server → Client | Online user list |
| `typing:start/stop` | Bidirectional | Typing indicator |

---

## 🏗️ Next Steps (Phase 10 Integration)

- [ ] Add `nodemon` for server dev
- [ ] Connect Resend API key
- [ ] Connect Cloudinary credentials
- [ ] Add MongoDB Atlas connection
- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Add push notifications (FCM)
- [ ] Add SOS emergency button
- [ ] Add community polls
