import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getVerifiedPoster } from '../movies/MovieCard';

const BookingSummary = ({
  movie,
  theatre,
  show,
  selectedSeats = [],
  seatDetails = [],
  totalAmount = 0,
  onProceed,
  loading = false,
  buttonText = 'Proceed to Payment',
  disabled = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 20 : 0;
  const grandTotal = totalAmount + convenienceFee;
  const posterSrc = getVerifiedPoster(movie);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: '#16213e',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#fff' }}>
        Booking Summary
      </Typography>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Movie Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {posterSrc && !imgError ? (
          <Box
            component="img"
            src={posterSrc}
            alt={movie?.title}
            onError={() => setImgError(true)}
            sx={{ width: 60, height: 85, objectFit: 'cover', borderRadius: 1.5, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
          />
        ) : (
          <Box
            sx={{
              width: 60,
              height: 85,
              borderRadius: 1.5,
              bgcolor: '#0f3460',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MovieIcon sx={{ fontSize: 28, color: '#e94560' }} />
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="#fff" noWrap>
            {movie?.title || 'Selected Movie'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8, my: 0.5, flexWrap: 'wrap' }}>
            {movie?.certificate && (
              <Chip label={movie.certificate} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#e94560', color: '#fff' }} />
            )}
            {movie?.language && (
              <Chip label={movie.language} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Theatre & Timing Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#e94560' }} />
          <Typography variant="caption" noWrap fontWeight={600} color="#fff">
            {theatre?.name || 'PVR Cinemas'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: '#e94560' }} />
          <Typography variant="caption">
            {show?.date ? formatDate(show.date) : 'Today'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: '#e94560' }} />
          <Typography variant="caption">
            {show?.startTime || '05:00 PM'} (Screen {show?.screenNumber || 1})
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Selected Seats */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          SELECTED SEATS ({selectedSeats.length})
        </Typography>
        {selectedSeats.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {selectedSeats.map((seat) => (
              <Chip
                key={seat}
                label={seat}
                size="small"
                sx={{
                  bgcolor: '#e94560',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary" fontStyle="italic">
            No seats selected yet. Click on available seats in the map.
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Price Breakdown */}
      <List disablePadding sx={{ mb: 2 }}>
        <ListItem disableGutters sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography variant="caption" color="text.secondary">Ticket Total</Typography>}
          />
          <Typography variant="caption" fontWeight={600} color="#fff">
            {formatCurrency(totalAmount)}
          </Typography>
        </ListItem>
        <ListItem disableGutters sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography variant="caption" color="text.secondary">Convenience Fee (₹20/seat)</Typography>}
          />
          <Typography variant="caption" fontWeight={600} color="#fff">
            {formatCurrency(convenienceFee)}
          </Typography>
        </ListItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
        <ListItem disableGutters sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography variant="subtitle2" fontWeight={700} color="#fff">Grand Total</Typography>}
          />
          <Typography variant="h6" fontWeight={800} color="#e94560">
            {formatCurrency(grandTotal)}
          </Typography>
        </ListItem>
      </List>

      {/* CTA Button */}
      {!disabled && onProceed && (
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || selectedSeats.length === 0}
          startIcon={<ConfirmationNumberIcon />}
          onClick={onProceed}
          sx={{
            py: 1.4,
            fontWeight: 700,
            fontSize: '0.95rem',
            background: 'linear-gradient(45deg, #e94560, #ff6b81)',
            boxShadow: '0 4px 15px rgba(233, 69, 96, 0.4)',
          }}
        >
          {loading ? 'Processing...' : buttonText}
        </Button>
      )}
    </Paper>
  );
};

export default BookingSummary;
