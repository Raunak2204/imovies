import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const ShowList = ({ groupedTheatres = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading available cinema halls and showtimes...</Typography>
      </Box>
    );
  }

  if (!groupedTheatres || groupedTheatres.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: '#16213e',
          borderRadius: 3,
        }}
      >
        <MovieFilterIcon sx={{ fontSize: 50, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
        <Typography variant="h6" color="text.secondary">
          No shows available for the selected date
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Try selecting another date or check back later for new schedules.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {groupedTheatres.map((group, idx) => {
        const theatre = group.theatre || {};
        const shows = group.shows || [];

        return (
          <Paper
            key={theatre._id || theatre.name || idx}
            elevation={3}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              backgroundColor: '#16213e',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(233, 69, 96, 0.3)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            {/* Theatre Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" fontWeight={800} color="#fff">
                    {theatre.name}
                  </Typography>
                  <Chip
                    label="Certified Cinema"
                    size="small"
                    sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary', mt: 0.8 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: '#e94560' }} />
                  <Typography variant="body2">
                    {theatre.location?.address || theatre.location?.city || theatre.location || 'Cinema Complex'}
                  </Typography>
                </Box>
              </Box>

              {/* Amenities */}
              {Array.isArray(theatre.amenities) && theatre.amenities.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', maxWidth: 450 }}>
                  {theatre.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.12)',
                        color: 'text.secondary',
                        fontSize: '0.72rem',
                        bgcolor: 'rgba(255,255,255,0.02)',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Showtimes Grid */}
            <Box sx={{ mt: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, mb: 1.5, display: 'block' }}>
                Available Showtimes & Screens:
              </Typography>

              <Grid container spacing={2}>
                {shows.map((show) => {
                  const regularPrice = show.price?.regular || (typeof show.price === 'number' ? show.price : 200);
                  const availableCount = show.availableSeats != null ? show.availableSeats : 120;

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={show._id}>
                      <Box
                        onClick={() => navigate(`/booking/${show._id}`)}
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          border: '1px solid rgba(233, 69, 96, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#e94560',
                            backgroundColor: 'rgba(233, 69, 96, 0.08)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 20px rgba(233, 69, 96, 0.25)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" fontWeight={800} color="#e94560">
                            {show.startTime}
                          </Typography>
                          <Chip
                            label={`Screen ${show.screenNumber || 1}`}
                            size="small"
                            sx={{ bgcolor: '#0f3460', color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5, color: 'text.secondary' }}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">Ends around {show.endTime || 'Show finish'}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            From <strong style={{ color: '#fff' }}>₹{regularPrice}</strong>
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: availableCount > 20 ? '#4caf50' : '#ff9800',
                              fontWeight: 700,
                            }}
                          >
                            {availableCount} seats left
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          startIcon={<ConfirmationNumberIcon sx={{ fontSize: 16 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/booking/${show._id}`);
                          }}
                          sx={{
                            background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                            fontWeight: 700,
                            borderRadius: 1.5,
                          }}
                        >
                          Select Seats
                        </Button>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ShowList;
