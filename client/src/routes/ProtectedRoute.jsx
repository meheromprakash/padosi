import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-padosi rounded-2xl flex items-center justify-center animate-bounce-soft">
            <span className="text-2xl">🏘️</span>
          </div>
          <p className="text-sm text-gray-500 animate-pulse-soft">Loading Padosi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
