import { ShieldCheck } from 'lucide-react';

export default function VerifiedShield({ size = 'sm', label = 'Verified Neighbor' }) {
  const sizes = {
    xs: { icon: 10, text: 'text-[10px]', pad: 'px-1.5 py-0.5 gap-0.5' },
    sm: { icon: 12, text: 'text-xs',   pad: 'px-2 py-1 gap-1' },
    md: { icon: 14, text: 'text-sm',   pad: 'px-2.5 py-1.5 gap-1.5' },
  };
  const sz = sizes[size] || sizes.sm;

  return (
    <span className={`trust-badge ${sz.pad} ${sz.text}`}>
      <ShieldCheck size={sz.icon} />
      {label}
    </span>
  );
}
