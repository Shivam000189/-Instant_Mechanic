"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const VALID_TRANSITIONS = {
    pending: ['assigned', 'cancelled'],
    assigned: ['on_the_way', 'cancelled'],
    on_the_way: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
};
class BookingService {
    async getAllBookings(params) {
        const { page, limit, search, status, mechanicId, serviceCategory, dateFrom, dateTo, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (mechanicId)
            where.mechanicId = mechanicId;
        if (search) {
            where.OR = [
                { bookingNumber: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { vehicle: { licensePlate: { contains: search, mode: 'insensitive' } } }
            ];
        }
        if (serviceCategory) {
            where.serviceCategory = { name: { equals: serviceCategory, mode: 'insensitive' } };
        }
        if (dateFrom || dateTo) {
            where.scheduledDate = {};
            if (dateFrom)
                where.scheduledDate.gte = dateFrom;
            if (dateTo)
                where.scheduledDate.lte = dateTo;
        }
        const orderBy = {};
        if (sortBy === 'date')
            orderBy.createdAt = sortOrder;
        else if (sortBy === 'amount')
            orderBy.amount = sortOrder;
        else if (sortBy === 'status')
            orderBy.status = sortOrder;
        else
            orderBy.createdAt = 'desc';
        const [bookings, total] = await Promise.all([
            prisma_1.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    customer: { select: { id: true, name: true, phone: true, email: true, avatar: true } },
                    vehicle: { select: { make: true, model: true, year: true, licensePlate: true, color: true } },
                    serviceCategory: { select: { name: true, description: true, avgDuration: true } },
                    mechanic: { select: { id: true, name: true, avatar: true, phone: true } }
                }
            }),
            prisma_1.prisma.booking.count({ where })
        ]);
        return {
            bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: skip + bookings.length < total,
                hasPrevPage: page > 1
            }
        };
    }
    async getBookingById(id) {
        const booking = await prisma_1.prisma.booking.findUnique({
            where: { id },
            include: {
                customer: true,
                vehicle: true,
                serviceCategory: true,
                mechanic: { select: { id: true, name: true, avatar: true, phone: true } },
                statusHistory: { orderBy: { createdAt: 'asc' } }
            }
        });
        if (!booking)
            throw new ApiError_1.ApiError(404, 'BOOKING_NOT_FOUND', `Booking with ID '${id}' not found`);
        return booking;
    }
    async updateStatus(id, newStatus, notes) {
        const booking = await prisma_1.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new ApiError_1.ApiError(404, 'BOOKING_NOT_FOUND', `Booking with ID '${id}' not found`);
        const validNextStatuses = VALID_TRANSITIONS[booking.status];
        if (!validNextStatuses.includes(newStatus)) {
            throw new ApiError_1.ApiError(422, 'INVALID_STATUS_TRANSITION', `Cannot transition from '${booking.status}' to '${newStatus}'`, { currentStatus: booking.status, requestedStatus: newStatus });
        }
        const updateData = { status: newStatus };
        if (newStatus === 'completed')
            updateData.completedAt = new Date();
        const updated = await prisma_1.prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                customer: { select: { id: true, name: true } },
                mechanic: { select: { id: true, name: true } },
                serviceCategory: { select: { name: true } }
            }
        });
        // Record status history
        await prisma_1.prisma.bookingStatusHistory.create({
            data: {
                bookingId: id,
                status: newStatus,
                notes
            }
        });
        // Update mechanic stats if completed
        if (newStatus === 'completed' && booking.mechanicId) {
            await prisma_1.prisma.mechanic.update({
                where: { id: booking.mechanicId },
                data: {
                    totalJobsCompleted: { increment: 1 },
                    status: 'available'
                }
            });
        }
        // If assigned, mark mechanic busy
        if (newStatus === 'assigned' && booking.mechanicId) {
            await prisma_1.prisma.mechanic.update({
                where: { id: booking.mechanicId },
                data: { status: 'busy' }
            });
        }
        return updated;
    }
}
exports.BookingService = BookingService;
