import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchListings = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const p = reset ? 1 : page;
      const { data } = await api.get('/listings', { params: { page: p, limit: 12, ...filters } });
      setListings((prev) => reset ? data.listings : [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      if (!reset) setPage((p) => p + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [page, JSON.stringify(filters)]);

  const createListing = useCallback(async (formData) => {
    try {
      const { data } = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setListings((prev) => [data.listing, ...prev]);
      return { success: true, listing: data.listing };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  const updateListing = useCallback(async (id, updates) => {
    try {
      const { data } = await api.put(`/listings/${id}`, updates);
      setListings((prev) => prev.map((l) => l._id === id ? data.listing : l));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  const deleteListing = useCallback(async (id) => {
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  useEffect(() => { fetchListings(true); }, [JSON.stringify(filters)]);

  return {
    listings, loading, error, hasMore,
    fetchListings, createListing, updateListing, deleteListing,
    refresh: () => fetchListings(true),
  };
}
