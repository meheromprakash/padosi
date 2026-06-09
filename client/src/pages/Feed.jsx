import { useState } from 'react';
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
  const { posts: apiPosts, loading, error, createPost, reactToPost, deletePost, refresh } = useFeed();
  const [filter, setFilter] = useState('all');
  const [showComposer, setShowComposer] = useState(false);

  // Fallback mock posts if api empty
  const MOCK_POSTS = [
    {
      _id: 'mock-1',
      author: { firstName: 'Rohit Sharma', verification: { verified: true }, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQoCKFKjhzAyW5H7ZiWe3KclzB7weKTvXwCHUtQ8rIho4PPnTNN883C6gEIUwDkWPVhSRmwrFYfR1LLvC5gTmYvc5TgFjzrisDN-alelp--sJZjKuv6XlfjtNvQoGdHgF6pGCGsfN57IyDDT8JLBIgv6uE_LjYGvFKXBW6UZKpOswXHEib-7sJSYf_8tNhYLCXlLUjYV9ETxu0S5aLXyO5wAoHS17gelvVZwBSdrsCX8tzd8LREC-vjI87k985ylwoz-oxG51r_UY' },
      locality: { name: 'Greenwood Estates' },
      content: `Hi neighbors! Does anyone have a reliable plumber they could recommend for some leak repairs in C-block? Looking for someone who can visit by tomorrow morning. Thanks in advance!`,
      category: 'recommendation',
      reactions: { like: 12 },
      commentsCount: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: 'mock-2',
      author: { firstName: 'Society Guard', verification: { verified: true } },
      locality: { name: 'Greenwood Estates' },
      content: `A motorcycle theft was reported near D-block parking today around 4:00 PM. Neighbors are advised to double-check their security cameras and ensure vehicles are locked. Police have been notified.`,
      category: 'alert',
      reactions: { like: 8 },
      commentsCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    }
  ];

  const posts = apiPosts.length > 0 ? apiPosts : MOCK_POSTS;
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

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
        {loading && <LoadingSkeleton type="card" count={3} />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Newspaper}
            title="Nothing here yet"
            description="Be the first to post something in your colony!"
            action={{ label: 'Create Post', onClick: () => setShowComposer(true) }}
          />
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-6">
            {filtered.map((post) => (
              <FeedCard
                key={post._id}
                post={post}
                onReact={(id, r) => reactToPost(id, r)}
                onDelete={(id) => deletePost(id)}
              />
            ))}
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
