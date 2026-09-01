export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface DashboardOverview {
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeMechanics: number;
  newCustomers: number;
}

export interface ChartDataPoint {
  date: string;
  count: number;
  revenue: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface ServiceBreakdown {
  category: string;
  count: number;
  revenue: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  charts: {
    bookingsOverTime: ChartDataPoint[];
    statusBreakdown: StatusBreakdown[];
    serviceBreakdown: ServiceBreakdown[];
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
}

export interface MechanicSummary {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
}

export interface ServiceCategory {
  name: string;
  description?: string;
  avgDuration: number;
}

export type BookingStatus = 'pending' | 'assigned' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: Customer;
  vehicle: Vehicle;
  serviceCategory: ServiceCategory;
  mechanic: MechanicSummary | null;
  status: BookingStatus;
  amount: number;
  currency: string;
  scheduledDate: string;
  scheduledTime: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: Pagination;
}

export interface Mechanic {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'available' | 'busy' | 'on_break' | 'offline';
  specialization: string[];
  rating: number;
  totalJobsCompleted: number;
  currentBooking?: {
    id: string;
    bookingNumber: string;
    customerName: string;
    service: string;
    status: BookingStatus;
    startedAt: string;
  } | null;
}

export interface MechanicsResponse {
  mechanics: Mechanic[];
  stats: {
    total: number;
    available: number;
    busy: number;
    offline: number;
    on_break: number;
  };
}

export interface SSEEvent {
  event: string;
  data: {
    bookingId: string;
    bookingNumber: string;
    newStatus: BookingStatus;
    mechanicId?: string;
    timestamp: string;
  };
}