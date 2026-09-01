"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const mechanic_routes_1 = __importDefault(require("./routes/mechanic.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const sse_1 = require("./utils/sse");
const ApiError_1 = require("./utils/ApiError");
const ApiResponse_1 = require("./utils/ApiResponse");
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(null, true); // Allow during dev/preview
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Root endpoint for status & Render health checks
app.get('/', (req, res) => {
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
app.head('/', (req, res) => {
    res.status(200).end();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// SSE Endpoint
app.get('/api/v1/events/live', (req, res) => {
    (0, sse_1.addClient)(res);
});
// API Routes
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/v1/bookings', booking_routes_1.default);
app.use('/api/v1/mechanics', mechanic_routes_1.default);
app.use('/api/v1/customers', customer_routes_1.default);
// 404 Handler
app.use((req, res, next) => {
    next(new ApiError_1.ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
});
// Global Error Handler
app.use((err, req, res, next) => {
    if (err.statusCode !== 404) {
        console.error('Error:', err);
    }
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json(new ApiResponse_1.ApiResponse(false, {
            code: err.code,
            message: err.message,
            details: err.details,
        }));
    }
    // Prisma errors
    if (err.code?.startsWith('P')) {
        return res.status(400).json(new ApiResponse_1.ApiResponse(false, {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed',
            details: { prismaCode: err.code },
        }));
    }
    res.status(500).json(new ApiResponse_1.ApiResponse(false, {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
    }));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api/v1`);
});
