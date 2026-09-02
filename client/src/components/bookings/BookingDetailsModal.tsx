import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  DollarSign,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/index';
import { StatusBadge } from './StatusBadge';
import { updateBookingStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LIST: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'on_the_way', label: 'On The Way' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [statusNotes, setStatusNotes] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
      setStatusNotes(booking.notes || '');
    }
  }, [booking]);

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

  // Mutation to update booking status
  const updateMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      updateBookingStatus(booking!.id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-bookings'] });
    },
  });

  if (!isOpen || !booking) return null;

  const copyBookingNumber = () => {
    navigator.clipboard.writeText(booking.bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: BookingStatus) => {
    setSelectedStatus(newStatus);
    updateMutation.mutate({ status: newStatus, notes: statusNotes });
  };

  const customerInitials = booking.customer?.name
    ? booking.customer.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background dark:bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground font-mono">
                  {booking.bookingNumber}
                </h3>
                <button
                  onClick={copyBookingNumber}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                  title="Copy Booking Number"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Created on {new Date(booking.createdAt).toLocaleDateString()} at{' '}
                {new Date(booking.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <StatusBadge status={booking.status} size="md" />
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

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Section 1: Customer Details */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                Customer Information
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                ID: {booking.customer?.id?.slice(0, 8)}...
              </span>
            </div>

            <div className="flex items-start gap-4">
              {booking.customer?.avatar ? (
                <img
                  src={booking.customer.avatar}
                  alt={booking.customer.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border shrink-0 shadow-xs"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-border">
                  {customerInitials}
                </div>
              )}

              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="font-bold text-base text-foreground truncate">
                  {booking.customer?.name}
                </h4>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                  {booking.customer?.email && (
                    <a
                      href={`mailto:${booking.customer.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors truncate"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                      <span className="truncate">{booking.customer.email}</span>
                    </a>
                  )}

                  {booking.customer?.phone && (
                    <a
                      href={`tel:${booking.customer.phone}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                      <span>{booking.customer.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Card */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-primary" />
                Vehicle Specifications
              </span>

              <div className="pt-1 space-y-2">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {booking.vehicle?.make} {booking.vehicle?.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Year: {booking.vehicle?.year || 'N/A'}{' '}
                    {booking.vehicle?.color ? `• Color: ${booking.vehicle.color}` : ''}
                  </p>
                </div>

                {booking.vehicle?.licensePlate && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border/80 text-xs font-mono font-bold tracking-wider">
                    <span>{booking.vehicle.licensePlate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Category Card */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                Service Details
              </span>

              <div className="pt-1 space-y-1.5">
                <p className="text-sm font-bold text-foreground">
                  {booking.serviceCategory?.name || 'General Maintenance'}
                </p>
                {booking.serviceCategory?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {booking.serviceCategory.description}
                  </p>
                )}
                {booking.serviceCategory?.avgDuration && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground/80" />
                    <span>Avg Duration: {booking.serviceCategory.avgDuration} mins</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Schedule & Location */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Schedule & Location
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 bg-background p-2.5 rounded-lg border border-border/50">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[10px]">Scheduled Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(booking.scheduledDate).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-background p-2.5 rounded-lg border border-border/50">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[10px]">Scheduled Time</p>
                  <p className="font-semibold text-foreground">
                    {booking.scheduledTime || 'Flexible Slot'}
                  </p>
                </div>
              </div>
            </div>

            {booking.address && (
              <div className="flex items-start gap-2 text-xs bg-background p-2.5 rounded-lg border border-border/50">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-muted-foreground text-[10px]">Service Location</p>
                  <p className="font-medium text-foreground">{booking.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Assigned Mechanic & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned Mechanic */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Assigned Mechanic
              </span>

              {booking.mechanic ? (
                <div className="flex items-center gap-3 pt-1">
                  {booking.mechanic.avatar ? (
                    <img
                      src={booking.mechanic.avatar}
                      alt={booking.mechanic.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-border shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {booking.mechanic.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {booking.mechanic.name}
                    </p>
                    {booking.mechanic.phone && (
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.mechanic.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Unassigned • Awaiting Dispatch</span>
                </div>
              )}
            </div>

            {/* Total Billing */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                Total Amount
              </span>

              <div className="pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">
                    ${booking.amount?.toLocaleString?.() ?? booking.amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {booking.currency || 'USD'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  ✓ Standard Price Guaranteed
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Status Change Action */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Update Booking Status
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
                  onClick={() => handleStatusChange(st.value)}
                  disabled={updateMutation.isPending}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 select-none cursor-pointer',
                    selectedStatus === st.value
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                  )}
                >
                  {st.label}
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
