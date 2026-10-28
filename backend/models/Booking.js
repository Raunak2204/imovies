import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Booking must be for a show'],
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Booking must be for a movie'],
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: [true, 'Booking must be for a theatre'],
  },
  seats: [
    {
      seatNumber: {
        type: String,
        required: [true, 'Please provide a seat number'],
      },
      seatType: {
        type: String,
        enum: ['regular', 'premium', 'vip'],
        required: [true, 'Please provide a seat type'],
      },
      price: {
        type: Number,
        required: [true, 'Please provide a seat price'],
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, 'Please provide the total amount'],
    min: 0,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  qrCode: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
