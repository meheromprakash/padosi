import { Search as SearchIcon, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10 text-sm"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
