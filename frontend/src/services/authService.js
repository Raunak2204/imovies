import API from './api';

/**
 * Authenticate user with email and password.
 * @param {{ email: string, password: string }} credentials
 */
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user account.
 * @param {{ name: string, email: string, phone: string, password: string }} userData
 */
export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

/**
 * Get the authenticated user's profile.
 */
export const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

/**
 * Update user profile information.
 * @param {{ name?: string, email?: string, phone?: string }} data
 */
export const updateProfile = async (data) => {
  const response = await API.put('/auth/profile', data);
  return response.data;
};

/**
 * Change the authenticated user's password.
 * @param {{ currentPassword: string, newPassword: string }} data
 */
export const changePassword = async (data) => {
  const response = await API.put('/auth/change-password', data);
  return response.data;
};

/**
 * Logout the current user (server-side token invalidation if supported).
 */
export const logout = async () => {
  try {
    await API.post('/auth/logout');
  } catch {
    // Logout is best-effort; always clear local state
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
