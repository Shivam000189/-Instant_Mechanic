import { prisma } from '../config/prisma';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export class DashboardService {
  async getOverview(period: string = 'today') {
    const now = new Date();
    let dateFrom: Date;
    let dateTo: Date = now;

    switch (period) {
      case 'today':
        dateFrom = startOfDay(now);
        dateTo = endOfDay(now);
        break;
      case 'week':
        dateFrom = subDays(now, 7);
        break;
      case 'month':
        dateFrom = subDays(now, 30);
        break;
      case 'year':
        dateFrom = subDays(now, 365);
        break;
      default:
        dateFrom = startOfDay(now);
    }

    const [
      totalBookings,
      todayBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      activeMechanics,
      newCustomers
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          createdAt: { gte: startOfDay(now), lte: endOfDay(now) }
        }
      }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.booking.count({
        where: { status: { in: ['pending', 'assigned', 'on_the_way'] } }
      }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      }),
      prisma.mechanic.count({ where: { status: { in: ['available', 'busy'] } } }),
      prisma.customer.count({
        where: { createdAt: { gte: dateFrom, lte: dateTo } }
      })
    ]);

    // Bookings over time (last 7 days)
    const bookingsOverTime = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        return prisma.booking.groupBy({
          by: ['createdAt'],
          where: {
            createdAt: {
              gte: startOfDay(date),
              lte: endOfDay(date)
            }
          },
          _count: { id: true },
          _sum: { amount: true }
        }).then((results: any[]) => ({
          date: date.toISOString().split('T')[0],
          count: results.reduce((acc: number, r: any) => acc + (r._count?.id ?? 0), 0),
          revenue: results.reduce((acc: number, r: any) => acc + (r._sum?.amount ?? 0), 0)
        }));
      })
    );

    // Status breakdown
    const statusBreakdown = await prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const total = totalBookings || 1;
    const statusBreakdownFormatted = statusBreakdown.map((s: any) => ({
      status: s.status,
      count: s._count.id,
      percentage: Math.round((s._count.id / total) * 100 * 10) / 10
    }));

    // Service breakdown
    const serviceBreakdown = await prisma.booking.groupBy({
      by: ['serviceCategoryId'],
      _count: { id: true },
      _sum: { amount: true }
    });

    const serviceCategories = await prisma.serviceCategory.findMany();
    const serviceBreakdownFormatted = serviceBreakdown.map((s: any) => {
      const cat = serviceCategories.find((c: any) => c.id === s.serviceCategoryId);
      return {
        category: cat?.name || 'Unknown',
        count: s._count.id,
        revenue: s._sum.amount || 0
      };
    });

    return {
      overview: {
        totalBookings,
        todayBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeMechanics,
        newCustomers
      },
      charts: {
        bookingsOverTime,
        statusBreakdown: statusBreakdownFormatted,
        serviceBreakdown: serviceBreakdownFormatted
      }
    };
  }
}