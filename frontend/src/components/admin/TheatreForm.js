import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
} from '@mui/material';

const defaultTheatreState = {
  name: '',
  city: 'Mumbai',
  address: '',
  contactNumber: '',
  email: '',
  amenities: 'Parking, Food Court, IMAX, Dolby Atmos',
  screenCount: 3,
};

const TheatreForm = ({ open, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState(defaultTheatreState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        city: initialData.location?.city || 'Mumbai',
        address: initialData.location?.address || '',
        contactNumber: initialData.contactNumber || '',
        email: initialData.email || '',
        amenities: Array.isArray(initialData.amenities)
          ? initialData.amenities.join(', ')
          : initialData.amenities || '',
        screenCount: initialData.screens?.length || 3,
      });
    } else {
      setFormData(defaultTheatreState);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const screens = Array.from({ length: parseInt(formData.screenCount, 10) || 1 }, (_, i) => ({
      name: `Screen ${i + 1}`,
      totalSeats: 150,
    }));

    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      location: {
        city: formData.city,
        address: formData.address,
      },
      contactNumber: formData.contactNumber,
      email: formData.email,
      amenities: amenitiesArray,
      screens,
      isActive: true,
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
        {initialData ? 'Edit Theatre' : 'Add New Theatre'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Theatre Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Screens"
                name="screenCount"
                value={formData.screenCount}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Full Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amenities (comma separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                helperText="e.g. Parking, Food Court, IMAX, Dolby Atmos, 3D"
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
            {loading ? 'Saving...' : initialData ? 'Update Theatre' : 'Create Theatre'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TheatreForm;
