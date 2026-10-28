import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MOCK_MOVIES } from '../../utils/mockData';

const HeroSlider = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // Use passed movies or fallback to high-quality MOCK_MOVIES
  const slides = movies.length > 0 ? movies.slice(0, 5) : MOCK_MOVIES.slice(0, 5);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const goTo = (index) => setCurrent(index);

  return (
    <Box
      className="hero-slider"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '55vh', sm: '65vh', md: '75vh' },
        overflow: 'hidden',
        bgcolor: '#0a0f1d',
      }}
    >
      {slides.map((slide, index) => {
        const backgroundImageUrl =
          slide.bannerUrl ||
          slide.posterUrl ||
          slide.poster ||
          MOCK_MOVIES[index % MOCK_MOVIES.length]?.bannerUrl ||
          MOCK_MOVIES[index % MOCK_MOVIES.length]?.posterUrl;

        return (
          <Box
            key={slide._id || index}
            className={`hero-slide ${index === current ? 'active' : 'inactive'}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: backgroundImageUrl
                ? `linear-gradient(to right, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.7) 45%, rgba(26,26,46,0.3) 100%), linear-gradient(to top, rgba(26,26,46,1) 0%, transparent 60%), url(${backgroundImageUrl})`
                : 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #e94560 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.8s ease-in-out',
              opacity: index === current ? 1 : 0,
              pointerEvents: index === current ? 'auto' : 'none',
            }}
          >
            <Box sx={{ maxWidth: 680, ml: { xs: 3, sm: 6, md: 10 }, zIndex: 2, pr: 3 }}>
              {/* Badges */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label="PREMIERE"
                  size="small"
                  sx={{ bgcolor: '#e94560', color: '#fff', fontWeight: 800, fontSize: '0.72rem' }}
                />
                {slide.certificate && (
                  <Chip
                    label={slide.certificate}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
                  />
                )}
                <Typography variant="caption" sx={{ color: '#ffd700', fontWeight: 800, ml: 1 }}>
                  ★ {slide.averageRating || slide.rating || '8.8'}/10
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                variant="h2"
                fontWeight={900}
                color="#fff"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem', md: '3.8rem' },
                  lineHeight: 1.1,
                  mb: 2,
                  textShadow: '0 4px 16px rgba(0,0,0,0.8)',
                }}
              >
                {slide.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  mb: 3.5,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.9rem', md: '1.05rem' },
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  maxWidth: 600,
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
              >
                {slide.description}
              </Typography>

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ConfirmationNumberIcon />}
                  onClick={() => navigate(`/shows/${slide._id || MOCK_MOVIES[0]._id}`)}
                  sx={{
                    px: 4,
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                    boxShadow: '0 6px 25px rgba(233, 69, 96, 0.5)',
                  }}
                >
                  Book Tickets
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<InfoOutlinedIcon />}
                  onClick={() => navigate(`/movies/${slide._id || MOCK_MOVIES[0]._id}`)}
                  sx={{
                    px: 3,
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    color: '#fff',
                    fontWeight: 600,
                    backdropFilter: 'blur(6px)',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Movie Details
                </Button>
              </Box>
            </Box>
          </Box>
        );
      })}

      {/* Slider Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1.2,
          zIndex: 3,
        }}
      >
        {slides.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => goTo(index)}
            sx={{
              width: index === current ? 32 : 12,
              height: 10,
              borderRadius: 5,
              bgcolor: index === current ? '#e94560' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              p: 0,
              minWidth: 0,
              '&:hover': { bgcolor: index === current ? '#e94560' : 'rgba(255,255,255,0.6)' },
            }}
          />
        ))}
      </Box>

      {/* Bottom gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: 'linear-gradient(transparent, #1a1a2e)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default HeroSlider;
