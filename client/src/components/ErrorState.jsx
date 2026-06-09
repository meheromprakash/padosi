import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">Oops!</p>
      <p className="text-xs text-gray-400 mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-sm gap-1.5">
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
