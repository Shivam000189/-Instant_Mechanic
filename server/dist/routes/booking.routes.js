"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
router.get('/', booking_controller_1.getBookings);
router.get('/:id', booking_controller_1.getBookingById);
router.patch('/:id/status', booking_controller_1.updateBookingStatus);
exports.default = router;
