import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('padosi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('padosi_token') || null);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({});

  const isAuthenticated = !!token && !!user;

  // ─── Sync token to axios ─────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      localStorage.setItem('padosi_token', token);
    } else {
      localStorage.removeItem('padosi_token');
    }
  }, [token]);

  // ─── Start signup (address + email) ─────────────────────────────────────
  const startSignup = useCallback(async ({ email, address, locality, city, pincode }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/start-signup', {
        email, address, locality, city, pincode,
      });
      setOnboardingData((prev) => ({ ...prev, email, address, locality, city, pincode }));
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Verify OTP ──────────────────────────────────────────────────────────
  const verifyOtp = useCallback(async ({ email, otp }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setToken(data.token);
      setOnboardingData((prev) => ({ ...prev, tempToken: data.token }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Invalid OTP' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Complete profile setup ───────────────────────────────────────────────
  const setupProfile = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem('padosi_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Profile setup failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, otp }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, otp });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('padosi_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    setToken(null);
    setUser(null);
    setOnboardingData({});
    localStorage.removeItem('padosi_token');
    localStorage.removeItem('padosi_user');
  }, []);

  // ─── Refresh user from server ─────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/users/me');
      setUser(data.user);
      localStorage.setItem('padosi_user', JSON.stringify(data.user));
    } catch (_) {}
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    onboardingData,
    setOnboardingData,
    startSignup,
    verifyOtp,
    setupProfile,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
