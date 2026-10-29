import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getProfile } from './redux/slices/authSlice';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowsPage from './pages/ShowsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import AdminTheatresPage from './pages/AdminTheatresPage';
import AdminShowsPage from './pages/AdminShowsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminUsersPage from './pages/AdminUsersPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e94560',
      light: '#ff6b81',
      dark: '#c23152',
    },
    secondary: {
      main: '#0f3460',
      light: '#1a4a8a',
      dark: '#0a2340',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#e94560',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #e94560, #ff6b81)',
          '&:hover': {
            background: 'linear-gradient(45deg, #c23152, #e94560)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#16213e',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/shows/:movieId" element={<ShowsPage />} />
            <Route path="/booking/:showId" element={<SeatSelectionPage />} />
            <Route path="/booking/confirm/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <AdminRoute>
                  <AdminMoviesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/theatres"
              element={
                <AdminRoute>
                  <AdminTheatresPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shows"
              element={
                <AdminRoute>
                  <AdminShowsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookingsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
