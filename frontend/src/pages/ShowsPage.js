import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ShowList from '../components/booking/ShowList';
import { fetchMovieById } from '../redux/slices/movieSlice';
import { fetchShowsByMovie } from '../redux/slices/showSlice';
import { getMockGroupedTheatres, MOCK_MOVIES } from '../utils/mockData';
import { getLocalDateString } from '../utils/helpers';

const generateDateTabs = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateStr: getLocalDateString(d),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return dates;
};

const ShowsPage = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dateTabs = useMemo(() => generateDateTabs(), []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const { currentMovie } = useSelector((state) => state.movies);
  const { shows: rawShows, loading } = useSelector((state) => state.shows);

  const selectedDateStr = dateTabs[selectedDateIndex]?.dateStr;

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieById(movieId));
      dispatch(fetchShowsByMovie({ movieId, date: selectedDateStr }));
    }
  }, [dispatch, movieId, selectedDateStr]);

  // Compute grouped theatres for the selected date
  const groupedTheatres = useMemo(() => {
    if (!rawShows || rawShows.length === 0) {
      return getMockGroupedTheatres(movieId, selectedDateStr);
    }

    // Check if rawShows is already grouped: [{ theatre, shows }]
    if (rawShows[0] && rawShows[0].theatre && Array.isArray(rawShows[0].shows)) {
      const firstShow = rawShows[0].shows[0];
      if (firstShow) {
        const firstShowDate = typeof firstShow.date === 'string' ? firstShow.date.split('T')[0] : getLocalDateString(firstShow.date);
        if (firstShowDate !== selectedDateStr) {
          return getMockGroupedTheatres(movieId, selectedDateStr);
        }
      }
      return rawShows;
    }

    // Otherwise, rawShows is a flat list of Show documents
    const filteredShows = rawShows.filter((s) => {
      if (!s.date) return true;
      const sDateStr = typeof s.date === 'string' ? s.date.split('T')[0] : getLocalDateString(s.date);
      return sDateStr === selectedDateStr;
    });

    if (filteredShows.length === 0) {
      return getMockGroupedTheatres(movieId, selectedDateStr);
    }

    const groupMap = {};
    filteredShows.forEach((show) => {
      const t = show.theatre;
      if (!t) return;
      const tKey = t._id || t.name;
      if (!groupMap[tKey]) {
        groupMap[tKey] = { theatre: t, shows: [] };
      }
      groupMap[tKey].shows.push(show);
    });

    const groups = Object.values(groupMap);
    return groups.length > 0 ? groups : getMockGroupedTheatres(movieId, selectedDateStr);
  }, [rawShows, movieId, selectedDateStr]);

  const movie = currentMovie || MOCK_MOVIES.find((m) => m._id === movieId) || MOCK_MOVIES[0];

  useEffect(() => {
    if (movie && movie.title) {
      try {
        sessionStorage.setItem('imovies_selected_movie', JSON.stringify(movie));
      } catch {}
    }
  }, [movie]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/movies/${movieId}`)}
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        Back to Movie
      </Button>

      {/* Header with Movie Title */}
      {movie && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#16213e',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} color="#fff">
              {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {movie.status === 'coming_soon' && (
                <Chip label="COMING SOON" size="small" sx={{ bgcolor: '#e94560', color: '#fff', fontWeight: 800 }} />
              )}
              {movie.certificate && (
                <Chip label={movie.certificate} size="small" sx={{ bgcolor: '#0f3460', color: '#fff', fontWeight: 'bold' }} />
              )}
              {movie.language && (
                <Chip label={movie.language} size="small" variant="outlined" />
              )}
              {Array.isArray(movie.genre) &&
                movie.genre.map((g) => (
                  <Chip key={g} label={g} size="small" variant="outlined" />
                ))}
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary">
              {movie.status === 'coming_soon' ? 'Advance bookings not open yet' : 'Select date & theatre to reserve seats'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* If movie is Coming Soon, show informative banner instead of booking flow */}
      {movie?.status === 'coming_soon' ? (
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#16213e',
            borderRadius: 3,
            border: '1px solid rgba(233, 69, 96, 0.3)',
          }}
        >
          <Chip
            label="COMING SOON TO CINEMAS"
            sx={{ bgcolor: 'rgba(233, 69, 96, 0.15)', color: '#ff6b81', fontWeight: 800, mb: 2 }}
          />
          <Typography variant="h5" fontWeight={800} color="#fff" mb={1.5}>
            Advance Booking Not Open Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto" mb={3}>
            Tickets for <strong>{movie.title}</strong> are not available for booking yet as the movie is scheduled for an upcoming release. Please check back closer to the theatrical release date.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/movies')}
              sx={{ background: 'linear-gradient(45deg, #e94560, #ff6b81)', fontWeight: 700 }}
            >
              Explore Now Showing Movies
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/movies/${movie._id}`)}
              sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              View Movie Details
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          {/* Date Tabs */}
          <Paper
            sx={{
              bgcolor: '#16213e',
              borderRadius: 3,
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Tabs
              value={selectedDateIndex}
              onChange={(e, val) => setSelectedDateIndex(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#e94560', height: 3 },
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  py: 2,
                  minWidth: 110,
                  '&.Mui-selected': { color: '#e94560', fontWeight: 'bold' },
                },
              }}
            >
              {dateTabs.map((item) => (
                <Tab
                  key={item.dateStr}
                  label={
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        {item.dayName}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.formatted}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>

          {/* Showtimes List for All 4 Cinema Halls */}
          <ShowList groupedTheatres={groupedTheatres} loading={loading && groupedTheatres.length === 0} />
        </>
      )}
    </Container>
  );
};

export default ShowsPage;
