import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import TopBar from '../components/TopBar';
import FeedCard from '../components/FeedCard';
import PostComposer from '../components/PostComposer';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import AppLayout from '../components/AppLayout';
import { useFeed } from '../hooks/useFeed';

const FILTER_CHIPS = [
  { label: 'All', value: 'all', icon: 'grid_view' },
  { label: 'Alerts', value: 'alert', icon: 'warning' },
  { label: 'Events', value: 'event', icon: 'event' },
  { label: 'For Sale', value: 'listing', icon: 'storefront' },
  { label: 'Help', value: 'help', icon: 'campaign' },
  { label: 'Recommend', value: 'recommendation', icon: 'recommend' },
];

export default function Feed() {
  const [filter, setFilter] = useState('all');
  const { posts, loading, error, hasMore, fetchFeed, createPost, reactToPost, deletePost, toggleBookmark, updatePost, refresh } = useFeed(filter);
  const [showComposer, setShowComposer] = useState(false);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const threshold = 150; // px from bottom
      const totalHeight = document.documentElement.scrollHeight;
      const scrolled = window.innerHeight + window.scrollY;
      if (totalHeight - scrolled < threshold) {
        fetchFeed(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchFeed]);

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        {/* Quick Post Composer Trigger */}
        <div className="bg-surface-container-lowest rounded-2xl p-stack-lg shadow-[0px_4px_12px_rgba(31,41,55,0.05)] border border-outline-variant/10">
          <div className="flex gap-stack-md items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined">person</span>
            </div>
            <button
              onClick={() => setShowComposer(true)}
              className="flex-1 bg-surface-container hover:bg-surface-container-high rounded-xl p-4 text-left transition-all text-outline text-sm"
              id="quick-post-btn"
            >
              What's happening in your colony?
            </button>
            <button 
              onClick={() => setShowComposer(true)}
              className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Filter chips bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {FILTER_CHIPS.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === c.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Feed Posts */}
        {loading && posts.length === 0 && <LoadingSkeleton type="card" count={3} />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            icon={Newspaper}
            title="Nothing here yet"
            description="Be the first to post something in your colony!"
            action={{ label: 'Create Post', onClick: () => setShowComposer(true) }}
          />
        )}

        {posts.length > 0 && (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <FeedCard
                key={post._id}
                post={post}
                onReact={(id, r) => reactToPost(id, r)}
                onBookmark={(id, isBookmarked) => toggleBookmark(id, isBookmarked)}
                onUpdate={(id, updates) => updatePost(id, updates)}
                onDelete={(id) => deletePost(id)}
              />
            ))}
          </div>
        )}

        {loading && posts.length > 0 && (
          <div className="text-center py-4 text-outline text-sm">
            Loading more posts...
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile Only / Responsive Check) */}
      <button 
        onClick={() => setShowComposer(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center z-50 transition-transform active:scale-90"
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Composer modal */}
      <Modal isOpen={showComposer} onClose={() => setShowComposer(false)} title="Share with Neighbors">
        <PostComposer onSubmit={createPost} onClose={() => setShowComposer(false)} />
      </Modal>
    </AppLayout>
  );
}

