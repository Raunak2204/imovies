import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { GENRES, LANGUAGES, CERTIFICATES } from '../../utils/constants';

const MovieFilter = ({ filters, onFilterChange, onResetFilters }) => {
  const handleGenreToggle = (genre) => {
    const currentGenres = filters.genre ? (Array.isArray(filters.genre) ? filters.genre : [filters.genre]) : [];
    const exists = currentGenres.includes(genre);
    const updated = exists ? currentGenres.filter((g) => g !== genre) : [...currentGenres, genre];
    onFilterChange('genre', updated.length > 0 ? updated : '');
  };

  const selectedGenres = Array.isArray(filters.genre)
    ? filters.genre
    : filters.genre
    ? [filters.genre]
    : [];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        backgroundColor: '#16213e',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
        <Button
          size="small"
          startIcon={<FilterAltOffIcon />}
          onClick={onResetFilters}
          sx={{ color: '#e94560' }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Language Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            value={filters.language || ''}
            label="Language"
            onChange={(e) => onFilterChange('language', e.target.value)}
          >
            <MenuItem value="">All Languages</MenuItem>
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Status Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="status-select-label">Release Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={filters.status || ''}
            label="Release Status"
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All Movies</MenuItem>
            <MenuItem value="now_showing">Now Showing</MenuItem>
            <MenuItem value="coming_soon">Coming Soon</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Certificate Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="certificate-select-label">Certificate</InputLabel>
          <Select
            labelId="certificate-select-label"
            value={filters.certificate || ''}
            label="Certificate"
            onChange={(e) => onFilterChange('certificate', e.target.value)}
          >
            <MenuItem value="">All Certificates</MenuItem>
            {CERTIFICATES.map((cert) => (
              <MenuItem key={cert} value={cert}>
                {cert}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Sort By Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={filters.sort || ''}
            label="Sort By"
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="-averageRating">Highest Rated</MenuItem>
            <MenuItem value="-releaseDate">Latest Release</MenuItem>
            <MenuItem value="title">Title (A-Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Genres */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
          Genres
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Chip
                key={genre}
                label={genre}
                size="small"
                clickable
                onClick={() => handleGenreToggle(genre)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '16px',
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'all 0.2s',
                  borderColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default MovieFilter;
