import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data.comments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content) => {
    if (!content.trim()) return { success: false, error: 'Content is required' };
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content });
      setComments((prev) => [...prev, data.comment]);
      return { success: true, comment: data.comment };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add comment' };
    }
  }, [postId]);

  const deleteComment = useCallback(async (commentId) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete comment' };
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refreshComments: fetchComments,
  };
}
