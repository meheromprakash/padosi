export default function FilterChips({ chips, active, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 ${className}`}>
      {chips.map((chip) => (
        <button
          key={chip.value || chip}
          onClick={() => onChange(chip.value || chip)}
          className={`chip flex-shrink-0 ${(active === (chip.value || chip)) ? 'active' : ''}`}
          aria-pressed={active === (chip.value || chip)}
        >
          {chip.icon && <span>{chip.icon}</span>}
          {chip.label || chip}
        </button>
      ))}
    </div>
  );
}
