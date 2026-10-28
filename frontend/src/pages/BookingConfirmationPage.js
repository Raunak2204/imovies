import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';

import BookingConfirmation from '../components/booking/BookingConfirmation';
import Loading from '../components/common/Loading';
import { fetchBookingById } from '../redux/slices/bookingSlice';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();

  const { currentBooking, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId]);

  if (loading && !currentBooking) {
    return <Loading message="Loading your ticket confirmation..." />;
  }

  if (!currentBooking) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Booking record not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <BookingConfirmation booking={currentBooking} />
    </Container>
  );
};

export default BookingConfirmationPage;
