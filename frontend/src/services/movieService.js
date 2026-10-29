import API from './api';
import { MOCK_MOVIES } from '../utils/mockData';

const getStoredMovies = () => {
  try {
    const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
    const map = new Map();
    MOCK_MOVIES.forEach((m) => map.set(m._id, m));
    custom.forEach((m) => map.set(m._id, m));
    return Array.from(map.values());
  } catch {
    return MOCK_MOVIES;
  }
};

/**
 * Get all movies with optional query params (pagination, filters).
 * @param {Object} params - { page, limit, genre, language, search, sortBy }
 */
export const getAllMovies = async (params = {}) => {
  try {
    const response = await API.get('/movies', { params });
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data;
    }
    const all = getStoredMovies();
    return { success: true, count: all.length, data: all };
  } catch {
    const all = getStoredMovies();
    return { success: true, count: all.length, data: all };
  }
};

/**
 * Get a single movie by its ID.
 * @param {string} id
 */
export const getMovieById = async (id) => {
  try {
    const response = await API.get(`/movies/${id}`);
    return response.data;
  } catch {
    const all = getStoredMovies();
    const movie = all.find((m) => m._id === id || m.title?.toLowerCase() === id?.toLowerCase()) || all[0];
    return { success: true, data: movie };
  }
};

/**
 * Get movies currently showing.
 */
export const getNowShowing = async () => {
  try {
    const response = await API.get('/movies/now-showing');
    if (response.data?.data?.length > 0) return response.data;
    const all = getStoredMovies();
    return { success: true, data: all.filter((m) => m.status === 'now_showing') };
  } catch {
    const all = getStoredMovies();
    return { success: true, data: all.filter((m) => m.status === 'now_showing') };
  }
};

/**
 * Get upcoming movies.
 */
export const getComingSoon = async () => {
  try {
    const response = await API.get('/movies/coming-soon');
    if (response.data?.data?.length > 0) return response.data;
    const all = getStoredMovies();
    return { success: true, data: all.filter((m) => m.status === 'coming_soon') };
  } catch {
    const all = getStoredMovies();
    return { success: true, data: all.filter((m) => m.status === 'coming_soon') };
  }
};

/**
 * Create a new movie (admin).
 * @param {Object} data
 */
export const createMovie = async (data) => {
  const newMovie = {
    ...data,
    _id: 'movie_' + Date.now().toString(36),
    rating: data.rating || 8.0,
    averageRating: data.rating || 8.0,
  };

  try {
    const response = await API.post('/movies', data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
      custom.unshift(newMovie);
      localStorage.setItem('imovies_custom_movies', JSON.stringify(custom));
    } catch {}
    return { success: true, data: newMovie };
  }
};

/**
 * Update an existing movie (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateMovie = async (id, data) => {
  try {
    const response = await API.put(`/movies/${id}`, data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
      const existingIdx = custom.findIndex((m) => m._id === id);
      if (existingIdx !== -1) {
        custom[existingIdx] = { ...custom[existingIdx], ...data };
      } else {
        const base = MOCK_MOVIES.find((m) => m._id === id);
        custom.push({ ...(base || {}), _id: id, ...data });
      }
      localStorage.setItem('imovies_custom_movies', JSON.stringify(custom));
    } catch {}
    return { success: true, data: { _id: id, ...data } };
  }
};

/**
 * Delete a movie (admin).
 * @param {string} id
 */
export const deleteMovie = async (id) => {
  try {
    const response = await API.delete(`/movies/${id}`);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
      localStorage.setItem('imovies_custom_movies', JSON.stringify(custom.filter((m) => m._id !== id)));
    } catch {}
    return { success: true, message: 'Movie deleted' };
  }
};
