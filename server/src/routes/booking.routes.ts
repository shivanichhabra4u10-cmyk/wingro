
import { Router } from 'express';
import { createBooking, getBookings, updateBooking } from '../controllers/booking.controller';

const router = Router();


// POST /api/bookings - create a new booking
router.post('/', createBooking);

// GET /api/bookings - get all bookings (optionally filter by coachId)
router.get('/', getBookings);

// PATCH /api/bookings/:id - update a booking
router.patch('/:id', updateBooking);

export default router;
