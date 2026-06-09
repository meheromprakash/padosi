import { useState } from 'react';
import { Building2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import BusinessCard from '../components/BusinessCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useBusinesses } from '../hooks/useBusinesses';

const CATS = [
  { label: 'All Services', value: 'all', icon: 'grid_view' },
  { label: 'Plumber', value: 'plumber', icon: 'handyman' },
  { label: 'Electrician', value: 'electrician', icon: 'electric_bolt' },
  { label: 'Doctor', value: 'doctor', icon: 'medical_services' },
  { label: 'Food & Meals', value: 'restaurant', icon: 'restaurant' },
  { label: 'Pharmacy', value: 'pharmacy', icon: 'local_pharmacy' },
  { label: 'Salon', value: 'salon', icon: 'content_cut' },
  { label: 'Tutors', value: 'tutor', icon: 'school' },
];

export default function Directory() {
  const { businesses: apiBusinesses, loading, error, refresh } = useBusinesses();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  // Fallback mock businesses if API empty
  const MOCK_BUSINESSES = [
    { 
      _id: 'mock-1', 
      name: 'Ravi Plumbing Services', 
      category: 'plumber', 
      locality: { name: 'Greenwood Estates' }, 
      rating: 4.7, 
      reviewCount: 23, 
      isVerified: true, 
      contact: '9876543210', 
      whatsapp: '9876543210' 
    },
    { 
      _id: 'mock-2', 
      name: 'Sharma Electricals & Inverters', 
      category: 'electrician', 
      locality: { name: 'Greenwood Estates' }, 
      rating: 4.5, 
      reviewCount: 17, 
      isVerified: true, 
      contact: '9876543211', 
      whatsapp: '9876543211' 
    }
  ];

  const businesses = apiBusinesses.length > 0 ? apiBusinesses : MOCK_BUSINESSES;
  let filtered = cat === 'all' ? businesses : businesses.filter((b) => b.category === cat);
  if (search) filtered = filtered.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        {/* Header Title */}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Local Directory</h1>
          <p className="font-label-sm text-label-sm text-outline mt-0.5">Trusted local service providers recommended by your neighbors</p>
        </div>

        {/* Search bar */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-surface-container border-none rounded-full py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-container transition-all font-body-sm text-body-sm text-on-surface" 
            placeholder="Search plumbers, electricians, clinics..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {CATS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                cat === c.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Businesses List */}
        {loading && <LoadingSkeleton type="business" count={4} />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        
        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={Building2} title="No businesses found" description="Know a good service? Recommend them to your colony!" />
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {filtered.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
