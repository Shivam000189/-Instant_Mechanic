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

// Allowed Origins for CORS (Support Vite local dev, Next.js/CRA, and production URLs)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const envAllowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
].map((s) => s.trim()).filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Allow during dev/preview
    },
    credentials: true,
  })
);

app.use(express.json());

// Root endpoint for status & Render health checks
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Instant Mechanic API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      dashboard: '/api/v1/dashboard',
      bookings: '/api/v1/bookings',
      mechanics: '/api/v1/mechanics',
      customers: '/api/v1/customers',
      events: '/api/v1/events/live',
    },
  });
});

app.head('/', (req: Request, res: Response) => {
  res.status(200).end();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SSE Endpoint
app.get('/api/v1/events/live', (req: Request, res: Response) => {
  addClient(res);
});

// API Routes
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/mechanics', mechanicRoutes);
app.use('/api/v1/customers', customerRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.statusCode !== 404) {
    console.error('Error:', err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      new ApiResponse(false, {
        code: err.code,
        message: err.message,
        details: err.details,
      })
    );
  }

  // Prisma errors
  if (err.code?.startsWith('P')) {
    return res.status(400).json(
      new ApiResponse(false, {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: { prismaCode: err.code },
      })
    );
  }

  res.status(500).json(
    new ApiResponse(false, {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    })
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api/v1`);
});