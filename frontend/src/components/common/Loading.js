import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LocalMovies as LocalMoviesIcon } from '@mui/icons-material';

/**
 * Full-screen loading overlay with IMovies branding.
 */
const Loading = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={70} thickness={2} sx={{ color: '#e94560' }} />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocalMoviesIcon sx={{ color: '#e94560', fontSize: 30, animation: 'pulse 1.5s infinite' }} />
        </Box>
      </Box>
      <Typography variant="body1" sx={{ color: '#b0b0b0', letterSpacing: 1 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
