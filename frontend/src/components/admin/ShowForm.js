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
} from '@mui/material';

const defaultShowState = {
  movie: '',
  theatre: '',
  screenNumber: 1,
  date: new Date().toISOString().split('T')[0],
  startTime: '06:00 PM',
  endTime: '08:30 PM',
  regularPrice: 200,
  premiumPrice: 350,
  vipPrice: 500,
};

const ShowForm = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  movies = [],
  theatres = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState(defaultShowState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        movie: initialData.movie?._id || initialData.movie || '',
        theatre: initialData.theatre?._id || initialData.theatre || '',
        screenNumber: initialData.screenNumber || 1,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        startTime: initialData.startTime || '06:00 PM',
        endTime: initialData.endTime || '08:30 PM',
        regularPrice: initialData.price?.regular || 200,
        premiumPrice: initialData.price?.premium || 350,
        vipPrice: initialData.price?.vip || 500,
      });
    } else {
      setFormData({
        ...defaultShowState,
        movie: movies[0]?._id || '',
        theatre: theatres[0]?._id || '',
      });
    }
  }, [initialData, movies, theatres, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      movie: formData.movie,
      theatre: formData.theatre,
      screenNumber: parseInt(formData.screenNumber, 10),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      price: {
        regular: parseFloat(formData.regularPrice),
        premium: parseFloat(formData.premiumPrice),
        vip: parseFloat(formData.vipPrice),
      },
    };

    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        {initialData ? 'Edit Show Schedule' : 'Schedule New Show'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                required
                label="Select Movie"
                name="movie"
                value={formData.movie}
                onChange={handleChange}
              >
                {movies.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.title} ({m.language})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                required
                label="Select Theatre"
                name="theatre"
                value={formData.theatre}
                onChange={handleChange}
              >
                {theatres.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.name} ({t.location?.city || 'Cinema'})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                required
                label="Show Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Screen Number"
                name="screenNumber"
                value={formData.screenNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Start Time"
                name="startTime"
                placeholder="e.g. 06:00 PM"
                value={formData.startTime}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="End Time"
                name="endTime"
                placeholder="e.g. 08:30 PM"
                value={formData.endTime}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Regular (₹)"
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Premium (₹)"
                name="premiumPrice"
                value={formData.premiumPrice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="VIP (₹)"
                name="vipPrice"
                value={formData.vipPrice}
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
            {loading ? 'Scheduling...' : initialData ? 'Update Show' : 'Create Show'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ShowForm;
