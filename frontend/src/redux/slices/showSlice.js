import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as showService from '../../services/showService';
import { getMockGroupedTheatres, getMockShowById } from '../../utils/mockData';

/* ── Async Thunks ── */

export const fetchShowsByMovie = createAsyncThunk('shows/fetchByMovie', async (arg, { rejectWithValue }) => {
  try {
    const movieId = typeof arg === 'string' ? arg : arg?.movieId;
    const date = typeof arg === 'object' ? arg?.date : undefined;
    const data = await showService.getShowsByMovie(movieId, date);
    const shows = data.data || data.shows || [];
    if (!shows || shows.length === 0) {
      return { data: getMockGroupedTheatres(movieId, date) };
    }
    return data;
  } catch (err) {
    const movieId = typeof arg === 'string' ? arg : arg?.movieId;
    const date = typeof arg === 'object' ? arg?.date : undefined;
    return { data: getMockGroupedTheatres(movieId, date) };
  }
});

export const fetchShowById = createAsyncThunk('shows/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await showService.getShowById(id);
    const show = data.data || data.show || data;
    if (!show || !show.theatre) {
      return { data: getMockShowById(id) };
    }
    return data;
  } catch (err) {
    return { data: getMockShowById(id) };
  }
});

export const fetchAvailableSeats = createAsyncThunk('shows/fetchSeats', async (showId, { rejectWithValue }) => {
  try {
    const data = await showService.getAvailableSeats(showId);
    return data;
  } catch (err) {
    const mockShow = getMockShowById(showId);
    return { data: mockShow.seatMap, seatMap: mockShow.seatMap };
  }
});

/* ── Slice ── */

const showSlice = createSlice({
  name: 'shows',
  initialState: {
    shows: [],
    currentShow: null,
    availableSeats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentShow(state) {
      state.currentShow = null;
      state.availableSeats = [];
    },
    clearShowError(state) {
      state.error = null;
    },
    updateSeatAvailability(state, action) {
      const { seatId, status } = action.payload;
      const seat = state.availableSeats.find((s) => s._id === seatId || s.seatNumber === seatId);
      if (seat) {
        seat.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch By Movie */
      .addCase(fetchShowsByMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowsByMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.data || action.payload.shows || [];
      })
      .addCase(fetchShowsByMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch By ID */
      .addCase(fetchShowById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShow = action.payload.data || action.payload.show || action.payload;
      })
      .addCase(fetchShowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch Available Seats */
      .addCase(fetchAvailableSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSeats = action.payload.data || action.payload.seats || action.payload.seatMap || [];
      })
      .addCase(fetchAvailableSeats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCurrentShow, clearShowError, updateSeatAvailability } = showSlice.actions;
export default showSlice.reducer;
