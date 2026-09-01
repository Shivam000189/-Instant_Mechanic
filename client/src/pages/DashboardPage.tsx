import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingsChart } from '@/components/dashboard/BookingsChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { ServiceBarChart } from '@/components/dashboard/ServiceBarChart';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Wrench,
  XCircle,
  TrendingUp,
} from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard('today'),
    refetchInterval: 30000, // Poll every 30s as fallback
  });

  const overview = data?.overview;
  const charts = data?.charts;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your operations today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={overview?.totalBookings ?? 0}
          description="All time bookings"
          icon={Calendar}
          isLoading={isLoading}
        />
        <StatCard
          title="Today's Bookings"
          value={overview?.todayBookings ?? 0}
          description="New bookings today"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Completed"
          value={overview?.completedBookings ?? 0}
          description={`${overview?.pendingBookings ?? 0} pending`}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(overview?.totalRevenue ?? 0).toLocaleString()}`}
          description="Lifetime revenue"
          icon={DollarSign}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Mechanics"
          value={overview?.activeMechanics ?? 0}
          description="Currently working"
          icon={Wrench}
          isLoading={isLoading}
        />
        <StatCard
          title="New Customers"
          value={overview?.newCustomers ?? 0}
          description="This period"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Pending"
          value={overview?.pendingBookings ?? 0}
          description="Awaiting assignment"
          icon={Clock}
          isLoading={isLoading}
        />
        <StatCard
          title="Cancelled"
          value={overview?.cancelledBookings ?? 0}
          description="Total cancelled"
          icon={XCircle}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <BookingsChart
          data={charts?.bookingsOverTime ?? []}
          isLoading={isLoading}
        />
        <RevenueChart
          data={charts?.bookingsOverTime ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusPieChart
          data={charts?.statusBreakdown ?? []}
          isLoading={isLoading}
        />
        <ServiceBarChart
          data={charts?.serviceBreakdown ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}