import API from './api';

/**
 * Create a new booking.
 * @param {{ showId: string, seats: string[], totalAmount: number }} data
 */
export const createBooking = async (data) => {
  const response = await API.post('/bookings', data);
  return response.data;
};

/**
 * Get a booking by its ID.
 * @param {string} id
 */
export const getBookingById = async (id) => {
  const response = await API.get(`/bookings/${id}`);
  return response.data;
};

/**
 * Get all bookings for the authenticated user.
 */
export const getUserBookings = async () => {
  const response = await API.get('/bookings/my-bookings');
  return response.data;
};

/**
 * Cancel a booking.
 * @param {string} id
 */
export const cancelBooking = async (id) => {
  const response = await API.put(`/bookings/${id}/cancel`);
  return response.data;
};

/**
 * Get all bookings (admin).
 * @param {Object} params - { page, limit, status, search }
 */
export const getAllBookings = async (params = {}) => {
  const response = await API.get('/bookings', { params });
  return response.data;
};
