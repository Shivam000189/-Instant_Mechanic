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
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// SSE Endpoint
app.get('/api/v1/events/live', (req, res) => {
    (0, sse_1.addClient)(res);
});
// API Routes
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/v1/bookings', booking_routes_1.default);
app.use('/api/v1/mechanics', mechanic_routes_1.default);
app.use('/api/v1/customers', customer_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 Handler
app.use((req, res, next) => {
    next(new ApiError_1.ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json(new ApiResponse_1.ApiResponse(false, {
            code: err.code,
            message: err.message,
            details: err.details
        }));
    }
    // Prisma errors
    if (err.code?.startsWith('P')) {
        return res.status(400).json(new ApiResponse_1.ApiResponse(false, {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed',
            details: { prismaCode: err.code }
        }));
    }
    res.status(500).json(new ApiResponse_1.ApiResponse(false, {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
    }));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
