import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../api/axios';

export function useFeed(category = 'all') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const pageRef = useRef(1);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchFeed = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const nextPage = reset ? 1 : pageRef.current;
      const params = { page: nextPage, limit: 10 };
      if (category && category !== 'all') {
        params.category = category;
      }
      const { data } = await api.get('/feed', { params });
      
      setPosts((prev) => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(reset ? 2 : nextPage + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [category]);

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
    try {
      const { data } = await api.post(`/posts/${postId}/react`, { reaction });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, reactions: data.reactions, userReaction: data.userReaction }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to react to post:', err);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  const toggleBookmark = useCallback(async (postId, isCurrentlyBookmarked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, userBookmarked: !isCurrentlyBookmarked } : p
      )
    );
    try {
      if (isCurrentlyBookmarked) {
        await api.delete(`/bookmarks/${postId}`);
      } else {
        await api.post(`/bookmarks/${postId}`);
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, userBookmarked: isCurrentlyBookmarked } : p
        )
      );
    }
  }, []);

  const updatePost = useCallback(async (postId, updates) => {
    try {
      const { data } = await api.put(`/posts/${postId}`, updates);
      setPosts((prev) => prev.map((p) => p._id === postId ? data.post : p));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  useEffect(() => {
    fetchFeed(true);
  }, [category, fetchFeed]);

  return {
    posts, loading, error, hasMore,
    fetchFeed, createPost, reactToPost, deletePost, toggleBookmark, updatePost,
    refresh: () => fetchFeed(true),
  };
}

