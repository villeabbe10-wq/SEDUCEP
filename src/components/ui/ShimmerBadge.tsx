import React from 'react';

interface ShimmerBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'orange' | 'indigo' | 'slate';
  className?: string;
  pulse?: boolean;
}

export default function ShimmerBadge({
  children,
  icon,
  variant = 'emerald',
  className = '',
  pulse = true
}: ShimmerBadgeProps) {
  const variants = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-sm',
      dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
    },
    cyan: {
      bg: 'bg-cyan-50 text-cyan-800 border-cyan-200/90 shadow-sm',
      dot: 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
    },
    orange: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200/90 shadow-sm',
      dot: 'bg-orange-500 shadow-[0_0_8px_#f97316]'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/90 shadow-sm',
      dot: 'bg-indigo-500 shadow-[0_0_8px_#6366f1]'
    },
    slate: {
      bg: 'bg-slate-100 text-slate-800 border-slate-200/90 shadow-sm',
      dot: 'bg-slate-500 shadow-[0_0_8px_#64748b]'
    }
  }[variant];

  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] border backdrop-blur-md ${variants.bg} ${className}`}>
      {pulse && <span className={`w-1.5 h-1.5 rounded-full ${variants.dot} animate-pulse`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
