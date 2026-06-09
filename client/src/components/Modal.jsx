import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center modal-backdrop"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`modal-content w-full ${sizeClasses[size]} bg-white rounded-t-3xl sm:rounded-3xl shadow-float max-h-[90dvh] flex flex-col`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="font-bold text-gray-900 text-base">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
