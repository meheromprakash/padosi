import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/feed',      icon: 'home',          label: 'Home' },
  { to: '/alerts',    icon: 'notifications', label: 'Alerts' },
  { to: '/market',    icon: 'storefront',    label: 'Market' },
  { to: '/directory', icon: 'groups',        label: 'Directory' },
  { to: '/messages',  icon: 'chat',          label: 'Messages' },
  { to: '/profile',   icon: 'person',        label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayLocality = user?.localityId?.name || 'Gotri';
  const displayCity = user?.city || 'Vadodara';
  const displayColony = user?.address || 'Greenwood Estates';
  const initials = (user?.firstName || 'U').charAt(0).toUpperCase();

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 overflow-y-auto bg-surface-container-low dark:bg-surface-container-lowest shadow-[4px_0px_12px_rgba(31,41,55,0.05)] border-r border-outline-variant/30 flex flex-col justify-between px-margin-mobile py-stack-lg z-50">
      <div className="flex flex-col gap-stack-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-stack-lg">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>nearby</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Padosi</span>
            <span className="font-label-sm text-label-sm text-outline truncate max-w-[140px]">{displayColony}</span>
          </div>
        </div>

        {/* Locality Selector */}
        <button className="flex items-center justify-between bg-surface-container-high rounded-xl px-4 py-3 hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <div className="text-left">
              <p className="font-label-md text-label-md font-bold text-on-surface">{displayLocality}, {displayCity}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Current Locality</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">expand_more</span>
        </button>

        {/* Navigation Links */}
        <nav className="mt-stack-md flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                isActive 
                  ? "bg-primary-container text-on-primary-container rounded-xl font-bold px-4 py-3 flex items-center gap-3 transition-all duration-150 active:scale-95"
                  : "text-on-surface-variant hover:bg-surface-container-highest rounded-xl px-4 py-3 flex items-center gap-3 transition-colors"
              }
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer / Sign Out */}
      <div className="pt-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-on-surface">
              {user?.firstName || 'Neighbor'}
            </p>
            <p className="text-[11px] truncate text-outline">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-semibold text-outline hover:text-primary transition-colors py-2 px-1 w-full text-left"
          id="sidebar-logout-btn"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
