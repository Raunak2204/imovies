import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TheatersIcon from '@mui/icons-material/Theaters';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SpeedIcon from '@mui/icons-material/Speed';

import HeroSlider from '../components/common/HeroSlider';
import MovieGrid from '../components/movies/MovieGrid';
import Loading from '../components/common/Loading';
import { fetchNowShowing, fetchComingSoon } from '../redux/slices/movieSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { nowShowing, comingSoon, loading } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchNowShowing());
    dispatch(fetchComingSoon());
  }, [dispatch]);

  const featuredMovies = nowShowing.length > 0 ? nowShowing.slice(0, 4) : [];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Carousel */}
      <HeroSlider movies={featuredMovies} />

      <Container maxWidth="xl" sx={{ mt: 6 }}>
        {/* Now Showing Section */}
        <Box sx={{ mb: 7 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <div>
              <Typography variant="h4" fontWeight={800} color="#fff" className="section-header">
                Now Showing
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Book seats for today's blockbuster releases
              </Typography>
            </div>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/movies?status=now_showing')}
              sx={{ color: '#e94560', fontWeight: 600 }}
            >
              Explore All
            </Button>
          </Box>

          <MovieGrid movies={nowShowing.slice(0, 8)} loading={loading && nowShowing.length === 0} />
        </Box>

        {/* Feature / Promotion Callout Banner */}
        <Paper
          elevation={3}
          sx={{
            my: 8,
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #e94560 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="overline" color="#ffd700" fontWeight={700} letterSpacing={2}>
                PREMIUM EXPERIENCE
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#fff" my={1}>
                Experience Cinema Like Never Before
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 650 }}>
                Immerse yourself with crystal-clear IMAX screens, Dolby Atmos spatial sound, and plush VIP recliner seating
                with contactless seat delivery.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<TheatersIcon />}
                onClick={() => navigate('/movies')}
                sx={{
                  bgcolor: '#fff',
                  color: '#1a1a2e',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#f0f0f0' },
                }}
              >
                Browse All Movies
              </Button>
            </Grid>
          </Grid>

          {/* Quick Perks Icons */}
          <Grid container spacing={3} sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <ConfirmationNumberIcon sx={{ color: '#ffd700' }} />
                <Typography variant="subtitle2" fontWeight={600} color="#fff">
                  Instant Instant Mobile E-Tickets
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <TheatersIcon sx={{ color: '#ffd700' }} />
                <Typography variant="subtitle2" fontWeight={600} color="#fff">
                  Real-Time Seat Booking
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: '#ffd700' }} />
                <Typography variant="subtitle2" fontWeight={600} color="#fff">
                  Hassle-Free 1-Click Cancellations
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <div>
                <Typography variant="h4" fontWeight={800} color="#fff" className="section-header">
                  Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Upcoming releases hitting screens in the coming weeks
                </Typography>
              </div>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/movies?status=coming_soon')}
                sx={{ color: '#e94560', fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>

            <MovieGrid movies={comingSoon.slice(0, 8)} loading={loading && comingSoon.length === 0} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
