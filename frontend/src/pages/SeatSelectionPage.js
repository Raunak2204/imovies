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
import { isShowPassed } from '../utils/helpers';

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

  const buildConsolidatedSeatMap = (rawSeatData) => {
    let mapObj = {};

    if (rawSeatData?.seatMap) {
      mapObj =
        rawSeatData.seatMap instanceof Map
          ? Object.fromEntries(rawSeatData.seatMap)
          : { ...rawSeatData.seatMap };
    } else if (rawSeatData?.data?.seats) {
      // Backend structured response { seats: { available: [...], booked: [...], blocked: [...] } }
      const { available = [], booked = [], blocked = [] } = rawSeatData.data.seats;
      available.forEach((s) => (mapObj[s] = 'available'));
      booked.forEach((s) => (mapObj[s] = 'booked'));
      blocked.forEach((s) => (mapObj[s] = 'blocked'));
    } else if (rawSeatData && typeof rawSeatData === 'object' && !rawSeatData.showId) {
      mapObj = { ...rawSeatData };
    } else {
      mapObj = generateMockSeatMap(10, 15);
    }

    // Merge in any seats booked for this showId to ensure slot is filled
    try {
      const storedBookings = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      storedBookings.forEach((b) => {
        const bShowId = b.show?._id || b.show || b.showId;
        if ((bShowId === showId || String(bShowId) === String(showId)) && b.status !== 'cancelled') {
          (b.seats || []).forEach((st) => {
            const seatCode = st.seatNumber || st;
            if (seatCode) mapObj[seatCode] = 'booked';
          });
        }
      });

      const explicitlyBooked = JSON.parse(localStorage.getItem('imovies_booked_seats_' + showId) || '[]');
      explicitlyBooked.forEach((seatCode) => {
        if (seatCode) mapObj[seatCode] = 'booked';
      });
    } catch (e) {
      console.error('Error merging booked seats:', e);
    }

    return mapObj;
  };

  // Fetch show details
  useEffect(() => {
    if (showId) {
      dispatch(fetchShowById(showId));
      dispatch(fetchAvailableSeats(showId)).then((res) => {
        const map = buildConsolidatedSeatMap(res.payload);
        setLocalSeatMap(map);
      });
    }
  }, [dispatch, showId]);

  // Update local seat map when currentShow updates
  useEffect(() => {
    if (currentShow?.movie) {
      try {
        sessionStorage.setItem('imovies_selected_movie', JSON.stringify(currentShow.movie));
      } catch {}
    }
    if (currentShow?.seatMap) {
      const map = buildConsolidatedSeatMap(currentShow);
      setLocalSeatMap(map);
    } else if (Object.keys(localSeatMap).length === 0) {
      setLocalSeatMap(buildConsolidatedSeatMap(null));
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
    if (currentShow?.movie?.status === 'coming_soon') {
      toast.error('Bookings for Coming Soon movies are not permitted');
      return;
    }

    if (isShowPassed(currentShow?.date, currentShow?.startTime)) {
      toast.error('This show has already started or ended. You cannot book past showtimes.');
      return;
    }

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
      // Immediately fill the slots locally so seats cannot be re-selected
      try {
        const key = 'imovies_booked_seats_' + showId;
        const currentBooked = JSON.parse(localStorage.getItem(key) || '[]');
        const updatedBooked = Array.from(new Set([...currentBooked, ...selectedSeats]));
        localStorage.setItem(key, JSON.stringify(updatedBooked));

        setLocalSeatMap((prev) => {
          const updated = { ...prev };
          selectedSeats.forEach((s) => {
            updated[s] = 'booked';
          });
          return updated;
        });
      } catch (e) {
        console.error(e);
      }

      const payload = {
        showId,
        show: currentShow,
        movie: currentShow?.movie,
        theatre: currentShow?.theatre,
        seats: selectedSeats.map((s) => ({ seatNumber: s })),
        totalAmount: calculateTotal(),
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

      {/* Alert if show has passed or movie is coming soon */}
      {isShowPassed(currentShow?.date, currentShow?.startTime) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          This showtime ({currentShow?.startTime}) has already concluded or started. You cannot book tickets for past showtimes.
        </Alert>
      )}
      {currentShow?.movie?.status === 'coming_soon' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This film is Coming Soon. Advance ticket booking is not open yet.
        </Alert>
      )}

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
