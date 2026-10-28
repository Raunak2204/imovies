import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getVerifiedPoster } from '../movies/MovieCard';

const BookingConfirmation = ({ booking }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!booking) return null;

  const { movie, theatre, show, seats = [], totalAmount, _id, createdAt } = booking;
  const posterSrc = getVerifiedPoster(movie);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', py: 4 }}>
      {/* Success Badge */}
      <Box sx={{ textAlign: 'center', mb: 4 }} className="fade-in">
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#4caf50', mb: 1 }} />
        <Typography variant="h4" fontWeight={800} color="#fff">
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Your cinema seats have been confirmed and locked. E-ticket ready for gate entry.
        </Typography>
      </Box>

      {/* Cinema Ticket Card */}
      <Paper
        elevation={4}
        id="printable-ticket"
        sx={{
          backgroundColor: '#16213e',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          mb: 4,
        }}
      >
        {/* Ticket Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #e94560 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <div>
            <Typography variant="h5" fontWeight={800} color="#fff">
              🎬 IMOVIES OFFICIAL E-TICKET
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', letterSpacing: 0.5 }}>
              Booking Reference: #{_id ? _id.slice(-8).toUpperCase() : 'BK' + Date.now().toString(36).toUpperCase()}
            </Typography>
          </div>
          <Chip
            label="CONFIRMED"
            sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 800, px: 1.5, py: 0.5 }}
          />
        </Box>

        {/* Ticket Body */}
        <Box sx={{ p: 3.5 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Movie Poster & Quick Info */}
            <Grid item xs={12} sm={3.5}>
              {posterSrc && !imgError ? (
                <Box
                  component="img"
                  src={posterSrc}
                  alt={movie?.title || 'Movie'}
                  onError={() => setImgError(true)}
                  sx={{
                    width: '100%',
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '2/3',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#0f3460',
                    color: '#fff',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <MovieIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {movie?.title || 'Movie Ticket'}
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Movie Details */}
            <Grid item xs={12} sm={8.5}>
              <Typography variant="h5" fontWeight={800} color="#fff" gutterBottom>
                {movie?.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {movie?.certificate && <Chip label={movie.certificate} size="small" sx={{ bgcolor: '#e94560', color: '#fff' }} />}
                {movie?.language && <Chip label={movie.language} size="small" variant="outlined" />}
                {Array.isArray(movie?.genre) &&
                  movie.genre.map((g) => (
                    <Chip key={g} label={g} size="small" variant="outlined" />
                  ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: '#e94560' }} />
                  <Typography variant="body2" fontWeight={600} color="#fff">
                    {theatre?.name || 'PVR Cinemas'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon fontSize="small" sx={{ color: '#e94560' }} />
                  <Typography variant="body2">
                    {show?.date ? formatDate(show.date) : formatDate(createdAt || new Date())}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: '#e94560' }} />
                  <Typography variant="body2">
                    {show?.startTime || '05:00 PM'} • Screen {show?.screenNumber || 1}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Dotted Divider for Ticket Tear Look */}
          <Divider
            sx={{
              my: 3,
              borderColor: 'rgba(255, 255, 255, 0.12)',
              borderStyle: 'dashed',
            }}
          />

          {/* Seats, Amount & QR Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                SEATS RESERVED ({seats.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {seats.map((seat, index) => (
                  <Chip
                    key={index}
                    label={seat.seatNumber || seat}
                    sx={{
                      bgcolor: '#e94560',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                TOTAL AMOUNT PAID
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#e94560">
                {formatCurrency(totalAmount)}
              </Typography>
            </Grid>

            {/* QR Code Graphic */}
            <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-block',
                  p: 1.5,
                  bgcolor: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                <svg width="110" height="110" viewBox="0 0 100 100">
                  {/* Styled QR Code Pattern */}
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="25" height="25" fill="#1a1a2e" />
                  <rect x="14" y="14" width="17" height="17" fill="#ffffff" />
                  <rect x="18" y="18" width="9" height="9" fill="#1a1a2e" />
                  <rect x="65" y="10" width="25" height="25" fill="#1a1a2e" />
                  <rect x="69" y="14" width="17" height="17" fill="#ffffff" />
                  <rect x="73" y="18" width="9" height="9" fill="#1a1a2e" />
                  <rect x="10" y="65" width="25" height="25" fill="#1a1a2e" />
                  <rect x="14" y="69" width="17" height="17" fill="#ffffff" />
                  <rect x="18" y="73" width="9" height="9" fill="#1a1a2e" />
                  {/* Inner QR patterns */}
                  <rect x="42" y="15" width="8" height="8" fill="#1a1a2e" />
                  <rect x="52" y="25" width="8" height="8" fill="#1a1a2e" />
                  <rect x="42" y="38" width="18" height="6" fill="#1a1a2e" />
                  <rect x="15" y="45" width="15" height="8" fill="#1a1a2e" />
                  <rect x="35" y="50" width="10" height="10" fill="#1a1a2e" />
                  <rect x="65" y="45" width="20" height="8" fill="#1a1a2e" />
                  <rect x="50" y="65" width="8" height="18" fill="#1a1a2e" />
                  <rect x="65" y="65" width="12" height="10" fill="#1a1a2e" />
                  <rect x="75" y="80" width="15" height="10" fill="#1a1a2e" />
                </svg>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Scan at cinema gate entry
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            px: 3.5,
            py: 1.2,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #0f3460, #1a4a8a)',
          }}
        >
          Print / Download Ticket
        </Button>
        <Button
          variant="outlined"
          startIcon={<ConfirmationNumberIcon />}
          onClick={() => navigate('/my-bookings')}
          sx={{ px: 3, py: 1.2, borderColor: '#e94560', color: '#e94560', fontWeight: 600 }}
        >
          My Bookings
        </Button>
        <Button
          variant="text"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ color: '#fff', fontWeight: 600 }}
        >
          Book Another Movie
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
