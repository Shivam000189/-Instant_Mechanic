"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerById = exports.getCustomers = void 0;
const customer_service_1 = require("../services/customer.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const customerService = new customer_service_1.CustomerService();
exports.getCustomers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const data = await customerService.getAllCustomers({
        page,
        limit,
        search: req.query.search,
        sortBy: req.query.sortBy || 'createdAt'
    });
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
exports.getCustomerById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const data = await customerService.getCustomerById(id);
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
