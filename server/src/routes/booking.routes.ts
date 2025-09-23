
import { Router } from 'express';
import { createBooking, getBookings, updateBooking } from '../controllers/booking.controller';

const router = Router();


// POST /api/bookings - create a new booking (requires authentication)
import { validateJWT } from '../middleware/auth';
router.post('/', validateJWT, createBooking);

// GET /api/bookings - get all bookings (optionally filter by coachId)
router.get('/', getBookings);

// PATCH /api/bookings/:id - update a booking
router.patch('/:id', updateBooking);

export default router;
