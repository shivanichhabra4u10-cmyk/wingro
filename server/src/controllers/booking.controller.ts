// Update a booking by ID
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    console.log('PATCH /api/bookings/:id called');
    console.log('Booking ID:', id);
    console.log('Update payload:', update);
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true });
    if (!booking) {
      console.log('Booking not found for ID:', id);
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    console.log('Booking updated:', booking);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log('Create booking request body:', req.body); // Debug log
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get all bookings, optionally filter by coachId
export const getBookings = async (req: Request, res: Response) => {
  try {
    const { coachId } = req.query;
    const filter: any = {};
    if (coachId) filter.coachId = coachId;
    const bookings = await Booking.find(filter).sort({ date: -1, time: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
