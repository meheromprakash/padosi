import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import ListingCard from '../components/ListingCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { useListings } from '../hooks/useListings';

const CATEGORIES = [
  { label: 'All', value: 'all', icon: 'grid_view' },
  { label: 'Electronics', value: 'electronics', icon: 'devices' },
  { label: 'Clothes', value: 'clothing', icon: 'apparel' },
  { label: 'Furniture', value: 'furniture', icon: 'chair' },
  { label: 'Books', value: 'books', icon: 'book' },
  { label: 'Free Items', value: 'free', icon: 'volunteer_activism' },
];

export default function Marketplace() {
  const { listings: apiListings, loading, error, createListing, refresh } = useListings();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', isFree: false, category: 'other', condition: 'good' });
  const [submitting, setSubmitting] = useState(false);

  // Fallback mock listings if API empty
  const MOCK_LISTINGS = [
    { 
      _id: 'mock-1', 
      title: 'Sony Bluetooth Speaker', 
      description: 'Used for 6 months. Great sound quality and battery life.', 
      price: 1200, 
      isFree: false, 
      condition: 'like_new', 
      category: 'electronics', 
      locality: { name: 'Greenwood Estates' }, 
      seller: { firstName: 'Raj', verification: { verified: true } } 
    },
    { 
      _id: 'mock-2', 
      title: 'Study Table + Ergonomic Chair', 
      description: 'Solid wooden study table with adjustable office chair. Moving out sale.', 
      price: 2500, 
      isFree: false, 
      condition: 'good', 
      category: 'furniture', 
      locality: { name: 'Greenwood Estates' }, 
      seller: { firstName: 'Priya', verification: { verified: true } } 
    }
  ];

  const listings = apiListings.length > 0 ? apiListings : MOCK_LISTINGS;
  let filtered = category === 'free' ? listings.filter((l) => l.isFree) : category === 'all' ? listings : listings.filter((l) => l.category === category);
  if (search) filtered = filtered.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    await createListing(fd);
    setSubmitting(false);
    setShowCreate(false);
    setForm({ title: '', description: '', price: '', isFree: false, category: 'other', condition: 'good' });
  };

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        {/* Title and Action bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Marketplace</h1>
            <p className="font-label-sm text-label-sm text-outline mt-0.5">Buy &amp; sell within your colony</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-primary/10"
            id="create-listing-btn"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>List Item</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-surface-container border-none rounded-full py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-container transition-all font-body-sm text-body-sm text-on-surface" 
            placeholder="Search products, furniture, or books..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                category === c.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {loading && <LoadingSkeleton type="listing" count={4} />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title="No listings found"
            description="Be the first to list something!"
            action={{ label: '+ Add Listing', onClick: () => setShowCreate(true) }}
          />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="List Something"
        footer={
          <button
            onClick={handleCreate}
            disabled={submitting || !form.title}
            className="bg-primary text-on-primary font-bold px-6 py-3.5 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all w-full flex items-center justify-center gap-1.5"
          >
            {submitting ? 'Listing...' : 'Post Listing'}
            <span className="material-symbols-outlined">send</span>
          </button>
        }
      >
        <div className="space-y-4 text-on-surface">
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What are you selling?"
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface"
            />
          </div>
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describe the item condition, pickup details..."
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all resize-none text-on-surface"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-unit">
              <label className="text-xs font-bold text-on-surface-variant">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                disabled={form.isFree}
                className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 text-on-surface"
              />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="isFree"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked, price: '' })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isFree" className="text-sm font-semibold text-on-surface-variant">Free</label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-unit">
              <label className="text-xs font-bold text-on-surface-variant">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface"
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            <div className="space-y-unit">
              <label className="text-xs font-bold text-on-surface-variant">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface"
              >
                {['electronics', 'furniture', 'clothing', 'books', 'vehicles', 'other'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
