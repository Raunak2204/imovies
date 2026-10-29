import API from './api';
import { MOCK_MOVIES } from '../utils/mockData';

const sanitizeMovie = (movie) => {
  if (!movie) return movie;
  const titleNorm = (movie.title || '').trim().toLowerCase();
  const cleanTitle = titleNorm.replace(/[^a-z0-9]/g, '');
  const verified = MOCK_MOVIES.find((m) => {
    const mTitle = (m.title || '').trim().toLowerCase();
    if (mTitle === titleNorm) return true;
    const cleanM = mTitle.replace(/[^a-z0-9]/g, '');
    return cleanTitle && cleanM && (cleanTitle === cleanM || cleanTitle.includes(cleanM) || cleanM.includes(cleanTitle));
  });
  if (verified) {
    return {
      ...movie,
      posterUrl: verified.posterUrl || movie.posterUrl,
      bannerUrl: verified.bannerUrl || movie.bannerUrl,
      language: (movie.language === 'English' && verified.language !== 'English') ? verified.language : (movie.language || verified.language),
    };
  }
  return movie;
};

const getStoredMovies = () => {
  try {
    const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
    const statusOverrides = JSON.parse(localStorage.getItem('imovies_movie_status_overrides') || '{}');
    const map = new Map();
    MOCK_MOVIES.forEach((m) => map.set(m._id, m));
    custom.forEach((m) => map.set(m._id, sanitizeMovie(m)));

    return Array.from(map.values()).map((m) => {
      const sanitized = sanitizeMovie(m);
      if (statusOverrides[sanitized._id] || (sanitized.title && statusOverrides[sanitized.title.toLowerCase()])) {
        sanitized.status = statusOverrides[sanitized._id] || statusOverrides[sanitized.title.toLowerCase()];
      }
      return sanitized;
    });
  } catch {
    return MOCK_MOVIES;
  }
};

/**
 * Get all movies with optional query params (pagination, filters).
 * @param {Object} params - { page, limit, genre, language, search, sortBy }
 */
export const getAllMovies = async (params = {}) => {
  const statusOverrides = JSON.parse(localStorage.getItem('imovies_movie_status_overrides') || '{}');
  const applyOverrides = (movie) => {
    const sanitized = sanitizeMovie(movie);
    if (statusOverrides[sanitized._id] || (sanitized.title && statusOverrides[sanitized.title.toLowerCase()])) {
      sanitized.status = statusOverrides[sanitized._id] || statusOverrides[sanitized.title.toLowerCase()];
    }
    return sanitized;
  };

  try {
    const response = await API.get('/movies', { params });
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      // Merge with MOCK_MOVIES so all catalog titles (including Coming Soon) are guaranteed to appear
      const map = new Map();
      MOCK_MOVIES.forEach((m) => map.set(m.title.toLowerCase(), m));
      response.data.data.forEach((m) => map.set(m.title.toLowerCase(), m));
      const custom = JSON.parse(localStorage.getItem('imovies_custom_movies') || '[]');
      custom.forEach((m) => map.set(m.title?.toLowerCase() || m._id, m));

      let merged = Array.from(map.values()).map(applyOverrides);
      if (params.status) {
        merged = merged.filter((m) => m.status === params.status);
      }
      return {
        ...response.data,
        count: merged.length,
        data: merged,
      };
    }
    let all = getStoredMovies();
    if (params.status) {
      all = all.filter((m) => m.status === params.status);
    }
    return { success: true, count: all.length, data: all };
  } catch {
    let all = getStoredMovies();
    if (params.status) {
      all = all.filter((m) => m.status === params.status);
    }
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
    if (response.data && response.data.data) {
      return { ...response.data, data: sanitizeMovie(response.data.data) };
    }
    return response.data;
  } catch {
    const all = getStoredMovies();
    const movie = all.find((m) => m._id === id || m.title?.toLowerCase() === id?.toLowerCase()) || all[0];
    return { success: true, data: sanitizeMovie(movie) };
  }
};

/**
 * Get movies currently showing.
 */
export const getNowShowing = async () => {
  try {
    const response = await API.get('/movies/now-showing');
    if (response.data?.data?.length > 0) {
      return {
        ...response.data,
        data: response.data.data.map(sanitizeMovie),
      };
    }
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
    if (response.data?.data?.length > 0) {
      return {
        ...response.data,
        data: response.data.data.map(sanitizeMovie),
      };
    }
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
  // Save status override if status is changed
  if (data.status) {
    try {
      const overrides = JSON.parse(localStorage.getItem('imovies_movie_status_overrides') || '{}');
      overrides[id] = data.status;
      if (data.title) overrides[data.title.toLowerCase()] = data.status;
      localStorage.setItem('imovies_movie_status_overrides', JSON.stringify(overrides));
    } catch {}
  }

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
        const base = MOCK_MOVIES.find((m) => m._id === id || m.title?.toLowerCase() === data.title?.toLowerCase());
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
