import { NavLink } from 'react-router-dom';
import { Home, Bell, ShoppingBag, Building2, MessageSquare } from 'lucide-react';

const navItems = [
  { to: '/feed',     icon: Home,          label: 'Home' },
  { to: '/alerts',   icon: Bell,          label: 'Alerts' },
  { to: '/market',   icon: ShoppingBag,   label: 'Market' },
  { to: '/directory',icon: Building2,     label: 'Directory' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/60 shadow-float safe-bottom">
      <div className="max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-around py-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `bottom-nav-item min-w-[56px] ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                  <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
