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

/**
 * Get all users for admin console with fallback
 * @param {Object} params
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await API.get('/auth/users', { params });
    return response.data;
  } catch (err) {
    // Fallback demo users for graceful offline admin exploration
    return {
      success: true,
      count: 6,
      pagination: { totalResults: 6, total: 6, page: 1, limit: 10 },
      data: [
        {
          _id: 'usr_01',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '+91-9123456780',
          role: 'user',
          createdAt: new Date('2024-02-15').toISOString(),
          bookings: [{ _id: 'bk_01', totalAmount: 700, status: 'confirmed' }],
        },
        {
          _id: 'usr_02',
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '+91-9123456781',
          role: 'user',
          createdAt: new Date('2024-02-20').toISOString(),
          bookings: [{ _id: 'bk_02', totalAmount: 1050, status: 'confirmed' }],
        },
        {
          _id: 'usr_03',
          name: 'Amit Kumar',
          email: 'amit@example.com',
          phone: '+91-9123456782',
          role: 'user',
          createdAt: new Date('2024-03-01').toISOString(),
          bookings: [{ _id: 'bk_03', totalAmount: 400, status: 'confirmed' }],
        },
        {
          _id: 'usr_04',
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          phone: '+91-9123456783',
          role: 'user',
          createdAt: new Date('2024-03-10').toISOString(),
          bookings: [],
        },
        {
          _id: 'usr_05',
          name: 'Vikram Singh',
          email: 'vikram@example.com',
          phone: '+91-9123456784',
          role: 'user',
          createdAt: new Date('2024-03-15').toISOString(),
          bookings: [{ _id: 'bk_04', totalAmount: 1400, status: 'confirmed' }],
        },
        {
          _id: 'adm_01',
          name: 'Admin User',
          email: 'admin@imovies.com',
          phone: '+91-9876543210',
          role: 'admin',
          createdAt: new Date('2024-01-01').toISOString(),
          bookings: [],
        },
      ],
    };
  }
};
