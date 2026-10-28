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
