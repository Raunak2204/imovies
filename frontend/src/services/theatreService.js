import API from './api';
import { MOCK_THEATRES } from '../utils/mockData';

const getStoredTheatres = () => {
  try {
    const custom = JSON.parse(localStorage.getItem('imovies_custom_theatres') || '[]');
    const map = new Map();
    MOCK_THEATRES.forEach((t) => map.set(t._id, t));
    custom.forEach((t) => map.set(t._id, t));
    return Array.from(map.values());
  } catch {
    return MOCK_THEATRES;
  }
};

/**
 * Get all theatres with optional query params.
 * @param {Object} params - { page, limit, city, search }
 */
export const getAllTheatres = async (params = {}) => {
  try {
    const response = await API.get('/theatres', { params });
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      // Merge with mock theatres so certified cinema halls always appear
      const map = new Map();
      MOCK_THEATRES.forEach((t) => map.set(t._id, t));
      response.data.data.forEach((t) => map.set(t._id || t.name, t));
      const custom = JSON.parse(localStorage.getItem('imovies_custom_theatres') || '[]');
      custom.forEach((t) => map.set(t._id, t));
      const combined = Array.from(map.values());
      return {
        ...response.data,
        count: combined.length,
        data: combined,
      };
    }
    const all = getStoredTheatres();
    return { success: true, count: all.length, data: all };
  } catch (err) {
    const all = getStoredTheatres();
    return { success: true, count: all.length, data: all };
  }
};

/**
 * Get a single theatre by its ID.
 * @param {string} id
 */
export const getTheatreById = async (id) => {
  try {
    const response = await API.get(`/theatres/${id}`);
    if (response.data?.data) return response.data;
    const all = getStoredTheatres();
    const found = all.find((t) => t._id === id || t.name?.toLowerCase() === id?.toLowerCase());
    return { success: true, data: found || all[0] };
  } catch {
    const all = getStoredTheatres();
    const found = all.find((t) => t._id === id || t.name?.toLowerCase() === id?.toLowerCase());
    return { success: true, data: found || all[0] };
  }
};

/**
 * Create a new theatre (admin).
 * @param {Object} data
 */
export const createTheatre = async (data) => {
  const newTheatre = {
    ...data,
    _id: 'theatre_' + Date.now().toString(36),
    isActive: true,
  };
  try {
    const response = await API.post('/theatres', data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_theatres') || '[]');
      custom.unshift(newTheatre);
      localStorage.setItem('imovies_custom_theatres', JSON.stringify(custom));
    } catch {}
    return { success: true, data: newTheatre };
  }
};

/**
 * Update an existing theatre (admin).
 * @param {string} id
 * @param {Object} data
 */
export const updateTheatre = async (id, data) => {
  try {
    const response = await API.put(`/theatres/${id}`, data);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_theatres') || '[]');
      const idx = custom.findIndex((t) => t._id === id);
      if (idx !== -1) {
        custom[idx] = { ...custom[idx], ...data };
      } else {
        custom.push({ ...data, _id: id });
      }
      localStorage.setItem('imovies_custom_theatres', JSON.stringify(custom));
    } catch {}
    return { success: true, data: { _id: id, ...data } };
  }
};

/**
 * Delete a theatre (admin).
 * @param {string} id
 */
export const deleteTheatre = async (id) => {
  try {
    const response = await API.delete(`/theatres/${id}`);
    return response.data;
  } catch {
    try {
      const custom = JSON.parse(localStorage.getItem('imovies_custom_theatres') || '[]');
      const filtered = custom.filter((t) => t._id !== id);
      localStorage.setItem('imovies_custom_theatres', JSON.stringify(filtered));
    } catch {}
    return { success: true, message: 'Theatre deleted successfully' };
  }
};
