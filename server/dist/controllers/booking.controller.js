"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getBookingById = exports.getBookings = void 0;
const booking_service_1 = require("../services/booking.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const sse_1 = require("../utils/sse");
const bookingService = new booking_service_1.BookingService();
exports.getBookings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const data = await bookingService.getAllBookings({
        page,
        limit,
        search: req.query.search,
        status: req.query.status,
        mechanicId: req.query.mechanicId,
        serviceCategory: req.query.serviceCategory,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo) : undefined,
        sortBy: req.query.sortBy || 'date',
        sortOrder
    });
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
exports.getBookingById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const data = await bookingService.getBookingById(id);
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
exports.updateBookingStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { status, notes } = req.body;
    if (!status)
        throw new ApiError_1.ApiError(400, 'VALIDATION_ERROR', 'Status is required');
    const data = await bookingService.updateStatus(id, status, notes);
    // Emit SSE event
    (0, sse_1.emitBookingUpdate)({
        event: 'booking_status_updated',
        data: {
            bookingId: data.id,
            bookingNumber: data.bookingNumber,
            newStatus: data.status,
            mechanicId: data.mechanicId,
            timestamp: new Date().toISOString()
        }
    });
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
