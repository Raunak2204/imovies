import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must belong to a user'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a notification title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a notification message'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  type: {
    type: String,
    enum: ['booking', 'cancellation', 'reminder', 'promotion'],
    required: [true, 'Please provide a notification type'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient user notification queries
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
