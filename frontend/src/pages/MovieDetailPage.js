import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import MovieDetail from '../components/movies/MovieDetail';
import ShowList from '../components/booking/ShowList';
import Loading from '../components/common/Loading';
import { fetchMovieById } from '../redux/slices/movieSlice';
import { fetchShowsByMovie } from '../redux/slices/showSlice';
import { formatDate, getLocalDateString } from '../utils/helpers';
import { getMockGroupedTheatres } from '../utils/mockData';

// Helper to generate next 7 days tabs
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

const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dateTabs = useMemo(() => generateDateTabs(), []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const selectedDateStr = dateTabs[selectedDateIndex]?.dateStr;

  const { currentMovie, loading: movieLoading } = useSelector((state) => state.movies);
  const { shows: rawShows, loading: showsLoading } = useSelector((state) => state.shows);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
      dispatch(fetchShowsByMovie({ movieId: id, date: selectedDateStr }));
    }
  }, [dispatch, id, selectedDateStr]);

  const groupedTheatres = useMemo(() => {
    if (!rawShows || rawShows.length === 0) {
      return getMockGroupedTheatres(id, selectedDateStr);
    }

    if (rawShows[0] && rawShows[0].theatre && Array.isArray(rawShows[0].shows)) {
      const firstShow = rawShows[0].shows[0];
      if (firstShow) {
        const firstShowDate = typeof firstShow.date === 'string' ? firstShow.date.split('T')[0] : getLocalDateString(firstShow.date);
        if (firstShowDate !== selectedDateStr) {
          return getMockGroupedTheatres(id, selectedDateStr);
        }
      }
      return rawShows;
    }

    const filteredShows = rawShows.filter((s) => {
      if (!s.date) return true;
      const sDateStr = typeof s.date === 'string' ? s.date.split('T')[0] : getLocalDateString(s.date);
      return sDateStr === selectedDateStr;
    });

    if (filteredShows.length === 0) {
      return getMockGroupedTheatres(id, selectedDateStr);
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
    return groups.length > 0 ? groups : getMockGroupedTheatres(id, selectedDateStr);
  }, [rawShows, id, selectedDateStr]);

  const handleDateChange = (event, newIndex) => {
    setSelectedDateIndex(newIndex);
  };

  if (movieLoading && !currentMovie) {
    return <Loading message="Loading movie details..." />;
  }

  if (!currentMovie) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Movie not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Movie Details Component */}
      <MovieDetail movie={currentMovie} />

      {/* Available Showtimes Section */}
      {currentMovie.status !== 'coming_soon' && (
        <Box sx={{ mt: 6 }} id="showtimes-section">
          <Typography variant="h4" fontWeight={800} color="#fff" className="section-header">
            Select Showtimes
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1} mb={3}>
            Choose a date and your preferred cinema location
          </Typography>

          {/* Date Selector Tabs */}
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
              onChange={handleDateChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#e94560', height: 3 },
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  py: 2,
                  minWidth: 100,
                  '&.Mui-selected': { color: '#e94560', fontWeight: 'bold' },
                },
              }}
            >
              {dateTabs.map((item, idx) => (
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

          {/* Showtimes List */}
          <ShowList groupedTheatres={groupedTheatres} loading={showsLoading} />
        </Box>
      )}
    </Container>
  );
};

export default MovieDetailPage;
