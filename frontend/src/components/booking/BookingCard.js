import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { movie, theatre, show, seats = [], totalAmount, status, createdAt, _id } = booking;

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await onCancel(_id);
      setOpenCancelDialog(false);
    } finally {
      setCancelling(false);
    }
  };

  const isCancellable = status === 'confirmed' || status === 'pending';

  return (
    <>
      <Card
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          backgroundColor: '#16213e',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          mb: 2.5,
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(233, 69, 96, 0.3)',
          },
        }}
      >
        {/* Movie Poster */}
        <Box
          sx={{
            width: { xs: '100%', sm: 150 },
            minWidth: { sm: 150 },
            height: { xs: 200, sm: 'auto' },
            bgcolor: '#0f172a',
            position: 'relative',
          }}
        >
          {movie?.posterUrl ? (
            <Box
              component="img"
              src={movie.posterUrl}
              alt={movie.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f3460, #e94560)',
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {movie?.title || 'IMovies'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Booking Details */}
        <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <div>
                <Typography variant="h6" fontWeight={700} color="#fff">
                  {movie?.title || 'Movie'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Booking ID: #{_id ? _id.slice(-8).toUpperCase() : 'N/A'} • Booked on {formatDate(createdAt)}
                </Typography>
              </div>
              <Chip
                label={status ? status.toUpperCase() : 'CONFIRMED'}
                size="small"
                sx={{
                  bgcolor: `${getStatusColor(status)}20`,
                  color: getStatusColor(status),
                  fontWeight: 700,
                  border: `1px solid ${getStatusColor(status)}`,
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'text.secondary', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#e94560' }} />
                <Typography variant="body2">{theatre?.name || 'Theatre'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: '#e94560' }} />
                <Typography variant="body2">{show?.date ? formatDate(show.date) : 'Show Date'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#e94560' }} />
                <Typography variant="body2">
                  {show?.startTime || 'Time'} (Screen {show?.screenNumber || 1})
                </Typography>
              </Box>
            </Box>

            {/* Booked Seats */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Seats:
              </Typography>
              {seats.map((s, idx) => (
                <Chip
                  key={idx}
                  label={s.seatNumber || s}
                  size="small"
                  sx={{ bgcolor: 'rgba(233, 69, 96, 0.15)', color: '#ff6b81', fontWeight: 600 }}
                />
              ))}
            </Box>
          </div>

          {/* Footer with Amount & Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <div>
              <Typography variant="caption" color="text.secondary">
                Total Paid
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#e94560">
                {formatCurrency(totalAmount)}
              </Typography>
            </div>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<QrCode2Icon />}
                onClick={() => navigate(`/booking/confirm/${_id}`)}
                sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
              >
                View Ticket
              </Button>
              {isCancellable && onCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelOutlinedIcon />}
                  onClick={() => setOpenCancelDialog(true)}
                  sx={{ borderColor: 'rgba(233, 69, 96, 0.4)' }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{
          sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.1)' },
        }}
      >
        <DialogTitle fontWeight={700}>Cancel Booking?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to cancel your booking for <strong>{movie?.title}</strong>? Your seats will be
            immediately released and your refund will be processed back to your original payment method.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCancelDialog(false)} sx={{ color: 'text.secondary' }}>
            Keep Booking
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingCard;
