import API from './api';

/**
 * Get all movies with optional query params (pagination, filters).
 * @param {Object} params - { page, limit, genre, language, search, sortBy }
 */
export const getAllMovies = async (params = {}) => {
  const response = await API.get('/movies', { params });
  return response.data;
};

/**
 * Get a single movie by its ID.
 * @param {string} id
 */
export const getMovieById = async (id) => {
  const response = await API.get(`/movies/${id}`);
  return response.data;
};

/**
 * Get movies currently showing.
 */
export const getNowShowing = async () => {
  const response = await API.get('/movies/now-showing');
  return response.data;
};

/**
 * Get upcoming movies.
 */
export const getComingSoon = async () => {
  const response = await API.get('/movies/coming-soon');
  return response.data;
};

/**
 * Create a new movie (admin).
 * @param {Object} data
 */
export const createMovie = async (data) => {
  const response = await API.post('/movies', data);
  return response.data;
};

/**
 * Update an existing movie (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateMovie = async (id, data) => {
  const response = await API.put(`/movies/${id}`, data);
  return response.data;
};

/**
 * Delete a movie (admin).
 * @param {string} id
 */
export const deleteMovie = async (id) => {
  const response = await API.delete(`/movies/${id}`);
  return response.data;
};
