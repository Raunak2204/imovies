import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const RegisterForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setValidationError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const { confirmPassword, ...registerPayload } = formData;
    onSubmit(registerPayload);
  };

  return (
    <Paper
      elevation={4}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 3, sm: 5 },
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#16213e',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#fff">
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Join IMovies to book seats, grab discounts, and view your tickets
        </Typography>
      </Box>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || validationError}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<HowToRegIcon />}
        sx={{
          py: 1.4,
          fontWeight: 700,
          background: 'linear-gradient(45deg, #e94560, #ff6b81)',
          boxShadow: '0 4px 15px rgba(233, 69, 96, 0.4)',
        }}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" sx={{ color: '#e94560', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
