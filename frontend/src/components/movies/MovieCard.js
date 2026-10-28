import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MovieIcon from '@mui/icons-material/Movie';
import { formatDuration } from '../../utils/helpers';
import { MOCK_MOVIES } from '../../utils/mockData';

export const getVerifiedPoster = (movie) => {
  if (!movie) return '';
  const matched = MOCK_MOVIES.find(
    (m) => m.title?.toLowerCase() === movie.title?.toLowerCase()
  );
  if (matched && matched.posterUrl) {
    return matched.posterUrl;
  }
  return movie.posterUrl || '';
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const posterSrc = getVerifiedPoster(movie);

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/shows/${movie._id}`);
  };

  const handleCardClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <Card
      className="movie-card-hover"
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        backgroundColor: '#16213e',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(233, 69, 96, 0.3)',
        },
      }}
    >
      <Box sx={{ position: 'relative', pt: '142%', width: '100%', bgcolor: '#0f172a' }}>
        {posterSrc && !imgError ? (
          <CardMedia
            component="img"
            image={posterSrc}
            alt={movie.title}
            onError={() => setImgError(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #e94560 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2.5,
              textAlign: 'center',
            }}
          >
            <MovieIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.7)', mb: 1.5 }} />
            <Typography variant="h6" fontWeight="bold" color="#fff" sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              {movie.title}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.8)" mt={1}>
              {movie.language || 'English'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ffd700', mt: 0.5, fontWeight: 700 }}>
              ★ {movie.averageRating || movie.rating || '8.5'}/10
            </Typography>
          </Box>
        )}

        {/* Certificate Badge */}
        {movie.certificate && (
          <Chip
            label={movie.certificate}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: '#fff',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
            }}
          />
        )}

        {/* Rating Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(22, 33, 62, 0.95), transparent)',
            p: 1.5,
            pt: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={800} color="#ffd700">
              ★ {movie.averageRating ? movie.averageRating.toFixed(1) : (movie.rating || 8.5)}
            </Typography>
            {movie.totalReviews && (
              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                ({movie.totalReviews})
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.7)' }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">{formatDuration(movie.duration)}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Card Body */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          color="#fff"
          noWrap
          title={movie.title}
          sx={{ mb: 0.8 }}
        >
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 1.2 }}>
          {Array.isArray(movie.genre) &&
            movie.genre.slice(0, 2).map((g) => (
              <Chip
                key={g}
                label={g}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  color: 'text.secondary',
                }}
              />
            ))}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.82rem',
            lineHeight: 1.4,
          }}
        >
          {movie.description}
        </Typography>
      </CardContent>

      {/* Card Action */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size="small"
          startIcon={<ConfirmationNumberIcon />}
          onClick={handleBookNow}
          sx={{
            background: 'linear-gradient(45deg, #e94560, #ff6b81)',
            fontWeight: 700,
            py: 0.9,
          }}
        >
          Book Tickets
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
