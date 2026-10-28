import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { bookingValidation } from '../middleware/validator.js';

const router = Router();

// User routes
router.get('/my', protect, getUserBookings);
router.get('/my-bookings', protect, getUserBookings);
router.post('/', protect, bookingValidation, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

export default router;
