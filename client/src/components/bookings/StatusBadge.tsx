import { Badge } from '../ui/badge';
import type { BookingStatus } from '../../types/index';
import { cn } from '../../lib/utils';

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
  on_the_way: {
    label: 'On The Way',
    className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}