import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Rating,
  Button,
  Grid,
  Avatar,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
import MovieIcon from '@mui/icons-material/Movie';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatDate, formatDuration } from '../../utils/helpers';
import { getVerifiedPoster } from './MovieCard';

export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
};

const MovieDetail = ({ movie }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (!movie) return null;

  const posterSrc = getVerifiedPoster(movie);

  return (
    <Box sx={{ mb: 6 }}>
      {/* Hero Banner / Poster Section */}
      <Paper
        elevation={4}
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: '#16213e',
          p: { xs: 2.5, sm: 4, md: 5 },
          backgroundImage: 'linear-gradient(135deg, rgba(22, 33, 62, 0.95) 0%, rgba(15, 52, 96, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Movie Poster */}
          <Grid item xs={12} sm={4} md={3.5}>
            <Box
              sx={{
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
                aspectRatio: '2/3',
                bgcolor: '#0a0f1d',
                position: 'relative',
              }}
            >
              {posterSrc && !imgError ? (
                <img
                  src={posterSrc}
                  alt={movie.title}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f3460 0%, #e94560 100%)',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <MovieIcon sx={{ fontSize: 60, mb: 1, opacity: 0.8 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {movie.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                    {movie.language || 'English'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Movie Meta Information */}
          <Grid item xs={12} sm={8} md={8.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
              {movie.certificate && (
                <Chip
                  label={movie.certificate}
                  size="small"
                  sx={{ bgcolor: '#e94560', color: '#fff', fontWeight: 'bold' }}
                />
              )}
              {movie.status === 'now_showing' ? (
                <Chip label="Now Showing" color="success" size="small" variant="outlined" />
              ) : (
                <Chip label="Coming Soon" color="warning" size="small" variant="outlined" />
              )}
            </Box>

            <Typography variant="h3" component="h1" fontWeight={800} sx={{ mb: 1.5, color: '#fff' }}>
              {movie.title}
            </Typography>

            {/* Ratings */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Rating
                value={movie.averageRating ? movie.averageRating / 2 : 4.5}
                precision={0.5}
                readOnly
              />
              <Typography variant="h6" fontWeight="bold" color="#ffd700">
                {movie.averageRating ? movie.averageRating.toFixed(1) : (movie.rating || '8.5')}
                <Typography component="span" variant="body2" color="text.secondary">
                  /10
                </Typography>
              </Typography>
              {movie.totalReviews > 0 && (
                <Typography variant="body2" color="text.secondary">
                  ({movie.totalReviews} user ratings)
                </Typography>
              )}
            </Box>

            {/* Quick Details Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3, color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <AccessTimeIcon fontSize="small" sx={{ color: '#e94560' }} />
                <Typography variant="body2">{formatDuration(movie.duration)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <LanguageIcon fontSize="small" sx={{ color: '#e94560' }} />
                <Typography variant="body2">{movie.language}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CalendarMonthIcon fontSize="small" sx={{ color: '#e94560' }} />
                <Typography variant="body2">
                  Released {formatDate(movie.releaseDate)}
                </Typography>
              </Box>
            </Box>

            {/* Genres */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {Array.isArray(movie.genre) &&
                movie.genre.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                  />
                ))}
            </Box>

            {/* Action CTAs */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              {movie.status === 'coming_soon' ? (
                <Button
                  variant="outlined"
                  size="large"
                  disabled
                  sx={{
                    px: 3.5,
                    py: 1.4,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderColor: 'rgba(233, 69, 96, 0.4) !important',
                    color: '#ff6b81 !important',
                    bgcolor: 'rgba(233, 69, 96, 0.08) !important',
                    borderRadius: 2,
                  }}
                >
                  Coming Soon • Bookings Not Open Yet
                </Button>
              ) : movie.status === 'ended' ? (
                <Button
                  variant="outlined"
                  size="large"
                  disabled
                  sx={{
                    px: 3.5,
                    py: 1.4,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderColor: 'rgba(255, 255, 255, 0.2) !important',
                    color: '#888 !important',
                    borderRadius: 2,
                  }}
                >
                  Theatrical Run Ended
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ConfirmationNumberIcon />}
                  onClick={() => navigate(`/shows/${movie._id}`)}
                  sx={{
                    px: 4,
                    py: 1.4,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                    boxShadow: '0 6px 20px rgba(233, 69, 96, 0.4)',
                  }}
                >
                  Book Tickets Now
                </Button>
              )}
              {movie.trailerUrl && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutlineIcon />}
                  onClick={() => setTrailerOpen(true)}
                  sx={{
                    px: 3,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    '&:hover': {
                      borderColor: '#e94560',
                      color: '#e94560',
                    },
                  }}
                >
                  Watch Trailer
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Synopsis & Cast Section */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3.5,
              backgroundColor: '#16213e',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
              Synopsis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {movie.description}
            </Typography>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Cast & Crew */}
            <Typography variant="h5" fontWeight={700} color="#fff" mb={2.5}>
              Starring Cast & Director
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="#e94560" fontWeight={700}>
                DIRECTED BY: <span style={{ color: '#fff' }}>{movie.director}</span>
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {Array.isArray(movie.cast) &&
                movie.cast.map((actor, idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#0f3460',
                          color: '#e94560',
                          fontWeight: 'bold',
                        }}
                      >
                        {actor.name ? actor.name.charAt(0) : 'A'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="#fff">
                          {actor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {actor.role || 'Main Role'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3.5,
              backgroundColor: '#16213e',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff" mb={2}>
              Quick Movie Facts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Original Language
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#fff">
                  {movie.language} (English Subtitles Available)
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Runtime Duration
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#fff">
                  {formatDuration(movie.duration)} ({movie.duration} minutes)
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Censor Rating
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#fff">
                  {movie.certificate} (Parental Guidance Advised)
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Format Available
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#fff">
                  2D, 3D, IMAX 4K Laser, 4DX, Dolby Atmos
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Integrated In-App YouTube Trailer Player */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0a0f1d',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(233, 69, 96, 0.4)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#16213e',
            color: '#fff',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircleOutlineIcon sx={{ color: '#e94560' }} />
            <Typography variant="h6" fontWeight={700}>
              {movie.title} - Official Trailer
            </Typography>
          </Box>
          <IconButton onClick={() => setTrailerOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', height: { xs: 260, sm: 440 }, bgcolor: '#000' }}>
            {movie.trailerUrl && (
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(movie.trailerUrl)}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#16213e', p: 1.5, justifyContent: 'space-between' }}>
          <Button
            href={movie.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            startIcon={<OpenInNewIcon />}
            sx={{ color: '#e94560', textTransform: 'none', fontWeight: 600 }}
          >
            Watch directly on YouTube
          </Button>
          <Button onClick={() => setTrailerOpen(false)} sx={{ color: 'text.secondary' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetail;
