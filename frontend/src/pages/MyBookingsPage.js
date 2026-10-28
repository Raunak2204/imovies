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
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BookingCard from '../components/booking/BookingCard';
import Loading from '../components/common/Loading';
import { fetchUserBookings, cancelBooking } from '../redux/slices/bookingSlice';

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

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 1) return b.status === 'confirmed';
    if (filterTab === 2) return b.status === 'cancelled';
    return true; // All
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#fff" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track upcoming movie shows, download digital tickets, or manage cancellations
        </Typography>
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
          <Tab label={`All Bookings (${bookings.length})`} />
          <Tab
            label={`Confirmed (${bookings.filter((b) => b.status === 'confirmed').length})`}
          />
          <Tab
            label={`Cancelled (${bookings.filter((b) => b.status === 'cancelled').length})`}
          />
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
