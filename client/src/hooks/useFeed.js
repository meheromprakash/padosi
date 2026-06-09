import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useFeed(localityId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchFeed = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const p = reset ? 1 : page;
      const { data } = await api.get('/feed', { params: { page: p, limit: 10 } });
      setPosts((prev) => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      if (!reset) setPage((p) => p + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const createPost = useCallback(async (formData) => {
    try {
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts((prev) => [data.post, ...prev]);
      return { success: true, post: data.post };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to post' };
    }
  }, []);

  const reactToPost = useCallback(async (postId, reaction) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, reactions: { ...p.reactions, [reaction]: (p.reactions?.[reaction] || 0) + 1 } }
          : p
      )
    );
    try {
      await api.post(`/posts/${postId}/react`, { reaction });
    } catch {
      // Revert on failure
      fetchFeed(true);
    }
  }, [fetchFeed]);

  const deletePost = useCallback(async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  useEffect(() => { fetchFeed(true); }, []);

  return {
    posts, loading, error, hasMore,
    fetchFeed, createPost, reactToPost, deletePost,
    refresh: () => fetchFeed(true),
  };
}
