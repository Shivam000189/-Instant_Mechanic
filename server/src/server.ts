import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import dashboardRoutes from './routes/dashboard.routes';
import bookingRoutes from './routes/booking.routes';
import mechanicRoutes from './routes/mechanic.routes';
import customerRoutes from './routes/customer.routes';
import { addClient } from './utils/sse';
import { ApiError } from './utils/ApiError';
import { ApiResponse } from './utils/ApiResponse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// SSE Endpoint
app.get('/api/v1/events/live', (req: Request, res: Response) => {
  addClient(res);
});

// API Routes
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/mechanics', mechanicRoutes);
app.use('/api/v1/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  next(new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      new ApiResponse(false, {
        code: err.code,
        message: err.message,
        details: err.details
      })
    );
  }

  // Prisma errors
  if (err.code?.startsWith('P')) {
    return res.status(400).json(
      new ApiResponse(false, {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: { prismaCode: err.code }
      })
    );
  }

  res.status(500).json(
    new ApiResponse(false, {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    })
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});