import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Car, ChevronRight, X, Sparkles, Inbox, Clock } from 'lucide-react';
import { getBookings } from '@/lib/api';
import type { Booking } from '@/types/index';
import { StatusBadge } from '@/components/bookings/StatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch latest bookings for notification box
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications-bookings'],
    queryFn: () => getBookings({ limit: 6, sortBy: 'date', sortOrder: 'desc' }),
    refetchInterval: 15000,
  });

  const bookings: Booking[] = data?.bookings ?? [];
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const displayCount = pendingCount > 0 ? pendingCount : bookings.length;

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleBookingClick = () => {
    setIsOpen(false);
    navigate('/bookings');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Notification Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            refetch();
          }
        }}
        className={cn(
          'relative h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-200',
          isOpen
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
        )}
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {/* Unread / Pending Counter Badge */}
        {bookings.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-background">
            {displayCount > 9 ? '9+' : displayCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown Box */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-border/80 bg-background/95 dark:bg-card/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 leading-tight">
                  New Bookings
                  {bookings.length > 0 && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                      {bookings.length}
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Real-time service updates
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Bookings List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
            {isLoading ? (
              <div className="p-3 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground">No new bookings</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  When new service requests come in, they will appear right here.
                </p>
              </div>
            ) : (
              bookings.map((booking) => {
                const customerInitials = booking.customer?.name
                  ? booking.customer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'CU';

                return (
                  <div
                    key={booking.id}
                    onClick={handleBookingClick}
                    className="p-3.5 hover:bg-muted/50 transition-colors cursor-pointer group flex flex-col gap-2"
                  >
                    {/* Top row: Customer, Service & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {booking.customer?.avatar ? (
                          <img
                            src={booking.customer.avatar}
                            alt={booking.customer.name}
                            className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-border"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                            {customerInitials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {booking.customer?.name || 'Customer'}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {booking.serviceCategory?.name || 'General Service'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 scale-90 origin-right">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>

                    {/* Middle row: Vehicle info */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-muted/30 dark:bg-muted/20 px-2.5 py-1.5 rounded-lg">
                      <div className="flex items-center gap-1.5 truncate">
                        <Car className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                        <span className="truncate">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                          {booking.vehicle?.year ? ` (${booking.vehicle.year})` : ''}
                        </span>
                      </div>
                      <span className="font-semibold text-foreground/90 shrink-0 ml-2">
                        ${booking.amount?.toLocaleString?.() ?? booking.amount}
                      </span>
                    </div>

                    {/* Bottom row: Time / Booking number */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 px-0.5">
                      <span className="font-mono">{booking.bookingNumber}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {booking.scheduledDate} {booking.scheduledTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border/60 bg-muted/20">
            <Button
              variant="ghost"
              className="w-full justify-center gap-1.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-xl h-9"
              onClick={() => {
                setIsOpen(false);
                navigate('/bookings');
              }}
            >
              View All Bookings
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
