import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import FeedCard from '../components/FeedCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../api/axios';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) {
      setPosts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/feed?q=${encodeURIComponent(query)}`);
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute search');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSearchResults();
    setSearchInput(query);
  }, [query, fetchSearchResults]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchInput.trim() });
  };

  const handleReact = async (postId, reaction) => {
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
  };

  const handleBookmark = async (postId, isCurrentlyBookmarked) => {
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
  };

  const handleUpdate = async (postId, updates) => {
    try {
      const { data } = await api.put(`/posts/${postId}`, updates);
      setPosts((prev) => prev.map((p) => p._id === postId ? data.post : p));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Search</h1>
          <p className="font-label-sm text-label-sm text-outline mt-0.5">Find posts, alerts, and items in your colony</p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all font-body-sm text-body-sm text-on-surface"
          />
        </form>

        {/* Results section */}
        <div className="flex flex-col gap-6">
          {loading && <LoadingSkeleton type="card" count={2} />}

          {!loading && error && (
            <div className="text-center py-8 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && !query && (
            <div className="text-center py-12 text-outline text-sm">
              Type a word or phrase in the search box above to start searching.
            </div>
          )}

          {!loading && !error && query && posts.length === 0 && (
            <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6">
              <span className="material-symbols-outlined text-outline text-4xl mb-2">search_off</span>
              <p className="text-sm font-bold text-on-surface">No results found</p>
              <p className="text-xs text-outline mt-1">We couldn't find any posts matching "{query}". Try checking your spelling or using different keywords.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <p className="text-xs font-bold text-outline uppercase tracking-wider">Search Results ({posts.length})</p>
              {posts.map((post) => (
                <FeedCard
                  key={post._id}
                  post={post}
                  onReact={handleReact}
                  onBookmark={handleBookmark}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
