import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BookingCard from '../components/booking/BookingCard';
import Loading from '../components/common/Loading';
import { fetchUserBookings, cancelBooking } from '../redux/slices/bookingSlice';

/**
 * Check if the movie show timing has already ended/passed
 */
export const isBookingExpired = (booking) => {
  if (!booking?.show) return false;
  try {
    const show = booking.show;
    const dateStr = show.date ? (typeof show.date === 'string' ? show.date.split('T')[0] : new Date(show.date).toISOString().split('T')[0]) : '';
    if (!dateStr) return false;

    const timeStr = show.endTime || show.startTime || '11:59 PM';
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);

    const showDate = new Date(dateStr);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = (match[3] || 'PM').toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      showDate.setHours(hours, minutes, 0, 0);
    } else {
      showDate.setHours(23, 59, 59, 999);
    }

    return showDate.getTime() < Date.now();
  } catch {
    return false;
  }
};

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterTab, setFilterTab] = useState(0);

  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      toast.success('Booking cancelled successfully and seats released');
      dispatch(fetchUserBookings());
    } catch (err) {
      toast.error(err || 'Failed to cancel booking');
    }
  };

  const handleClearPastTickets = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      const activeOnly = stored.filter((b) => !isBookingExpired(b));
      localStorage.setItem('imovies_mock_bookings', JSON.stringify(activeOnly));
      toast.success('Past and expired show tickets cleared from your history');
      dispatch(fetchUserBookings());
    } catch (err) {
      toast.error('Failed to clear tickets');
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && !isBookingExpired(b));
  const pastBookings = bookings.filter((b) => b.status !== 'cancelled' && isBookingExpired(b));
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 0) return b.status !== 'cancelled' && !isBookingExpired(b); // Upcoming
    if (filterTab === 1) return b.status !== 'cancelled' && isBookingExpired(b); // Past / Expired
    if (filterTab === 2) return b.status === 'cancelled'; // Cancelled
    return true; // All
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <div>
          <Typography variant="h4" fontWeight={800} color="#fff" gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upcoming show tickets remain active until movie timing ends, then automatically move to past shows.
          </Typography>
        </div>

        {pastBookings.length > 0 && filterTab === 1 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearPastTickets}
            sx={{ textTransform: 'none' }}
          >
            Clear All Past Tickets
          </Button>
        )}
      </Box>

      {/* Filter Tabs */}
      <Paper
        elevation={2}
        sx={{
          bgcolor: '#16213e',
          borderRadius: 3,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Tabs
          value={filterTab}
          onChange={(e, val) => setFilterTab(val)}
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#e94560' },
            '& .MuiTab-root': {
              color: 'text.secondary',
              fontWeight: 600,
              py: 2,
              '&.Mui-selected': { color: '#e94560' },
            },
          }}
        >
          <Tab label={`Upcoming (${upcomingBookings.length})`} />
          <Tab label={`Past Shows (${pastBookings.length})`} />
          <Tab label={`Cancelled (${cancelledBookings.length})`} />
          <Tab label={`All Bookings (${bookings.length})`} />
        </Tabs>
      </Paper>

      {/* Content */}
      {loading && bookings.length === 0 ? (
        <Loading message="Loading your cinema bookings..." />
      ) : filteredBookings.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: '#16213e',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <ConfirmationNumberIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.4, mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto" mb={3}>
            You haven't made any bookings in this category yet. Explore the latest blockbuster movies and pick your seats!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/movies')}
            sx={{
              background: 'linear-gradient(45deg, #e94560, #ff6b81)',
              fontWeight: 700,
              px: 3,
            }}
          >
            Browse Movies
          </Button>
        </Paper>
      ) : (
        <Box>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyBookingsPage;
