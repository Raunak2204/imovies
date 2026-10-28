import crypto from 'crypto';

/**
 * Generate a seat map for a screen.
 * Creates rows labelled A, B, C, ... with columns 1 through `cols`.
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns (seats per row)
 * @returns {Map<string, string>} seatMap with all seats set to 'available'
 */
export const generateSeatMap = (rows = 10, cols = 15) => {
  const seatMap = new Map();
  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
    for (let c = 1; c <= cols; c++) {
      seatMap.set(`${rowLabel}${c}`, 'available');
    }
  }
  return seatMap;
};

/**
 * Generate a simulated QR code string for a booking.
 * @param {string} bookingId - The booking ID
 * @param {string} userId - The user ID
 * @returns {string} A simulated QR code string
 */
export const generateQRCode = (bookingId, userId) => {
  const payload = `IMOVIES-${bookingId}-${userId}-${Date.now()}`;
  const hash = crypto.createHash('sha256').update(payload).digest('hex');
  return `QR-${hash.substring(0, 16).toUpperCase()}`;
};

/**
 * Format a Date object to a readable string.
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (e.g. "28 Oct 2024")
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Calculate end time given a start time and duration in minutes.
 * @param {string} startTime - Start time in HH:mm format
 * @param {number} durationMinutes - Duration in minutes
 * @returns {string} End time in HH:mm format
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

/**
 * Determine the seat type based on the row letter.
 * Rows A-C = vip, D-F = premium, G+ = regular
 * @param {string} seatNumber - Seat identifier like "A5"
 * @returns {string} Seat type: 'vip', 'premium', or 'regular'
 */
export const getSeatType = (seatNumber) => {
  const row = seatNumber.charAt(0).toUpperCase();
  if (row <= 'C') return 'vip';
  if (row <= 'F') return 'premium';
  return 'regular';
};

/**
 * Generate a unique transaction ID for payments.
 * @returns {string} Transaction ID
 */
export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN-${timestamp}-${random}`;
};
