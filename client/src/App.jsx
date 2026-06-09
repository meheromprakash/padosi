import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocalityProvider } from './context/LocalityContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Onboarding from './pages/Onboarding';
import AddressVerification from './pages/AddressVerification';
import EmailEntry from './pages/EmailEntry';
import OTPVerification from './pages/OTPVerification';
import ProfileSetup from './pages/ProfileSetup';
import Login from './pages/Login';
import Feed from './pages/Feed';
import SafetyAlerts from './pages/SafetyAlerts';
import Marketplace from './pages/Marketplace';
import Directory from './pages/Directory';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <LocalityProvider>
        <SocketProvider>
          <div className="font-sans antialiased">
            <Routes>
              {/* Public / Onboarding */}
              <Route path="/" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup/address" element={<AddressVerification />} />
              <Route path="/signup/email" element={<EmailEntry />} />
              <Route path="/signup/otp" element={<OTPVerification />} />
              <Route path="/signup/profile" element={<ProfileSetup />} />

              {/* Protected App Routes */}
              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><SafetyAlerts /></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </SocketProvider>
      </LocalityProvider>
    </AuthProvider>
  );
}
