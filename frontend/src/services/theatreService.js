import API from './api';

/**
 * Get all theatres with optional query params.
 * @param {Object} params - { page, limit, city, search }
 */
export const getAllTheatres = async (params = {}) => {
  const response = await API.get('/theatres', { params });
  return response.data;
};

/**
 * Get a single theatre by its ID.
 * @param {string} id
 */
export const getTheatreById = async (id) => {
  const response = await API.get(`/theatres/${id}`);
  return response.data;
};

/**
 * Create a new theatre (admin).
 * @param {Object} data
 */
export const createTheatre = async (data) => {
  const response = await API.post('/theatres', data);
  return response.data;
};

/**
 * Update an existing theatre (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateTheatre = async (id, data) => {
  const response = await API.put(`/theatres/${id}`, data);
  return response.data;
};

/**
 * Delete a theatre (admin).
 * @param {string} id
 */
export const deleteTheatre = async (id) => {
  const response = await API.delete(`/theatres/${id}`);
  return response.data;
};
