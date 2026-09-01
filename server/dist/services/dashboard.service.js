"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = require("../config/prisma");
const date_fns_1 = require("date-fns");
class DashboardService {
    async getOverview(period = 'today') {
        const now = new Date();
        let dateFrom;
        let dateTo = now;
        switch (period) {
            case 'today':
                dateFrom = (0, date_fns_1.startOfDay)(now);
                dateTo = (0, date_fns_1.endOfDay)(now);
                break;
            case 'week':
                dateFrom = (0, date_fns_1.subDays)(now, 7);
                break;
            case 'month':
                dateFrom = (0, date_fns_1.subDays)(now, 30);
                break;
            case 'year':
                dateFrom = (0, date_fns_1.subDays)(now, 365);
                break;
            default:
                dateFrom = (0, date_fns_1.startOfDay)(now);
        }
        const [totalBookings, todayBookings, completedBookings, pendingBookings, cancelledBookings, totalRevenue, activeMechanics, newCustomers] = await Promise.all([
            prisma_1.prisma.booking.count(),
            prisma_1.prisma.booking.count({
                where: {
                    createdAt: { gte: (0, date_fns_1.startOfDay)(now), lte: (0, date_fns_1.endOfDay)(now) }
                }
            }),
            prisma_1.prisma.booking.count({ where: { status: 'completed' } }),
            prisma_1.prisma.booking.count({
                where: { status: { in: ['pending', 'assigned', 'on_the_way'] } }
            }),
            prisma_1.prisma.booking.count({ where: { status: 'cancelled' } }),
            prisma_1.prisma.booking.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true }
            }),
            prisma_1.prisma.mechanic.count({ where: { status: { in: ['available', 'busy'] } } }),
            prisma_1.prisma.customer.count({
                where: { createdAt: { gte: dateFrom, lte: dateTo } }
            })
        ]);
        // Bookings over time (last 7 days)
        const bookingsOverTime = await Promise.all(Array.from({ length: 7 }, (_, i) => {
            const date = (0, date_fns_1.subDays)(now, 6 - i);
            return prisma_1.prisma.booking.groupBy({
                by: ['createdAt'],
                where: {
                    createdAt: {
                        gte: (0, date_fns_1.startOfDay)(date),
                        lte: (0, date_fns_1.endOfDay)(date)
                    }
                },
                _count: { id: true },
                _sum: { amount: true }
            }).then((results) => ({
                date: date.toISOString().split('T')[0],
                count: results.reduce((acc, r) => acc + (r._count?.id ?? 0), 0),
                revenue: results.reduce((acc, r) => acc + (r._sum?.amount ?? 0), 0)
            }));
        }));
        // Status breakdown
        const statusBreakdown = await prisma_1.prisma.booking.groupBy({
            by: ['status'],
            _count: { id: true }
        });
        const total = totalBookings || 1;
        const statusBreakdownFormatted = statusBreakdown.map((s) => ({
            status: s.status,
            count: s._count.id,
            percentage: Math.round((s._count.id / total) * 100 * 10) / 10
        }));
        // Service breakdown
        const serviceBreakdown = await prisma_1.prisma.booking.groupBy({
            by: ['serviceCategoryId'],
            _count: { id: true },
            _sum: { amount: true }
        });
        const serviceCategories = await prisma_1.prisma.serviceCategory.findMany();
        const serviceBreakdownFormatted = serviceBreakdown.map((s) => {
            const cat = serviceCategories.find((c) => c.id === s.serviceCategoryId);
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
exports.DashboardService = DashboardService;
