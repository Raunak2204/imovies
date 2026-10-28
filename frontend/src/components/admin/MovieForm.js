import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { GENRES, LANGUAGES, CERTIFICATES } from '../../utils/constants';

const defaultMovieState = {
  title: '',
  description: '',
  genre: ['Action'],
  language: 'English',
  duration: 120,
  releaseDate: new Date().toISOString().split('T')[0],
  endDate: '',
  director: '',
  certificate: 'UA',
  status: 'now_showing',
  posterUrl: '',
  trailerUrl: '',
};

const MovieForm = ({ open, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState(defaultMovieState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        genre: Array.isArray(initialData.genre) ? initialData.genre : [initialData.genre || 'Action'],
      });
    } else {
      setFormData(defaultMovieState);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      genre: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#16213e',
          color: '#fff',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? 'Edit Movie' : 'Add New Movie'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                required
                label="Movie Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                required
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="now_showing">Now Showing</MenuItem>
                <MenuItem value="coming_soon">Coming Soon</MenuItem>
                <MenuItem value="ended">Ended</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Synopsis / Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Certificate"
                name="certificate"
                value={formData.certificate}
                onChange={handleChange}
              >
                {CERTIFICATES.map((cert) => (
                  <MenuItem key={cert} value={cert}>
                    {cert}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                SelectProps={{ multiple: true }}
                label="Genres"
                name="genre"
                value={formData.genre}
                onChange={handleGenreChange}
              >
                {GENRES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Director"
                name="director"
                value={formData.director}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Release Date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster Image URL"
                name="posterUrl"
                placeholder="https://..."
                value={formData.posterUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trailer YouTube URL"
                name="trailerUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.trailerUrl}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #e94560, #ff6b81)',
              fontWeight: 700,
              px: 3,
            }}
          >
            {loading ? 'Saving...' : initialData ? 'Update Movie' : 'Create Movie'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MovieForm;
