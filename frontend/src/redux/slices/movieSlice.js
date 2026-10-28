import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as movieService from '../../services/movieService';
import { MOCK_MOVIES } from '../../utils/mockData';

/* ── Async Thunks ── */

export const fetchMovies = createAsyncThunk('movies/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const data = await movieService.getAllMovies(params);
    const movies = data.data || data.movies || [];
    if (movies.length === 0) {
      return { data: MOCK_MOVIES, total: MOCK_MOVIES.length };
    }
    return data;
  } catch (err) {
    return { data: MOCK_MOVIES, total: MOCK_MOVIES.length };
  }
});

export const fetchMovieById = createAsyncThunk('movies/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await movieService.getMovieById(id);
    const movie = data.data || data.movie || data;
    if (!movie || !movie.title) {
      const fallback = MOCK_MOVIES.find((m) => m._id === id) || MOCK_MOVIES[0];
      return { data: fallback };
    }
    return data;
  } catch (err) {
    const fallback = MOCK_MOVIES.find((m) => m._id === id) || MOCK_MOVIES[0];
    return { data: fallback };
  }
});

export const fetchNowShowing = createAsyncThunk('movies/fetchNowShowing', async (_, { rejectWithValue }) => {
  try {
    const data = await movieService.getNowShowing();
    const movies = data.data || data.movies || [];
    if (movies.length === 0) {
      const fallback = MOCK_MOVIES.filter((m) => m.status === 'now_showing');
      return { data: fallback.length > 0 ? fallback : MOCK_MOVIES.slice(0, 7) };
    }
    return data;
  } catch (err) {
    const fallback = MOCK_MOVIES.filter((m) => m.status === 'now_showing');
    return { data: fallback.length > 0 ? fallback : MOCK_MOVIES.slice(0, 7) };
  }
});

export const fetchComingSoon = createAsyncThunk('movies/fetchComingSoon', async (_, { rejectWithValue }) => {
  try {
    const data = await movieService.getComingSoon();
    const movies = data.data || data.movies || [];
    if (movies.length === 0) {
      const fallback = MOCK_MOVIES.filter((m) => m.status === 'coming_soon');
      return { data: fallback.length > 0 ? fallback : MOCK_MOVIES.slice(7) };
    }
    return data;
  } catch (err) {
    const fallback = MOCK_MOVIES.filter((m) => m.status === 'coming_soon');
    return { data: fallback.length > 0 ? fallback : MOCK_MOVIES.slice(7) };
  }
});

/* ── Slice ── */

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: MOCK_MOVIES,
    currentMovie: null,
    nowShowing: MOCK_MOVIES.filter((m) => m.status === 'now_showing'),
    comingSoon: MOCK_MOVIES.filter((m) => m.status === 'coming_soon'),
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: MOCK_MOVIES.length,
      totalPages: 1,
    },
  },
  reducers: {
    clearCurrentMovie(state) {
      state.currentMovie = null;
    },
    clearMovieError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch All */
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        const fetched = action.payload.data || action.payload.movies || [];
        state.movies = fetched.length > 0 ? fetched : MOCK_MOVIES;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        } else {
          state.pagination.total = state.movies.length;
          state.pagination.totalPages = Math.ceil(state.movies.length / state.pagination.limit);
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (state.movies.length === 0) {
          state.movies = MOCK_MOVIES;
        }
      })

      /* Fetch By ID */
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload.data || action.payload.movie || action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch Now Showing */
      .addCase(fetchNowShowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNowShowing.fulfilled, (state, action) => {
        state.loading = false;
        const fetched = action.payload.data || action.payload.movies || [];
        state.nowShowing = fetched.length > 0 ? fetched : MOCK_MOVIES.filter((m) => m.status === 'now_showing');
      })
      .addCase(fetchNowShowing.rejected, (state) => {
        state.loading = false;
        state.nowShowing = MOCK_MOVIES.filter((m) => m.status === 'now_showing');
      })

      /* Fetch Coming Soon */
      .addCase(fetchComingSoon.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComingSoon.fulfilled, (state, action) => {
        state.loading = false;
        const fetched = action.payload.data || action.payload.movies || [];
        state.comingSoon = fetched.length > 0 ? fetched : MOCK_MOVIES.filter((m) => m.status === 'coming_soon');
      })
      .addCase(fetchComingSoon.rejected, (state) => {
        state.loading = false;
        state.comingSoon = MOCK_MOVIES.filter((m) => m.status === 'coming_soon');
      });
  },
});

export const { clearCurrentMovie, clearMovieError } = movieSlice.actions;
export default movieSlice.reducer;
