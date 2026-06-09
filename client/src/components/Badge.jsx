const VARIANTS = {
  green: 'bg-primary-100 text-primary-700 border-primary-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function Badge({ children, variant = 'green', dot = false, className = '' }) {
  return (
    <span className={`badge border ${VARIANTS[variant] || VARIANTS.green} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
}
