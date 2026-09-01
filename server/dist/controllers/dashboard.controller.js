"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const dashboardService = new dashboard_service_1.DashboardService();
exports.getDashboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { period } = req.query;
    const data = await dashboardService.getOverview(period);
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
