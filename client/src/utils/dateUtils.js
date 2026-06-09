/**
 * Lightweight date utility (no moment.js dependency)
 */

export function formatDistanceToNow(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', ...opts
  }).format(new Date(dateStr));
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(new Date(dateStr));
}
