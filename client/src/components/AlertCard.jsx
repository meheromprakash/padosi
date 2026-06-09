import { formatDistanceToNow } from '../utils/dateUtils';

const CONFIG = {
  critical: {
    bg: 'bg-error-container border-error/20',
    text: 'text-on-error-container',
    iconBg: 'bg-error text-white',
    icon: 'warning',
    label: 'Critical Alert',
  },
  high: {
    bg: 'bg-error-container border-error/20',
    text: 'text-on-error-container',
    iconBg: 'bg-error text-white',
    icon: 'warning',
    label: 'High Alert',
  },
  medium: {
    bg: 'bg-surface-container-lowest border-outline-variant/30',
    text: 'text-on-surface',
    iconBg: 'bg-primary-container text-white',
    icon: 'info',
    label: 'Utility Alert',
  },
  low: {
    bg: 'bg-surface-container-lowest border-outline-variant/30',
    text: 'text-on-surface',
    iconBg: 'bg-[#F3F5F4] text-on-surface-variant',
    icon: 'notifications',
    label: 'Community Update',
  },
};

export default function AlertCard({ alert }) {
  const conf = CONFIG[alert.severity] || CONFIG.medium;
  const timeAgo = formatDistanceToNow(alert.createdAt);

  return (
    <div className={`border rounded-2xl p-stack-lg shadow-[0px_4px_12px_rgba(31,41,55,0.04)] hover:shadow-[0px_8px_24px_rgba(31,41,55,0.08)] transition-all ${conf.bg}`}>
      <div className="flex justify-between items-start mb-stack-md">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${conf.iconBg}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{conf.icon}</span>
          </div>
          <div>
            <h3 className={`font-headline-sm text-headline-sm font-bold ${conf.text}`}>{alert.title}</h3>
            <p className={`font-label-sm text-label-sm opacity-70 ${conf.text}`}>{conf.label} • {timeAgo}</p>
          </div>
        </div>
        {alert.isOfficial && (
          <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
            Official
          </span>
        )}
      </div>

      <p className={`font-body-md mb-stack-md leading-relaxed ${conf.text}`}>
        {alert.description}
      </p>

      <div className="flex gap-2">
        <button className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-label-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all text-xs">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Acknowledged ({alert.notifiedCount || 0})
        </button>
      </div>
    </div>
  );
}
