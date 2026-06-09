import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useBusinesses(filters = {}) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/businesses', { params: filters });
      setBusinesses(data.businesses);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchBusinesses(); }, [JSON.stringify(filters)]);

  return { businesses, loading, error, refresh: fetchBusinesses };
}
