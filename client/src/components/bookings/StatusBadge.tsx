import type { BookingStatus } from '../../types/index';
import { cn } from '../../lib/utils';

const statusConfig: Record<
  BookingStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
    hasPing?: boolean;
  }
> = {
  pending: {
    label: 'Pending',
    bgClass: 'bg-amber-500/12 dark:bg-amber-500/20',
    textClass: 'text-amber-800 dark:text-amber-300 font-semibold',
    borderClass: 'border-amber-500/35 dark:border-amber-500/40',
    dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
    hasPing: false,
  },
  assigned: {
    label: 'Assigned',
    bgClass: 'bg-violet-500/12 dark:bg-violet-500/20',
    textClass: 'text-violet-800 dark:text-violet-300 font-semibold',
    borderClass: 'border-violet-500/35 dark:border-violet-500/40',
    dotClass: 'bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]',
    hasPing: false,
  },
  on_the_way: {
    label: 'On The Way',
    bgClass: 'bg-cyan-500/12 dark:bg-cyan-500/20',
    textClass: 'text-cyan-800 dark:text-cyan-300 font-semibold',
    borderClass: 'border-cyan-500/35 dark:border-cyan-500/40',
    dotClass: 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.6)]',
    hasPing: true,
  },
  in_progress: {
    label: 'In Progress',
    bgClass: 'bg-blue-500/12 dark:bg-blue-500/20',
    textClass: 'text-blue-800 dark:text-blue-300 font-semibold',
    borderClass: 'border-blue-500/35 dark:border-blue-500/40',
    dotClass: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]',
    hasPing: true,
  },
  completed: {
    label: 'Completed',
    bgClass: 'bg-emerald-500/12 dark:bg-emerald-500/20',
    textClass: 'text-emerald-800 dark:text-emerald-300 font-semibold',
    borderClass: 'border-emerald-500/35 dark:border-emerald-500/40',
    dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
    hasPing: false,
  },
  cancelled: {
    label: 'Cancelled',
    bgClass: 'bg-rose-500/12 dark:bg-rose-500/20',
    textClass: 'text-rose-800 dark:text-rose-300 font-semibold',
    borderClass: 'border-rose-500/35 dark:border-rose-500/40',
    dotClass: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]',
    hasPing: false,
  },
};

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-all duration-200 select-none whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      {/* Animated / Static Dot */}
      <span className="relative flex items-center justify-center shrink-0">
        {config.hasPing && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.dotClass
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            config.dotClass
          )}
        />
      </span>
      <span>{config.label}</span>
    </span>
  );
}