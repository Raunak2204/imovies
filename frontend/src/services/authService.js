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
  let resData;
  try {
    const response = await API.post('/auth/register', userData);
    resData = response.data;
  } catch (err) {
    resData = {
      success: true,
      data: {
        user: {
          _id: 'usr_reg_' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          bookings: [],
        },
        token: 'mock_jwt_token_' + Date.now(),
      },
    };
  }

  // Ensure user is immediately saved to registered users store
  const newUser = resData?.data?.user || resData?.user || {
    _id: 'usr_reg_' + Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    role: 'user',
    createdAt: new Date().toISOString(),
    bookings: [],
  };

  try {
    const list = JSON.parse(localStorage.getItem('imovies_registered_users') || '[]');
    const filtered = list.filter((u) => u.email !== newUser.email);
    filtered.unshift(newUser);
    localStorage.setItem('imovies_registered_users', JSON.stringify(filtered));

    // Also remove from deleted users if previously deleted
    const deleted = JSON.parse(localStorage.getItem('imovies_deleted_users') || '[]');
    localStorage.setItem(
      'imovies_deleted_users',
      JSON.stringify(deleted.filter((e) => e !== newUser.email && e !== newUser._id))
    );
  } catch (e) {
    console.error(e);
  }

  return resData;
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

const DEFAULT_DEMO_USERS = [
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
  {
    _id: 'superadm_01',
    name: 'Super Admin',
    email: 'superadmin@imovies.com',
    phone: '+91-9876543211',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
    bookings: [],
  },
];

/**
 * Get all users for admin console with dynamic fallback and real-time registered users
 * @param {Object} params
 */
export const getAllUsers = async (params = {}) => {
  const registeredLocal = JSON.parse(localStorage.getItem('imovies_registered_users') || '[]');
  const storedBookings = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
  const deletedUsers = JSON.parse(localStorage.getItem('imovies_deleted_users') || '[]');

  let serverUsers = [];
  try {
    const response = await API.get('/auth/users', { params });
    serverUsers = response.data?.data || [];
  } catch (err) {
    serverUsers = [];
  }

  const userMap = new Map();

  // 1. Base demo users
  DEFAULT_DEMO_USERS.forEach((u) => userMap.set(u.email, { ...u }));

  // 2. Server users
  serverUsers.forEach((u) => {
    if (u.email) userMap.set(u.email, { ...u });
  });

  // 3. Local registered users (always take precedence for fresh registrations)
  registeredLocal.forEach((u) => {
    if (u.email) {
      const existing = userMap.get(u.email) || {};
      userMap.set(u.email, { ...existing, ...u });
    }
  });

  // 4. Dynamically calculate bookings made by each user from stored bookings
  storedBookings.forEach((b) => {
    const userEmail = b.user?.email;
    if (userEmail && userMap.has(userEmail)) {
      const u = userMap.get(userEmail);
      const alreadyHas = Array.isArray(u.bookings) && u.bookings.some((item) => (item._id || item.bookingNumber) === (b._id || b.bookingNumber));
      if (!alreadyHas) {
        u.bookings = [b, ...(u.bookings || [])];
      }
    }
  });

  // 5. Exclude deleted users
  let usersList = Array.from(userMap.values()).filter(
    (u) => !deletedUsers.includes(u._id) && !deletedUsers.includes(u.email)
  );

  if (params.role) {
    usersList = usersList.filter((u) => u.role === params.role);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    usersList = usersList.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }

  // Sort: newly registered first
  usersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    success: true,
    count: usersList.length,
    pagination: { totalResults: usersList.length, total: usersList.length, page: 1, limit: 100 },
    data: usersList,
  };
};

/**
 * Delete a user or admin (Super Admin can delete admins, normal admin can only delete users)
 * @param {string} userId
 * @param {string} userEmail
 */
export const deleteUser = async (userId, userEmail) => {
  try {
    await API.delete(`/auth/users/${userId}`);
  } catch (err) {
    console.warn('Backend delete unavailable, proceeding with local removal:', err.message);
  }

  // Update localStorage deleted list & registered list
  try {
    const deleted = JSON.parse(localStorage.getItem('imovies_deleted_users') || '[]');
    if (userId && !deleted.includes(userId)) deleted.push(userId);
    if (userEmail && !deleted.includes(userEmail)) deleted.push(userEmail);
    localStorage.setItem('imovies_deleted_users', JSON.stringify(deleted));

    const reg = JSON.parse(localStorage.getItem('imovies_registered_users') || '[]');
    localStorage.setItem(
      'imovies_registered_users',
      JSON.stringify(reg.filter((u) => u._id !== userId && u.email !== userEmail))
    );
  } catch (e) {
    console.error(e);
  }

  return { success: true, message: 'User deleted successfully' };
};

/**
 * Clear all non-superadmin users (Super Admin only)
 */
export const clearAllUsers = async () => {
  try {
    await API.delete('/auth/users/clear/all');
  } catch (err) {
    console.warn('Backend clear unavailable, proceeding with local clear:', err.message);
  }

  try {
    // Clear local registrations
    localStorage.removeItem('imovies_registered_users');

    // Mark demo non-superadmin users as deleted
    const allDemoIds = DEFAULT_DEMO_USERS
      .filter((u) => u.email !== 'superadmin@imovies.com')
      .map((u) => u.email);

    localStorage.setItem('imovies_deleted_users', JSON.stringify(allDemoIds));
  } catch (e) {
    console.error(e);
  }

  return { success: true, message: 'User database cleared successfully' };
};
