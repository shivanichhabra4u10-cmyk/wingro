"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookings = exports.createBooking = exports.updateBooking = void 0;
// Update a booking by ID
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = req.body;
        console.log('PATCH /api/bookings/:id called');
        console.log('Booking ID:', id);
        console.log('Update payload:', update);
        const booking = yield Booking_1.default.findByIdAndUpdate(id, update, { new: true });
        if (!booking) {
            console.log('Booking not found for ID:', id);
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        console.log('Booking updated:', booking);
        res.status(200).json({ success: true, data: booking });
    }
    catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.updateBooking = updateBooking;
const Booking_1 = __importDefault(require("../models/Booking"));
// Create a new booking
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Create booking request body:', req.body); // Debug log
        const booking = yield Booking_1.default.create(req.body);
        res.status(201).json({ success: true, data: booking });
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.createBooking = createBooking;
// Get all bookings, optionally filter by coachId
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { coachId } = req.query;
        const filter = {};
        if (coachId)
            filter.coachId = coachId;
        const bookings = yield Booking_1.default.find(filter).sort({ date: -1, time: -1 });
        res.status(200).json({ success: true, data: bookings });
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.getBookings = getBookings;
