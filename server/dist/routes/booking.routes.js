"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
// POST /api/bookings - create a new booking
router.post('/', booking_controller_1.createBooking);
// GET /api/bookings - get all bookings (optionally filter by coachId)
router.get('/', booking_controller_1.getBookings);
// PATCH /api/bookings/:id - update a booking
router.patch('/:id', booking_controller_1.updateBooking);
exports.default = router;
