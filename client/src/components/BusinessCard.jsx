const CATEGORY_ICONS = {
  plumber: 'handyman',
  electrician: 'electric_bolt',
  carpenter: 'carpenter',
  doctor: 'medical_services',
  restaurant: 'restaurant',
  grocery: 'local_grocery_store',
  pharmacy: 'local_pharmacy',
  salon: 'content_cut',
  gym: 'fitness_center',
  tutor: 'school',
  default: 'domain',
};

export default function BusinessCard({ business, onClick }) {
  const iconName = CATEGORY_ICONS[business.category?.toLowerCase()] || CATEGORY_ICONS.default;

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (business.whatsapp) {
      window.open(`https://wa.me/${business.whatsapp}`, '_blank');
    }
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (business.contact) {
      window.location.href = `tel:${business.contact}`;
    }
  };

  return (
    <article
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 cursor-pointer group hover:shadow-[0px_8px_24px_rgba(31,41,55,0.08)] hover:scale-[1.01] transition-all duration-300 flex items-start gap-4"
      aria-label={`Business: ${business.name}`}
    >
      {/* Icon Container */}
      <div className="w-12 h-12 rounded-2xl bg-[#F3F5F4] flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        <span className="material-symbols-outlined text-[24px]">{iconName}</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Name + Verified */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-bold text-sm truncate text-on-surface">{business.name}</h3>
          {business.isVerified && (
            <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          )}
        </div>

        {/* Category + Locality */}
        <div className="flex items-center gap-2 text-xs text-outline mb-2">
          <span className="capitalize font-semibold">{business.category}</span>
          {business.locality && (
            <>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                <span className="truncate">{business.locality?.name}</span>
              </span>
            </>
          )}
        </div>

        {/* Rating stars */}
        {business.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <span 
                key={s} 
                className="material-symbols-outlined text-[14px]"
                style={{ 
                  fontVariationSettings: s <= Math.round(business.rating) ? "'FILL' 1" : "'FILL' 0",
                  color: s <= Math.round(business.rating) ? 'var(--primary)' : '#d1d5db'
                }}
              >
                star
              </span>
            ))}
            <span className="text-[11px] text-outline font-semibold ml-1.5">
              {business.rating.toFixed(1)} ({business.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/10 mt-3">
          {business.contact && (
            <button
              onClick={handleCall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">phone</span>
              <span>Call</span>
            </button>
          )}
          {business.whatsapp && (
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F4EA] text-[#137333] rounded-xl text-xs font-semibold hover:bg-[#D2EBD4] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
