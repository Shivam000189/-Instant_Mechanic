import { BookingTable } from '@/components/bookings/BookingTable';

export function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">
          Manage and track all service bookings
        </p>
      </div>
      <BookingTable />
    </div>
  );
}