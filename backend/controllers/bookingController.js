import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { generateQRCode, getSeatType } from '../utils/helpers.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/v1/bookings
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return next(new ErrorResponse('Show not found', 404));
    }

    // Fetch the show
    const show = await Show.findById(showId);
    if (!show) {
      return next(new ErrorResponse('Show not found', 404));
    }

    if (show.status !== 'active') {
      return next(new ErrorResponse('This show is no longer active', 400));
    }

    // Validate seats are available
    const unavailableSeats = [];
    for (const seat of seats) {
      const seatStatus = show.seatMap.get(seat.seatNumber);
      if (!seatStatus) {
        return next(
          new ErrorResponse(`Seat ${seat.seatNumber} does not exist`, 400)
        );
      }
      if (seatStatus !== 'available') {
        unavailableSeats.push(seat.seatNumber);
      }
    }

    if (unavailableSeats.length > 0) {
      return next(
        new ErrorResponse(
          `Seats ${unavailableSeats.join(', ')} are not available`,
          400
        )
      );
    }

    // Calculate prices for each seat and total amount
    const processedSeats = seats.map((seat) => {
      const seatType = seat.seatType || getSeatType(seat.seatNumber);
      const price = show.price[seatType] || show.price.regular;
      return {
        seatNumber: seat.seatNumber,
        seatType,
        price,
      };
    });

    const totalAmount = processedSeats.reduce((sum, s) => sum + s.price, 0);

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      movie: show.movie,
      theatre: show.theatre,
      seats: processedSeats,
      totalAmount,
      status: 'pending',
    });

    // Mark seats as booked in the show's seatMap
    for (const seat of processedSeats) {
      show.seatMap.set(seat.seatNumber, 'booked');
    }
    show.availableSeats -= processedSeats.length;
    await show.save();

    // Generate QR code for ticket verification
    const qrData = JSON.stringify({
      bookingNumber: booking.bookingNumber,
      bookingId: booking._id,
      seats: processedSeats.map((s) => s.seatNumber),
      totalAmount,
    });
    const qrCode = await generateQRCode(qrData);

    booking.qrCode = qrCode;
    await booking.save();

    // Add booking reference to user document
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookings: booking._id },
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Created',
      message: `Your booking #${booking.bookingNumber} is confirmed for ${processedSeats.length} seat(s).`,
      type: 'booking',
      data: { bookingId: booking._id },
    });

    // Populate booking details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl language duration certificate')
      .populate('theatre', 'name location')
      .populate('show', 'date startTime endTime screenNumber');

    // Emit socket event for real-time seat update
    if (req.app.get('io')) {
      req.app.get('io').to(`show_${showId}`).emit('bookingConfirmed', {
        showId,
        bookedSeats: processedSeats.map((s) => s.seatNumber),
      });
    }

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/v1/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title posterUrl language duration certificate')
      .populate('theatre', 'name location')
      .populate('show', 'date startTime endTime screenNumber price')
      .populate('paymentId')
      .populate('user', 'name email phone');

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    // Ensure user can only see their own bookings (unless admin)
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse('Not authorized to view this booking', 403)
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's bookings
 * @route   GET /api/v1/bookings/my
 * @access  Private
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('movie', 'title posterUrl language')
      .populate('theatre', 'name location')
      .populate('show', 'date startTime endTime screenNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/v1/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    // Ensure user can only cancel their own bookings (unless admin)
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse('Not authorized to cancel this booking', 403)
      );
    }

    if (booking.status === 'cancelled') {
      return next(new ErrorResponse('Booking is already cancelled', 400));
    }

    // Release seats back to available
    const show = await Show.findById(booking.show);
    if (show) {
      for (const seat of booking.seats) {
        show.seatMap.set(seat.seatNumber, 'available');
      }
      show.availableSeats += booking.seats.length;
      await show.save();

      // Emit socket event
      if (req.app.get('io')) {
        req.app.get('io').to(`show_${show._id}`).emit('seatReleased', {
          showId: show._id.toString(),
          releasedSeats: booking.seats.map((s) => s.seatNumber),
        });
      }
    }

    booking.status = 'cancelled';
    await booking.save();

    // Create cancellation notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Cancelled',
      message: `Your booking has been cancelled. ${booking.seats.length} seat(s) have been released.`,
      type: 'cancellation',
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/v1/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.userId) {
      filter.user = req.query.userId;
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name location')
      .populate('show', 'date startTime endTime screenNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
