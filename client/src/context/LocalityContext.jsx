import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const LocalityContext = createContext(null);

export function LocalityProvider({ children }) {
  const [locality, setLocality] = useState(null);
  const [nearbyLocalities, setNearbyLocalities] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocalities = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const { data } = await api.get(`/localities/search?q=${encodeURIComponent(query)}`);
      return data.localities || [];
    } catch {
      return [];
    }
  }, []);

  const fetchLocality = useCallback(async (localityId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/localities/${localityId}`);
      setLocality(data.locality);
    } catch (_) {} finally {
      setLoading(false);
    }
  }, []);

  const value = {
    locality,
    setLocality,
    nearbyLocalities,
    loading,
    searchLocalities,
    fetchLocality,
  };

  return <LocalityContext.Provider value={value}>{children}</LocalityContext.Provider>;
}

export function useLocality() {
  const ctx = useContext(LocalityContext);
  if (!ctx) throw new Error('useLocality must be used inside LocalityProvider');
  return ctx;
}

export default LocalityContext;
