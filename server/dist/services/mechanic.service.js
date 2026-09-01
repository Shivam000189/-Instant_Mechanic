"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicService = void 0;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
class MechanicService {
    async getAllMechanics(params) {
        const { status, search } = params;
        const where = {};
        if (status)
            where.status = status;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        const mechanics = await prisma_1.prisma.mechanic.findMany({
            where,
            include: {
                bookings: {
                    where: { status: { in: ['assigned', 'on_the_way', 'in_progress'] } },
                    take: 1,
                    include: {
                        customer: { select: { name: true } },
                        serviceCategory: { select: { name: true } }
                    }
                }
            }
        });
        const stats = await prisma_1.prisma.mechanic.groupBy({
            by: ['status'],
            _count: { id: true }
        });
        const statsMap = { total: 0, available: 0, busy: 0, offline: 0, on_break: 0 };
        stats.forEach(s => {
            statsMap[s.status] = s._count.id;
            statsMap.total += s._count.id;
        });
        const formatted = mechanics.map(m => ({
            ...m,
            currentBooking: m.bookings[0] || null,
            bookings: undefined
        }));
        return { mechanics: formatted, stats: statsMap };
    }
    async getMechanicById(id) {
        const mechanic = await prisma_1.prisma.mechanic.findUnique({
            where: { id },
            include: {
                bookings: {
                    where: { status: 'completed' },
                    orderBy: { completedAt: 'desc' },
                    take: 5,
                    include: {
                        customer: { select: { name: true } },
                        serviceCategory: { select: { name: true } }
                    }
                },
                statusHistory: { orderBy: { createdAt: 'desc' }, take: 10 }
            }
        });
        if (!mechanic)
            throw new ApiError_1.ApiError(404, 'MECHANIC_NOT_FOUND', `Mechanic with ID '${id}' not found`);
        const performance = await prisma_1.prisma.booking.aggregate({
            where: { mechanicId: id, status: 'completed' },
            _count: { id: true },
            _sum: { amount: true },
            _avg: { amount: true }
        });
        return {
            ...mechanic,
            performance: {
                totalJobs: performance._count.id,
                totalRevenue: performance._sum.amount || 0,
                avgJobValue: performance._avg.amount || 0
            }
        };
    }
    async updateStatus(id, status, reason) {
        const mechanic = await prisma_1.prisma.mechanic.findUnique({ where: { id } });
        if (!mechanic)
            throw new ApiError_1.ApiError(404, 'MECHANIC_NOT_FOUND', `Mechanic with ID '${id}' not found`);
        const updated = await prisma_1.prisma.mechanic.update({
            where: { id },
            data: { status }
        });
        await prisma_1.prisma.mechanicStatusHistory.create({
            data: { mechanicId: id, status, reason }
        });
        return updated;
    }
}
exports.MechanicService = MechanicService;
