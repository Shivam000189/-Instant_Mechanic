import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { emitBookingUpdate } from '../utils/sse';
import { BookingStatus } from '@prisma/client';

const bookingService = new BookingService();

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

  const data = await bookingService.getAllBookings({
    page,
    limit,
    search: req.query.search as string,
    status: req.query.status as BookingStatus,
    mechanicId: req.query.mechanicId as string,
    serviceCategory: req.query.serviceCategory as string,
    dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
    dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
    sortBy: (req.query.sortBy as string) || 'date',
    sortOrder
  });

  res.json(new ApiResponse(true, data));
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await bookingService.getBookingById(id);
  res.json(new ApiResponse(true, data));
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, notes } = req.body;
  if (!status) throw new ApiError(400, 'VALIDATION_ERROR', 'Status is required');

  const data = await bookingService.updateStatus(id, status as BookingStatus, notes);
  
  // Emit SSE event
  emitBookingUpdate({
    event: 'booking_status_updated',
    data: {
      bookingId: data.id,
      bookingNumber: data.bookingNumber,
      newStatus: data.status,
      mechanicId: data.mechanicId,
      timestamp: new Date().toISOString()
    }
  });

  res.json(new ApiResponse(true, data));
});