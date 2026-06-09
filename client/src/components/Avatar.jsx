import { ShieldCheck } from 'lucide-react';

const SIZE_MAP = {
  xs:  { outer: 'w-7 h-7',  text: 'text-xs',  badge: 'w-3 h-3', icon: 8  },
  sm:  { outer: 'w-8 h-8',  text: 'text-sm',  badge: 'w-3.5 h-3.5', icon: 9  },
  md:  { outer: 'w-10 h-10', text: 'text-sm', badge: 'w-4 h-4',  icon: 10 },
  lg:  { outer: 'w-14 h-14', text: 'text-lg', badge: 'w-5 h-5',  icon: 12 },
  xl:  { outer: 'w-20 h-20', text: 'text-2xl', badge: 'w-6 h-6', icon: 14 },
};

const GRADIENT_COLORS = [
  'from-primary-400 to-sage',
  'from-blue-400 to-cyan-500',
  'from-purple-400 to-pink-500',
  'from-orange-400 to-yellow-500',
];

export default function Avatar({ src, name = 'P', size = 'md', verified = false, className = '' }) {
  const sz = SIZE_MAP[size] || SIZE_MAP.md;
  const colorIdx = (name?.charCodeAt(0) || 0) % GRADIENT_COLORS.length;
  const gradient = GRADIENT_COLORS[colorIdx];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sz.outer} rounded-full overflow-hidden ring-2 ring-white shadow-sm`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className={`font-bold text-white ${sz.text}`}>
              {name?.[0]?.toUpperCase() || 'P'}
            </span>
          </div>
        )}
      </div>

      {verified && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${sz.badge} bg-primary-500 rounded-full flex items-center justify-center ring-1.5 ring-white`}>
          <ShieldCheck size={sz.icon} className="text-white" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}
