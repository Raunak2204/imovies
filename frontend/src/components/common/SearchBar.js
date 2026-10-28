import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputBase, Chip, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { GENRES, LANGUAGES } from '../../utils/constants';

/**
 * Search bar with genre/language filter chips and debounced input.
 */
const SearchBar = ({ onSearch, initialQuery = '', showFilters = true }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const triggerSearch = useCallback(
    (q, genre, lang) => {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (genre) params.set('genre', genre);
      if (lang) params.set('language', lang);
      if (onSearch) {
        onSearch({ search: q, genre, language: lang });
      } else {
        navigate(`/movies?${params.toString()}`);
      }
    },
    [onSearch, navigate]
  );

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => triggerSearch(value, selectedGenre, selectedLanguage), 400);
    setDebounceTimer(timer);
  };

  const handleGenre = (genre) => {
    const next = selectedGenre === genre ? '' : genre;
    setSelectedGenre(next);
    triggerSearch(query, next, selectedLanguage);
  };

  const handleLanguage = (lang) => {
    const next = selectedLanguage === lang ? '' : lang;
    setSelectedLanguage(next);
    triggerSearch(query, selectedGenre, next);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedGenre('');
    setSelectedLanguage('');
    triggerSearch('', '', '');
  };

  return (
    <Box>
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          px: 2,
          py: 1,
          mb: showFilters ? 2 : 0,
          border: '1px solid rgba(255,255,255,0.08)',
          '&:focus-within': { borderColor: '#e94560' },
          transition: 'border-color 0.2s',
        }}
      >
        <SearchIcon sx={{ color: '#b0b0b0', mr: 1 }} />
        <InputBase
          placeholder="Search movies by title, cast, director…"
          value={query}
          onChange={handleQueryChange}
          sx={{ color: '#fff', flex: 1, fontSize: 15 }}
          fullWidth
        />
        {(query || selectedGenre || selectedLanguage) && (
          <IconButton size="small" onClick={clearSearch} sx={{ color: '#b0b0b0' }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Genre chips */}
      {showFilters && (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
            {GENRES.slice(0, 8).map((genre) => (
              <Chip
                key={genre}
                label={genre}
                size="small"
                onClick={() => handleGenre(genre)}
                sx={{
                  bgcolor: selectedGenre === genre ? '#e94560' : 'rgba(255,255,255,0.06)',
                  color: selectedGenre === genre ? '#fff' : '#b0b0b0',
                  borderColor: selectedGenre === genre ? '#e94560' : 'transparent',
                  '&:hover': { bgcolor: selectedGenre === genre ? '#c23152' : 'rgba(233,69,96,0.15)' },
                  fontWeight: 500,
                  fontSize: 12,
                }}
              />
            ))}
          </Box>

          {/* Language chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {LANGUAGES.slice(0, 6).map((lang) => (
              <Chip
                key={lang}
                label={lang}
                size="small"
                onClick={() => handleLanguage(lang)}
                sx={{
                  bgcolor: selectedLanguage === lang ? '#0f3460' : 'rgba(255,255,255,0.06)',
                  color: selectedLanguage === lang ? '#fff' : '#b0b0b0',
                  '&:hover': { bgcolor: selectedLanguage === lang ? '#0a2340' : 'rgba(15,52,96,0.3)' },
                  fontWeight: 500,
                  fontSize: 12,
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default SearchBar;
