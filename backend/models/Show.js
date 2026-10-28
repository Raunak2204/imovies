import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie'],
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: [true, 'Please provide a theatre'],
  },
  screenNumber: {
    type: Number,
    required: [true, 'Please provide a screen number'],
    min: 1,
  },
  date: {
    type: Date,
    required: [true, 'Please provide a show date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time'],
    trim: true,
  },
  endTime: {
    type: String,
    trim: true,
  },
  price: {
    regular: {
      type: Number,
      required: [true, 'Please provide the regular price'],
      min: 0,
    },
    premium: {
      type: Number,
      required: [true, 'Please provide the premium price'],
      min: 0,
    },
    vip: {
      type: Number,
      required: [true, 'Please provide the VIP price'],
      min: 0,
    },
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  seatMap: {
    type: Map,
    of: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
    },
    default: new Map(),
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
showSchema.index({ movie: 1, theatre: 1, date: 1 });

const Show = mongoose.model('Show', showSchema);
export default Show;
