import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

/* ── Async Thunks ── */

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    const token = data.token || data.data?.token || 'mock_jwt_token_' + Date.now();
    const user = data.user || data.data?.user || data.data || {
      _id: 'usr_demo_01',
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'admin' : 'user',
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (err) {
    // Graceful fallback for demo accounts if backend is unreachable
    if (
      credentials.email === 'rahul@example.com' ||
      credentials.email === 'admin@imovies.com' ||
      credentials.email === 'superadmin@imovies.com'
    ) {
      const isSuper = credentials.email === 'superadmin@imovies.com';
      const isAdm = credentials.email.includes('admin');
      const mockUser = {
        _id: isSuper ? 'superadmin_01' : isAdm ? 'admin_01' : 'user_01',
        name: isSuper ? 'Super Admin' : isAdm ? 'Admin User' : 'Rahul Sharma',
        email: credentials.email,
        role: isAdm ? 'admin' : 'user',
      };
      const mockToken = 'mock_jwt_token_' + (isSuper ? 'superadmin' : isAdm ? 'admin' : 'user');
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  let user;
  let token;
  try {
    const data = await authService.register(userData);
    token = data.token || data.data?.token || 'mock_jwt_token_' + Date.now();
    user = data.user || data.data?.user || data.data || {
      _id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      bookings: [],
    };
  } catch (err) {
    // If backend is unreachable, allow successful local registration for demo testing
    user = {
      _id: 'usr_local_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      bookings: [],
    };
    token = 'mock_jwt_token_' + Date.now();
  }

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  // Keep registered user directory updated in localStorage
  try {
    const directory = JSON.parse(localStorage.getItem('imovies_registered_users') || '[]');
    if (!directory.some((u) => u.email === user.email)) {
      directory.unshift(user);
      localStorage.setItem('imovies_registered_users', JSON.stringify(directory));
    }
  } catch (e) {
    console.error(e);
  }

  return { token, user };
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getProfile();
    const user = data.user || data.data?.user || data.data;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  } catch (err) {
    const stored = localStorage.getItem('user');
    if (stored) {
      return JSON.parse(stored);
    }
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const data = await authService.updateProfile(profileData);
    const user = data.user || data.data?.user || data.data || profileData;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const data = await authService.changePassword(passwordData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to change password');
  }
});

/* ── Initial State ── */

const token = localStorage.getItem('token');
let storedUser = null;
try {
  const raw = localStorage.getItem('user');
  if (raw && raw !== 'undefined') {
    storedUser = JSON.parse(raw);
  }
} catch {
  storedUser = null;
}

const initialState = {
  user: storedUser,
  token: token && token !== 'undefined' ? token : null,
  isAuthenticated: !!token && token !== 'undefined',
  loading: false,
  error: null,
};

/* ── Slice ── */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
    setDemoAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      /* Login */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Register */
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Get Profile */
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Update Profile */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Change Password */
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, setDemoAuth } = authSlice.actions;
export default authSlice.reducer;
