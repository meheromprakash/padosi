import { NavLink } from 'react-router-dom';
import { Home, Bell, ShoppingBag, Building2, MessageCircle, User } from 'lucide-react';

const ITEMS = [
  { to: '/feed',      icon: Home,          label: 'Home' },
  { to: '/alerts',    icon: Bell,          label: 'Alerts' },
  { to: '/market',    icon: ShoppingBag,   label: 'Market' },
  { to: '/directory', icon: Building2,     label: 'Directory' },
  { to: '/messages',  icon: MessageCircle, label: 'Messages' },
  { to: '/profile',   icon: User,          label: 'Profile' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} strokeWidth={isActive => isActive ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
