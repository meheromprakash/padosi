import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import { formatDistanceToNow } from '../utils/dateUtils';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';

export default function Notifications() {
  const navigate = useNavigate();
  const { on } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications via socket to update list
  useEffect(() => {
    const cleanup = on('notification', (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });
    return cleanup;
  }, [on]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markRead(notif._id);
    }
    // Redirect based on entity
    if (notif.entityType === 'Post') {
      navigate('/feed');
    } else if (notif.entityType === 'Message') {
      navigate(`/messages/${notif.senderId}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>recommend</span>;
      case 'comment':
        return <span className="material-symbols-outlined text-secondary">chat_bubble</span>;
      case 'alert':
        return <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>;
      default:
        return <span className="material-symbols-outlined text-outline">notifications</span>;
    }
  };

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Notifications</h1>
            <p className="font-label-sm text-label-sm text-outline mt-0.5">Stay updated on neighborhood activity</p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(31,41,55,0.05)] divide-y divide-outline-variant/10">
          {loading && notifications.length === 0 && (
            <div className="text-center py-12 text-outline text-sm">Loading notifications...</div>
          )}

          {!loading && error && (
            <div className="text-center py-12 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">notifications_off</span>
              </div>
              <h3 className="font-bold text-sm text-on-surface">All caught up!</h3>
              <p className="text-xs text-outline mt-1">No new notifications at this time.</p>
            </div>
          )}

          {notifications.map((notif) => {
            const senderName = notif.sender?.firstName || 'A neighbor';
            return (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-4 p-5 items-start hover:bg-[#F3F5F4]/30 transition-colors cursor-pointer relative ${
                  !notif.isRead ? 'bg-primary/[0.02]' : ''
                }`}
              >
                {/* Active indicator bar */}
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}

                {/* Notification Icon */}
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-on-surface leading-relaxed ${!notif.isRead ? 'font-bold' : ''}`}>
                    {notif.content}
                  </p>
                  <p className="text-xs text-outline mt-1 font-medium">
                    {formatDistanceToNow(notif.createdAt)}
                  </p>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(notif._id);
                    }}
                    className="p-1 text-outline hover:text-primary transition-colors shrink-0"
                    title="Mark as read"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
