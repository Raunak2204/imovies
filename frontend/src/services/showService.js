import API from './api';

/**
 * Get all shows (optionally with query filters).
 * @param {Object} params
 */
export const getAllShows = async (params = {}) => {
  const response = await API.get('/shows', { params });
  return response.data;
};

/**
 * Get shows for a specific movie.
 * @param {string} movieId
 */
export const getShowsByMovie = async (movieId) => {
  const response = await API.get(`/shows/movie/${movieId}`);
  return response.data;
};

/**
 * Get a single show by its ID.
 * @param {string} id
 */
export const getShowById = async (id) => {
  const response = await API.get(`/shows/${id}`);
  return response.data;
};

/**
 * Get available seats for a show.
 * @param {string} showId
 */
export const getAvailableSeats = async (showId) => {
  const response = await API.get(`/shows/${showId}/seats`);
  return response.data;
};

/**
 * Create a new show (admin).
 * @param {Object} data
 */
export const createShow = async (data) => {
  const response = await API.post('/shows', data);
  return response.data;
};

/**
 * Update an existing show (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateShow = async (id, data) => {
  const response = await API.put(`/shows/${id}`, data);
  return response.data;
};

/**
 * Delete a show (admin).
 * @param {string} id
 */
export const deleteShow = async (id) => {
  const response = await API.delete(`/shows/${id}`);
  return response.data;
};
