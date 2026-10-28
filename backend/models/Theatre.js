import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a theatre name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  screens: [
    {
      name: {
        type: String,
        required: [true, 'Please provide a screen name'],
      },
      totalSeats: {
        type: Number,
        required: [true, 'Please provide total seats'],
        min: 1,
      },
      seatLayout: {
        rows: { type: Number, default: 10 },
        columns: { type: Number, default: 15 },
      },
    },
  ],
  amenities: {
    type: [String],
    default: [],
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
