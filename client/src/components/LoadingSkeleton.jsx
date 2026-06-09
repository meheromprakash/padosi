export function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-32 rounded" />
                <div className="skeleton h-2 w-20 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-4/5 rounded" />
              <div className="skeleton h-3 w-3/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'listing') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton h-44 w-full" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'business') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-4 flex items-start gap-3">
            <div className="skeleton w-12 h-12 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-36 rounded" />
              <div className="skeleton h-2 w-24 rounded" />
              <div className="skeleton h-2 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="skeleton h-32 w-full rounded-2xl" />;
}
