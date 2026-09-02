import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  User,
  Phone,
  Mail,
  Wrench,
  Star,
  CheckCircle,
  Clock,
  Briefcase,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { Mechanic } from '@/types';
import { getMechanicById, updateMechanicStatus } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MechanicDetailsModalProps {
  mechanic: Mechanic | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<
  string,
  { label: string; className: string; dotClass: string }
> = {
  available: {
    label: 'Available',
    className:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/50 font-semibold',
    dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
  },
  busy: {
    label: 'Busy',
    className:
      'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50 font-semibold',
    dotClass: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]',
  },
  on_break: {
    label: 'On Break',
    className:
      'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 dark:border-amber-500/50 font-semibold',
    dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
  },
  offline: {
    label: 'Offline',
    className:
      'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40 dark:border-slate-500/50 font-semibold',
    dotClass: 'bg-slate-400 dark:bg-slate-500',
  },
};

const STATUS_LIST: { value: 'available' | 'busy' | 'on_break' | 'offline'; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'on_break', label: 'On Break' },
  { value: 'offline', label: 'Offline' },
];

export function MechanicDetailsModal({
  mechanic: initialMechanic,
  isOpen,
  onClose,
}: MechanicDetailsModalProps) {
  const queryClient = useQueryClient();

  // Fetch full mechanic details including performance & completed bookings
  const { data: fullMechanic } = useQuery({
    queryKey: ['mechanic-details', initialMechanic?.id],
    queryFn: () => (initialMechanic ? getMechanicById(initialMechanic.id) : null),
    enabled: !!initialMechanic && isOpen,
  });

  const mechanic = fullMechanic || initialMechanic;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Mutation to update mechanic status
  const updateMutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateMechanicStatus(mechanic!.id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      queryClient.invalidateQueries({ queryKey: ['mechanic-details', mechanic?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (!isOpen || !mechanic) return null;

  const currentStatus = statusConfig[mechanic.status] || {
    label: mechanic.status.replace('_', ' '),
    className:
      'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40 font-semibold',
    dotClass: 'bg-slate-400',
  };

  const initials = mechanic.name
    ? mechanic.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ME';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background dark:bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {mechanic.avatar ? (
                <img
                  src={mechanic.avatar}
                  alt={mechanic.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border shadow-xs"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-border">
                  {initials || <Wrench className="h-5 w-5" />}
                </div>
              )}
              {/* Status beacon dot on avatar */}
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background',
                  currentStatus.dotClass
                )}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {mechanic.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded font-semibold">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{mechanic.rating?.toFixed?.(1) ?? mechanic.rating}</span>
                </div>
                <span>•</span>
                <span>ID: {mechanic.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge
              variant="outline"
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border shadow-2xs shrink-0',
                currentStatus.className
              )}
            >
              <span
                className={cn('h-2 w-2 rounded-full shrink-0', currentStatus.dotClass)}
              />
              <span>{currentStatus.label}</span>
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Contact Information & Summary */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {mechanic.phone && (
                <a
                  href={`tel:${mechanic.phone}`}
                  className="flex items-center gap-2.5 bg-background p-2.5 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-[10px]">Phone Number</p>
                    <p className="font-semibold text-foreground">{mechanic.phone}</p>
                  </div>
                </a>
              )}

              {mechanic.email && (
                <a
                  href={`mailto:${mechanic.email}`}
                  className="flex items-center gap-2.5 bg-background p-2.5 rounded-lg border border-border/50 hover:border-primary/50 transition-colors truncate"
                >
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div className="truncate">
                    <p className="text-muted-foreground text-[10px]">Email Address</p>
                    <p className="font-semibold text-foreground truncate">{mechanic.email}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Performance & Assignment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jobs Completed & Rating */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Performance Overview
              </span>

              <div className="pt-1 grid grid-cols-2 gap-2">
                <div className="bg-background p-2.5 rounded-lg border border-border/50">
                  <p className="text-[10px] text-muted-foreground">Jobs Completed</p>
                  <p className="text-xl font-bold text-foreground">
                    {mechanic.totalJobsCompleted}
                  </p>
                </div>

                <div className="bg-background p-2.5 rounded-lg border border-border/50">
                  <p className="text-[10px] text-muted-foreground">Rating</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    ★ {mechanic.rating}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Assignment */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Current Assignment
              </span>

              <div className="pt-1">
                {mechanic.currentBooking ? (
                  <div className="bg-blue-500/10 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/30 text-xs">
                    <p className="font-bold text-blue-900 dark:text-blue-200 truncate">
                      {mechanic.currentBooking.service}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Booking: <span className="font-mono">{mechanic.currentBooking.bookingNumber}</span>
                    </p>
                    {mechanic.currentBooking.customerName && (
                      <p className="text-[11px] text-muted-foreground">
                        Customer: {mechanic.currentBooking.customerName}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-background p-3 rounded-lg border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>No active job • Available for dispatch</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specializations & Skills */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-primary" />
              Specializations & Skills
            </span>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {mechanic.specialization && mechanic.specialization.length > 0 ? (
                mechanic.specialization.map((spec: string) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="text-xs px-2.5 py-1 bg-background border border-border/70 font-medium"
                  >
                    {spec}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  General Vehicle Maintenance
                </span>
              )}
            </div>
          </div>

          {/* Recent Completed Jobs (if available) */}
          {fullMechanic?.bookings && fullMechanic.bookings.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Recent Completed Jobs ({fullMechanic.bookings.length})
              </span>

              <div className="divide-y divide-border/50 text-xs bg-background rounded-lg border border-border/50 overflow-hidden">
                {fullMechanic.bookings.map((job: any) => (
                  <div key={job.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {job.serviceCategory?.name || 'Service Job'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Customer: {job.customer?.name || 'N/A'} • Booking: {job.bookingNumber}
                      </p>
                    </div>
                    {job.amount && (
                      <span className="font-semibold text-foreground">
                        ${job.amount.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Status Update Section */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Update Mechanic Status
              </span>
              {updateMutation.isPending && (
                <span className="text-xs text-primary flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {STATUS_LIST.map((st) => (
                <button
                  key={st.value}
                  onClick={() => updateMutation.mutate(st.value)}
                  disabled={updateMutation.isPending}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 select-none cursor-pointer',
                    mechanic.status === st.value
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                  )}
                >
                  Set {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-border/70 bg-muted/30 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
