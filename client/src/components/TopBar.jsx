import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.firstName || 'U').charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex h-16 fixed top-0 right-0 z-40 bg-surface/80 backdrop-blur-md justify-between items-center w-full px-margin-desktop ml-72 max-w-[calc(100%-288px)] border-b border-outline-variant/10">
        <div className="flex-1 max-w-2xl relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all font-body-sm text-body-sm text-on-surface" 
            placeholder="Search neighbors, services, or alerts..." 
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
            }}
          />
        </div>
        <div className="flex items-center gap-stack-md ml-stack-md">
          <button 
            onClick={() => navigate('/alerts')}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border-2 border-primary-container cursor-pointer flex items-center justify-center font-bold text-primary"
          >
            {user?.avatar ? (
              <img alt="User profile" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              initials
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex md:hidden sticky top-0 z-40 bg-surface/90 backdrop-blur-md h-16 justify-between items-center w-full px-margin-mobile border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-white text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">nearby</span>
          </div>
          <span className="font-headline-md text-headline-sm font-bold text-primary">Padosi</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/search')}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-full"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <button 
            onClick={() => navigate('/alerts')}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-full"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-primary flex items-center justify-center font-bold text-primary text-xs"
          >
            {user?.avatar ? (
              <img alt="User profile" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              initials
            )}
          </div>
        </div>
      </header>
    </>
  );
}
