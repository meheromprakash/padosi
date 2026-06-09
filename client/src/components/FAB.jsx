import { Plus } from 'lucide-react';

export default function FAB({ onClick, icon: Icon = Plus, label = 'New Post' }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3.5 
                 bg-gradient-padosi text-white rounded-2xl shadow-float
                 hover:shadow-glow hover:scale-105 active:scale-95
                 transition-all duration-200 font-semibold text-sm"
    >
      <Icon size={18} strokeWidth={2.5} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
