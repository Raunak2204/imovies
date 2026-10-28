import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Notification from '../models/Notification.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { generateTransactionId } from '../utils/helpers.js';

/**
 * @desc    Create Razorpay Order for a booking
 * @route   POST /api/v1/payments/razorpay/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return next(new ErrorResponse('Please provide bookingId', 400));
    }

    const booking = await Booking.findById(bookingId)
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name');

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    if (booking.status === 'confirmed') {
      return next(new ErrorResponse('Booking is already paid and confirmed', 400));
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_imoviesDemo2024';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'imoviesRazorpaySecretKey2024';

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const receipt = `rcpt_${booking._id.toString().slice(-8)}`;

    let orderId = `order_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 6)}`;

    // If real keys are provided, try creating order via Razorpay API
    if (keyId && keySecret && !keyId.includes('imoviesDemo')) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const apiRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes: {
              bookingId: booking._id.toString(),
              movieTitle: booking.movie?.title || 'Cinema Ticket',
            },
          }),
        });

        if (apiRes.ok) {
          const orderData = await apiRes.json();
          orderId = orderData.id;
        }
      } catch (apiErr) {
        console.warn('Razorpay API request fallback to local order generation:', apiErr.message);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: booking.totalAmount,
        amountInPaise,
        currency: 'INR',
        keyId,
        booking: {
          _id: booking._id,
          movieTitle: booking.movie?.title,
          theatreName: booking.theatre?.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature & confirm booking
 * @route   POST /api/v1/payments/razorpay/verify
 * @access  Private
 */
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'razorpay',
    } = req.body;

    if (!bookingId || !razorpay_payment_id) {
      return next(new ErrorResponse('Missing payment verification details', 400));
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'imoviesRazorpaySecretKey2024';

    // Verify HMAC SHA256 signature if order_id and signature are passed
    if (razorpay_order_id && razorpay_signature && !keySecret.includes('imoviesRazorpay')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return next(new ErrorResponse('Invalid Razorpay signature. Payment verification failed', 400));
      }
    }

    // Create or update payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user?._id || booking.user,
      amount: booking.totalAmount,
      method: paymentMethod.includes('upi') ? 'upi' : 'credit_card',
      transactionId: razorpay_payment_id,
      status: 'success',
      paidAt: new Date(),
    });

    // Mark booking as confirmed
    booking.status = 'confirmed';
    booking.paymentId = payment._id;
    await booking.save();

    // Mark seats as booked in show
    const show = await Show.findById(booking.show);
    if (show && show.seatMap) {
      for (const seat of booking.seats) {
        const sNum = seat.seatNumber || seat;
        show.seatMap.set(sNum, 'booked');
      }
      await show.save();

      // Emit socket notification
      if (req.app?.get('io')) {
        req.app.get('io').to(`show_${show._id}`).emit('bookingConfirmed', {
          showId: show._id,
          bookedSeats: booking.seats.map((s) => s.seatNumber || s),
        });
      }
    }

    // Create confirmation notification
    await Notification.create({
      user: req.user?._id || booking.user,
      title: 'Payment Confirmed via Razorpay',
      message: `Your payment of ₹${booking.totalAmount} was successful via Razorpay (ID: ${razorpay_payment_id}). Tickets confirmed!`,
      type: 'booking',
    });

    res.status(200).json({
      success: true,
      message: 'Razorpay payment verified and tickets confirmed!',
      data: {
        payment,
        booking: {
          _id: booking._id,
          status: booking.status,
          transactionId: razorpay_payment_id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process a simulated payment (standard direct card/upi/netbanking)
 * @route   POST /api/v1/payments
 * @access  Private
 */
export const processPayment = async (req, res, next) => {
  try {
    const { bookingId, method = 'credit_card' } = req.body;

    if (!bookingId) {
      return next(new ErrorResponse('Please provide bookingId', 400));
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    if (booking.status === 'confirmed') {
      return next(new ErrorResponse('Booking is already confirmed', 400));
    }

    const transactionId = generateTransactionId();

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user?._id || booking.user,
      amount: booking.totalAmount,
      method,
      transactionId,
      status: 'success',
      paidAt: new Date(),
    });

    booking.status = 'confirmed';
    booking.paymentId = payment._id;
    await booking.save();

    res.status(201).json({
      success: true,
      data: {
        payment,
        booking: {
          _id: booking._id,
          status: booking.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/v1/payments/:id
 * @access  Private
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payments by user
 * @route   GET /api/v1/payments/my
 * @access  Private
 */
export const getPaymentsByUser = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking', 'seats totalAmount status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refund a payment
 * @route   POST /api/v1/payments/:id/refund
 * @access  Private/Admin
 */
export const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    payment.status = 'refunded';
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.status = 'cancelled';
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
