import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TheatersIcon from '@mui/icons-material/Theaters';
import { toast } from 'react-toastify';

import SeatMap from '../components/booking/SeatMap';
import BookingSummary from '../components/booking/BookingSummary';
import Loading from '../components/common/Loading';
import { fetchShowById, fetchAvailableSeats } from '../redux/slices/showSlice';
import { createBooking } from '../redux/slices/bookingSlice';
import { getMockShowById, generateMockSeatMap } from '../utils/mockData';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { currentShow: reduxShow, loading: showLoading } = useSelector((state) => state.shows);
  const { loading: bookingLoading } = useSelector((state) => state.bookings);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [localSeatMap, setLocalSeatMap] = useState({});

  // Resolve current show: reduxShow or mock fallback
  const currentShow = reduxShow && reduxShow.theatre ? reduxShow : getMockShowById(showId);

  // Fetch show details
  useEffect(() => {
    if (showId) {
      dispatch(fetchShowById(showId));
      dispatch(fetchAvailableSeats(showId)).then((res) => {
        if (res.payload?.seatMap) {
          const mapObj =
            res.payload.seatMap instanceof Map
              ? Object.fromEntries(res.payload.seatMap)
              : res.payload.seatMap;
          setLocalSeatMap(mapObj);
        } else if (res.payload?.data && typeof res.payload.data === 'object') {
          setLocalSeatMap(res.payload.data);
        } else {
          setLocalSeatMap(generateMockSeatMap(10, 15));
        }
      });
    }
  }, [dispatch, showId]);

  // Update local seat map when currentShow updates
  useEffect(() => {
    if (currentShow?.seatMap) {
      const mapObj =
        currentShow.seatMap instanceof Map
          ? Object.fromEntries(currentShow.seatMap)
          : currentShow.seatMap;
      if (Object.keys(mapObj).length > 0) {
        setLocalSeatMap(mapObj);
      }
    } else if (Object.keys(localSeatMap).length === 0) {
      setLocalSeatMap(generateMockSeatMap(10, 15));
    }
  }, [currentShow]);

  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        toast.warning('Maximum 10 seats allowed per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Calculate pricing based on seat type
  const calculateTotal = () => {
    const prices = currentShow?.price || { regular: 200, premium: 350, vip: 500 };

    return selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0);
      if (['A', 'B'].includes(row)) return sum + (prices.vip || 500);
      if (['C', 'D', 'E', 'F'].includes(row)) return sum + (prices.premium || 350);
      return sum + (prices.regular || 200);
    }, 0);
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      toast.info('Please select at least one seat to proceed');
      return;
    }

    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with booking');
      navigate('/login', { state: { from: `/booking/${showId}` } });
      return;
    }

    try {
      const payload = {
        showId,
        seats: selectedSeats.map((s) => ({ seatNumber: s })),
      };

      const result = await dispatch(createBooking(payload)).unwrap();
      const bookingRecord = result.data || result.booking || result;
      const bId = bookingRecord._id || bookingRecord.bookingNumber || 'BK' + Date.now();
      toast.success('Seats reserved! Proceeding to payment.');
      navigate(`/payment/${bId}`);
    } catch (err) {
      toast.error(err || 'Failed to reserve seats. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        Back to Showtimes
      </Button>

      {/* Screen & Movie Info Bar */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          mb: 4,
          backgroundColor: '#16213e',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TheatersIcon sx={{ fontSize: 36, color: '#e94560' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="#fff">
              {currentShow?.movie?.title || 'Selected Movie'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentShow?.theatre?.name || 'Cinema Hall'} • Screen {currentShow?.screenNumber || 1} • {currentShow?.startTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700, bgcolor: 'rgba(76, 175, 80, 0.1)', px: 1.5, py: 0.6, borderRadius: 2 }}>
            ● LIVE SEAT AVAILABILITY ACTIVE
          </Typography>
        </Box>
      </Paper>

      {/* Seat Selection & Summary Grid */}
      <Grid container spacing={4}>
        {/* Cinema Seat Layout */}
        <Grid item xs={12} lg={8.5}>
          <SeatMap
            seatMap={localSeatMap}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            prices={currentShow?.price || { regular: 200, premium: 350, vip: 500 }}
          />
        </Grid>

        {/* Booking Summary Sidebar */}
        <Grid item xs={12} lg={3.5}>
          <Box sx={{ position: 'sticky', top: 90 }}>
            <BookingSummary
              movie={currentShow?.movie}
              theatre={currentShow?.theatre}
              show={currentShow}
              selectedSeats={selectedSeats}
              totalAmount={calculateTotal()}
              onProceed={handleProceedToPayment}
              loading={bookingLoading}
              buttonText="Proceed to Payment"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatSelectionPage;
