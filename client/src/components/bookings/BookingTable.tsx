import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../lib/api';
import type { Booking, BookingStatus } from '../../types/index';
import { StatusBadge } from './StatusBadge';
import { BookingDetailsModal } from './BookingDetailsModal';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from 'lucide-react';

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'on_the_way', label: 'On The Way' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function BookingTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', page, search, status, sortBy, sortOrder],
    queryFn: () =>
      getBookings({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handleOpenBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bookings by customer, vehicle, ID..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as BookingStatus | '');
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border/70">
              <tr>
                {[
                  { key: 'bookingNumber', label: 'Booking ID' },
                  { key: 'customer', label: 'Customer' },
                  { key: 'vehicle', label: 'Vehicle' },
                  { key: 'serviceCategory', label: 'Service' },
                  { key: 'mechanic', label: 'Mechanic' },
                  { key: 'status', label: 'Status' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'date', label: 'Date' },
                  { key: 'actions', label: '' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                    onClick={() => (col.key !== 'actions' ? handleSort(col.key) : undefined)}
                  >
                    <span className="flex items-center">
                      {col.label}
                      {col.key !== 'actions' && <SortIcon column={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.bookings?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              ) : (
                data?.bookings?.map((booking: Booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-muted/50 transition-colors group"
                  >
                    <td
                      className="px-4 py-3 font-mono font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleOpenBooking(booking)}
                    >
                      {booking.bookingNumber}
                    </td>

                    {/* Customer Cell with Click to Open Modal */}
                    <td
                      className="px-4 py-3 cursor-pointer group/cust"
                      onClick={() => handleOpenBooking(booking)}
                      title="Click to view customer & booking details"
                    >
                      <div className="flex items-center gap-2">
                        {booking.customer?.avatar ? (
                          <img
                            src={booking.customer.avatar}
                            alt={booking.customer.name}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-border group-hover/cust:ring-primary transition-all shrink-0"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {booking.customer?.name?.[0] || 'C'}
                          </div>
                        )}
                        <span className="whitespace-nowrap font-medium text-foreground group-hover/cust:text-primary group-hover/cust:underline transition-colors">
                          {booking.customer?.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {booking.vehicle?.make} {booking.vehicle?.model}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                      {booking.serviceCategory?.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {booking.mechanic ? (
                        <div className="flex items-center gap-2">
                          {booking.mechanic.avatar && (
                            <img
                              src={booking.mechanic.avatar}
                              alt=""
                              className="h-6 w-6 rounded-full object-cover shrink-0"
                            />
                          )}
                          <span>{booking.mechanic.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-foreground">
                      ${booking.amount?.toLocaleString?.() ?? booking.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-primary gap-1"
                        onClick={() => handleOpenBooking(booking)}
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {(data.pagination.currentPage - 1) * data.pagination.itemsPerPage + 1} -{' '}
            {Math.min(
              data.pagination.currentPage * data.pagination.itemsPerPage,
              data.pagination.totalItems
            )}{' '}
            of {data.pagination.totalItems} bookings
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}