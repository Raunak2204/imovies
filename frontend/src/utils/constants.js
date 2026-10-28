/** Genre options */
export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

/** Language options */
export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Punjabi',
  'Korean',
  'Japanese',
  'Spanish',
  'French',
  'German',
];

/** Certification / age-rating options */
export const CERTIFICATES = ['U', 'UA', 'A', 'S', 'U/A 7+', 'U/A 13+', 'U/A 16+'];

/** Seat type labels and default pricing multipliers */
export const SEAT_TYPES = {
  regular: { label: 'Regular', color: '#4caf50', multiplier: 1 },
  premium: { label: 'Premium', color: '#2196f3', multiplier: 1.5 },
  vip: { label: 'VIP', color: '#ffd700', multiplier: 2 },
};

/** Booking status options */
export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: '#ff9800' },
  confirmed: { label: 'Confirmed', color: '#4caf50' },
  cancelled: { label: 'Cancelled', color: '#f44336' },
  completed: { label: 'Completed', color: '#2196f3' },
};

/** Payment method options */
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card', icon: 'CreditCard' },
  { value: 'debit_card', label: 'Debit Card', icon: 'CreditCard' },
  { value: 'upi', label: 'UPI', icon: 'AccountBalance' },
  { value: 'net_banking', label: 'Net Banking', icon: 'AccountBalance' },
  { value: 'wallet', label: 'Wallet', icon: 'AccountBalanceWallet' },
];
