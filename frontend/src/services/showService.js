import API from './api';
import { MOCK_MOVIES, MOCK_THEATRES, getMockGroupedTheatres } from '../utils/mockData';
import { getLocalDateString } from '../utils/helpers';

const generateDefaultShows = () => {
  const allShows = [];
  const todayStr = getLocalDateString(new Date());
  const activeMovies = MOCK_MOVIES.filter((m) => m.status === 'now_showing').slice(0, 10);

  activeMovies.forEach((movie) => {
    const grouped = getMockGroupedTheatres(movie._id, todayStr);
    grouped.forEach((g) => {
      if (Array.isArray(g.shows)) {
        allShows.push(...g.shows);
      }
    });
  });

  return allShows;
};

const getStoredShows = () => {
  try {
    const custom = JSON.parse(localStorage.getItem('imovies_custom_shows') || '[]');
    const defaults = generateDefaultShows();
    const map = new Map();
    defaults.forEach((s) => map.set(s._id, s));
    custom.forEach((s) => map.set(s._id, s));
    return Array.from(map.values());
  } catch {
    return generateDefaultShows();
  }
};

/**
 * Get all shows (optionally with query filters).
 * @param {Object} params
 */
export const getAllShows = async (params = {}) => {
  try {
    const response = await API.get('/shows', { params });
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data;
    }
    const all = getStoredShows();
    return { success: true, count: all.length, data: all };
  } catch (err) {
    const all = getStoredShows();
    return { success: true, count: all.length, data: all };
  }
};

/**
 * Get shows for a specific movie.
 * @param {string} movieId
 * @param {string} date
 */
export const getShowsByMovie = async (movieId, date) => {
  try {
    const params = date ? { date } : {};
    const response = await API.get(`/shows/movie/${movieId}`, { params });
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data;
    }
    const targetDate = date || getLocalDateString(new Date());
    const grouped = getMockGroupedTheatres(movieId, targetDate);
    return { success: true, data: grouped };
  } catch {
    const targetDate = date || getLocalDateString(new Date());
    const grouped = getMockGroupedTheatres(movieId, targetDate);
    return { success: true, data: grouped };
  }
};

/**
 * Get a single show by its ID.
 * @param {string} id
 */
export const getShowById = async (id) => {
  try {
    const response = await API.get(`/shows/${id}`);
    if (response.data?.data) return response.data;
    const all = getStoredShows();
    const found = all.find((s) => s._id === id);
    return { success: true, data: found || all[0] };
  } catch {
    const all = getStoredShows();
    const found = all.find((s) => s._id === id);
    return { success: true, data: found || all[0] };
  }
};

/**
 * Get available seats for a show.
 * @param {string} showId
 */
export const getAvailableSeats = async (showId) => {
  try {
    const response = await API.get(`/shows/${showId}/seats`);
    return response.data;
  } catch {
    return { success: true, data: {} };
  }
};

/**
 * Create a new show (admin).
 * @param {Object} data
 */
export const createShow = async (data) => {
  const newShow = {
    ...data,
    _id: 'show_' + Date.now().toString(36),
    status: 'active',
    availableSeats: 136,
    totalSeats: 150,
  };
  try {
    const response = await API.post('/shows', data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_shows') || '[]');
      custom.unshift(newShow);
      localStorage.setItem('imovies_custom_shows', JSON.stringify(custom));
    } catch {}
    return { success: true, data: newShow };
  }
};

/**
 * Update an existing show (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateShow = async (id, data) => {
  try {
    const response = await API.put(`/shows/${id}`, data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_shows') || '[]');
      const idx = custom.findIndex((s) => s._id === id);
      if (idx !== -1) {
        custom[idx] = { ...custom[idx], ...data };
      } else {
        custom.push({ ...data, _id: id });
      }
      localStorage.setItem('imovies_custom_shows', JSON.stringify(custom));
    } catch {}
    return { success: true, data: { _id: id, ...data } };
  }
};

/**
 * Delete a show (admin).
 * @param {string} id
 */
export const deleteShow = async (id) => {
  try {
    const response = await API.delete(`/shows/${id}`);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_shows') || '[]');
      const filtered = custom.filter((s) => s._id !== id);
      localStorage.setItem('imovies_custom_shows', JSON.stringify(filtered));
    } catch {}
    return { success: true, message: 'Show deleted successfully' };
  }
};
