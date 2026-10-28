import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  Drawer,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import MovieFilter from '../components/movies/MovieFilter';
import MovieGrid from '../components/movies/MovieGrid';
import SearchBar from '../components/common/SearchBar';
import { fetchMovies } from '../redux/slices/movieSlice';

const MoviesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { movies, loading, pagination } = useSelector((state) => state.movies);

  // Extract filter state from URL
  const filters = {
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') ? searchParams.get('genre').split(',') : '',
    language: searchParams.get('language') || '',
    status: searchParams.get('status') || '',
    certificate: searchParams.get('certificate') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  useEffect(() => {
    const params = {
      page: filters.page,
      limit: 12,
    };
    if (filters.search) params.search = filters.search;
    if (filters.language) params.language = filters.language;
    if (filters.status) params.status = filters.status;
    if (filters.certificate) params.certificate = filters.certificate;
    if (filters.sort) params.sort = filters.sort;
    if (Array.isArray(filters.genre) && filters.genre.length > 0) {
      params.genre = filters.genre.join(',');
    } else if (filters.genre) {
      params.genre = filters.genre;
    }

    dispatch(fetchMovies(params));
  }, [dispatch, searchParams]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (event, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', value.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header & Search */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#fff" gutterBottom>
          Explore Movies
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Browse all current and upcoming movie screenings in theatres near you
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
          </Box>
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{ borderColor: '#e94560', color: '#e94560', height: 44 }}
            >
              Filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Desktop Sidebar Filters */}
        {!isMobile && (
          <Grid item md={3.5} lg={3}>
            <Box sx={{ position: 'sticky', top: 90 }}>
              <MovieFilter
                filters={filters}
                onFilterChange={updateFilters}
                onResetFilters={handleResetFilters}
              />
            </Box>
          </Grid>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          PaperProps={{ sx: { width: 300, bgcolor: '#16213e', p: 2 } }}
        >
          <MovieFilter
            filters={filters}
            onFilterChange={(key, val) => {
              updateFilters(key, val);
            }}
            onResetFilters={() => {
              handleResetFilters();
              setMobileFilterOpen(false);
            }}
          />
        </Drawer>

        {/* Movies Grid */}
        <Grid item xs={12} md={8.5} lg={9}>
          <MovieGrid
            movies={movies}
            loading={loading}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': { color: '#fff' },
                  '& .Mui-selected': { bgcolor: '#e94560 !important', color: '#fff' },
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MoviesPage;
