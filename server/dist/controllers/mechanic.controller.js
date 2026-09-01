"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMechanicStatus = exports.getMechanicById = exports.getMechanics = void 0;
const mechanic_service_1 = require("../services/mechanic.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const mechanicService = new mechanic_service_1.MechanicService();
exports.getMechanics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await mechanicService.getAllMechanics({
        status: req.query.status,
        search: req.query.search
    });
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
exports.getMechanicById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const data = await mechanicService.getMechanicById(id);
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
exports.updateMechanicStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { status, reason } = req.body;
    const data = await mechanicService.updateStatus(id, status, reason);
    res.json(new ApiResponse_1.ApiResponse(true, data));
});
