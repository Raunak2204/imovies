import dayjs from 'dayjs';

/**
 * Format a number as Indian Rupee currency string.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string into a human-readable format.
 * @param {string|Date} date
 * @param {string} format - dayjs format string (default 'DD MMM YYYY')
 * @returns {string}
 */
export const formatDate = (date, format = 'DD MMM YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Convert minutes into "Xh Ym" string.
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Return a MUI color string for a booking / payment status.
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const map = {
    confirmed: '#4caf50',
    completed: '#2196f3',
    pending: '#ff9800',
    cancelled: '#f44336',
    failed: '#f44336',
    refunded: '#9c27b0',
  };
  return map[status?.toLowerCase()] || '#b0b0b0';
};

/**
 * Truncate text to a maximum length with an ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
};

/**
 * Generate a short unique id for keys / temp IDs.
 * @returns {string}
 */
export const generateId = () => Math.random().toString(36).substring(2, 10);

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Convert a Date object or date-like value into a local 'YYYY-MM-DD' string.
 * @param {string|Date} dateObj
 * @returns {string}
 */
export const getLocalDateString = (dateObj = new Date()) => {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a movie showtime has already passed based on current date & time.
 * For example, if today is 2026-10-30 at 3:00 PM and show is scheduled for 1:00 PM today,
 * this function returns true (show cannot be booked).
 *
 * @param {string|Date} showDate - Date of show (e.g. '2026-10-30' or Date object)
 * @param {string} startTime - Start time string (e.g. '01:00 PM', '10:00 AM', '15:30')
 * @returns {boolean} true if show has already concluded/started
 */
export const isShowPassed = (showDate, startTime) => {
  if (!showDate) return false;
  const now = new Date();

  // Normalize showDate to local YYYY-MM-DD
  let showDateStr = '';
  if (typeof showDate === 'string') {
    if (showDate.includes('T')) {
      showDateStr = getLocalDateString(new Date(showDate));
    } else {
      showDateStr = showDate.split('T')[0];
    }
  } else if (showDate instanceof Date && !isNaN(showDate.getTime())) {
    showDateStr = getLocalDateString(showDate);
  }

  // Local today string YYYY-MM-DD
  const todayStr = getLocalDateString(now);

  if (showDateStr && showDateStr < todayStr) {
    return true; // Past day
  }

  if (showDateStr && showDateStr > todayStr) {
    return false; // Future day
  }

  // Same day: evaluate start time
  if (!startTime) return false;
  const match = startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const showTime = new Date(now);
  showTime.setHours(hours, minutes, 0, 0);

  return now >= showTime;
};
