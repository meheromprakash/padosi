import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/alerts');
      setAlerts(data.alerts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (alertData) => {
    try {
      const { data } = await api.post('/alerts', alertData);
      setAlerts((prev) => [data.alert, ...prev]);
      return { success: true, alert: data.alert };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create alert' };
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, []);

  return { alerts, loading, error, fetchAlerts, createAlert };
}
