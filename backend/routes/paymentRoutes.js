import { Router } from 'express';
import {
  processPayment,
  getPaymentById,
  getPaymentsByUser,
  refundPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Razorpay Dedicated Endpoints
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// User payment routes
router.get('/my', protect, getPaymentsByUser);
router.post('/', protect, processPayment);
router.get('/:id', protect, getPaymentById);

// Admin routes
router.post('/:id/refund', protect, authorize('admin'), refundPayment);

export default router;
