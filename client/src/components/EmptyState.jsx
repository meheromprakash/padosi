export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mb-4 border border-primary-100">
          <Icon size={28} className="text-primary-400" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-4 max-w-xs">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary text-sm py-2">
          {action.label}
        </button>
      )}
    </div>
  );
}
