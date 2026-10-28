import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import MovieCard from './MovieCard';
import Loading from '../common/Loading';

const MovieGrid = ({ movies = [], loading = false, onResetFilters }) => {
  if (loading) {
    return <Loading message="Loading movies..." />;
  }

  if (!movies || movies.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <MovieFilterIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          No movies found
        </Typography>
        <Typography variant="body2" color="text.secondary" maxWidth={400}>
          We couldn't find any movies matching your current filters or search criteria.
        </Typography>
        {onResetFilters && (
          <Button variant="outlined" color="primary" onClick={onResetFilters} sx={{ mt: 1 }}>
            Reset Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieGrid;
