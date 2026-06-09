const CONDITION_LABELS = {
  new: { label: 'New', class: 'bg-green-50 text-green-700 border border-green-100' },
  like_new: { label: 'Like New', class: 'bg-blue-50 text-blue-700 border border-blue-100' },
  good: { label: 'Good', class: 'bg-surface-container text-gray-700' },
  fair: { label: 'Fair', class: 'bg-amber-50 text-amber-700 border border-amber-100' },
};

export default function ListingCard({ listing, onClick }) {
  const cond = CONDITION_LABELS[listing.condition] || CONDITION_LABELS.good;
  const sellerInitials = (listing.seller?.firstName || 'N').charAt(0).toUpperCase();

  return (
    <article
      onClick={onClick}
      className="bg-surface-container-lowest rounded-2xl overflow-hidden cursor-pointer group hover:shadow-[0px_8px_24px_rgba(31,41,55,0.08)] hover:scale-[1.01] transition-all duration-300 border border-outline-variant/10 flex flex-col justify-between"
      aria-label={`Listing: ${listing.title}`}
    >
      <div>
        {/* Image Container */}
        <div className="relative h-44 bg-[#F3F5F4] overflow-hidden">
          {listing.images?.[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[48px]">storefront</span>
            </div>
          )}

          {listing.isFree && (
            <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              FREE
            </div>
          )}

          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-gray-800 font-bold px-4 py-1.5 rounded-full text-xs shadow-md">SOLD</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-sm leading-tight line-clamp-2 flex-1 text-on-surface">
              {listing.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider flex-shrink-0 ${cond.class}`}>
              {cond.label}
            </span>
          </div>

          <p className="text-on-surface-variant text-xs line-clamp-2 mb-3 leading-relaxed">{listing.description}</p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <span className="font-extrabold text-primary text-base">
            {listing.isFree ? (
              <span className="text-secondary font-bold">Free</span>
            ) : (
              `₹${listing.price?.toLocaleString('en-IN')}`
            )}
          </span>

          <div className="flex items-center gap-1 text-[10px] text-outline font-semibold">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span className="truncate max-w-[80px]">{listing.locality?.name || 'Gotri'}</span>
          </div>
        </div>

        {listing.seller && (
          <div className="flex items-center gap-1.5 pt-3 border-t border-outline-variant/10">
            <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {sellerInitials}
            </div>
            <span className="text-xs text-on-surface-variant font-medium truncate flex-1">{listing.seller?.firstName || 'Neighbor'}</span>
            {listing.seller?.verification?.verified && (
              <span className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
