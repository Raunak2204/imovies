import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Payment must be for a booking'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must belong to a user'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the payment amount'],
    min: 0,
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'],
    required: [true, 'Please provide a payment method'],
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending', 'refunded'],
    default: 'pending',
  },
  paidAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
