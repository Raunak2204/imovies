import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '../../services/bookingService';
import { saveMockBooking, getMockBookingById, MOCK_MOVIES, MOCK_THEATRES } from '../../utils/mockData';

/* ── Async Thunks ── */

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue, getState }) => {
  try {
    const result = await bookingService.createBooking(data);
    const bookingRecord = result.data || result.booking || result;
    if (bookingRecord && bookingRecord._id) {
      saveMockBooking(bookingRecord);
    }
    return result;
  } catch (err) {
    // Graceful offline mock booking creation
    const state = getState();
    const currentShow = state.shows.currentShow;
    const user = state.auth.user || { name: 'Demo Guest', email: 'guest@imovies.com' };

    const bookingId = 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const mockBooking = {
      _id: bookingId,
      bookingNumber: bookingId,
      user,
      show: currentShow || {
        _id: data.showId,
        date: new Date().toISOString(),
        startTime: '05:00 PM',
        endTime: '07:45 PM',
        screenNumber: 1,
        price: { regular: 200, premium: 350, vip: 500 },
      },
      movie: currentShow?.movie || MOCK_MOVIES[0],
      theatre: currentShow?.theatre || MOCK_THEATRES[0],
      seats: data.seats.map((s) => ({
        seatNumber: s.seatNumber,
        seatType: ['A', 'B'].includes(s.seatNumber?.charAt(0)) ? 'vip' : ['C', 'D', 'E', 'F'].includes(s.seatNumber?.charAt(0)) ? 'premium' : 'regular',
        price: ['A', 'B'].includes(s.seatNumber?.charAt(0)) ? 500 : ['C', 'D', 'E', 'F'].includes(s.seatNumber?.charAt(0)) ? 350 : 200,
      })),
      totalAmount: data.seats.reduce((sum, s) => {
        const row = s.seatNumber?.charAt(0);
        return sum + (['A', 'B'].includes(row) ? 500 : ['C', 'D', 'E', 'F'].includes(row) ? 350 : 200);
      }, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveMockBooking(mockBooking);
    return { success: true, data: mockBooking };
  }
});

export const fetchBookingById = createAsyncThunk('bookings/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await bookingService.getBookingById(id);
    const booking = data.data || data.booking || data;
    if (!booking || !booking.movie) {
      return { data: getMockBookingById(id) };
    }
    return data;
  } catch (err) {
    return { data: getMockBookingById(id) };
  }
});

export const fetchUserBookings = createAsyncThunk('bookings/fetchUserBookings', async (_, { rejectWithValue }) => {
  let serverBookings = [];
  try {
    const data = await bookingService.getUserBookings();
    serverBookings = data.data || data.bookings || [];
  } catch (err) {
    // If server call fails, fallback gracefully
    console.warn('Server bookings unreachable, falling back to local storage');
  }

  // Always merge with local storage bookings to ensure no tickets ever disappear
  const localBookings = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');

  const map = new Map();
  // Add server bookings first
  serverBookings.forEach((b) => {
    const key = b._id || b.bookingNumber;
    if (key) map.set(key, b);
  });
  // Merge local bookings
  localBookings.forEach((b) => {
    const key = b._id || b.bookingNumber;
    if (key && !map.has(key)) {
      map.set(key, b);
    }
  });

  const combined = Array.from(map.values());
  // Sort latest first
  combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return { data: combined };
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const data = await bookingService.cancelBooking(id);
    // Update local storage too
    try {
      const stored = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      const updated = stored.map((b) => (b._id === id || b.bookingNumber === id ? { ...b, status: 'cancelled' } : b));
      localStorage.setItem('imovies_mock_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { id, ...data };
  } catch (err) {
    try {
      const stored = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      const updated = stored.map((b) => (b._id === id || b.bookingNumber === id ? { ...b, status: 'cancelled' } : b));
      localStorage.setItem('imovies_mock_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { id, success: true };
  }
});

export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const data = await bookingService.getAllBookings(params);
    return data;
  } catch (err) {
    const stored = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
    return { data: stored };
  }
});

/* ── Slice ── */

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]'),
    currentBooking: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    clearCurrentBooking(state) {
      state.currentBooking = null;
    },
    clearBookingError(state) {
      state.error = null;
    },
    markBookingConfirmed(state, action) {
      const bId = action.payload;
      if (state.currentBooking && (state.currentBooking._id === bId || state.currentBooking.bookingNumber === bId)) {
        state.currentBooking.status = 'confirmed';
      }
      state.bookings = state.bookings.map((b) =>
        b._id === bId || b.bookingNumber === bId ? { ...b, status: 'confirmed' } : b
      );

      // Sync local storage
      try {
        const stored = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
        const updated = stored.map((b) =>
          b._id === bId || b.bookingNumber === bId ? { ...b, status: 'confirmed' } : b
        );
        localStorage.setItem('imovies_mock_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* Create */
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        const b = action.payload.data || action.payload.booking || action.payload;
        state.currentBooking = b;
        if (b) {
          const key = b._id || b.bookingNumber;
          const exists = state.bookings.some((item) => (item._id || item.bookingNumber) === key);
          if (!exists) {
            state.bookings.unshift(b);
          }
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch By ID */
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data || action.payload.booking || action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch User Bookings */
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || action.payload.bookings || [];
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Cancel */
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentBooking && state.currentBooking._id === action.payload.id) {
          state.currentBooking.status = 'cancelled';
        }
        state.bookings = state.bookings.map((b) =>
          b._id === action.payload.id ? { ...b, status: 'cancelled' } : b
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBooking, clearBookingError, markBookingConfirmed } = bookingSlice.actions;
export default bookingSlice.reducer;
