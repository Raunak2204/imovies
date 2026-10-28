import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { setDemoAuth } from '../../redux/slices/authSlice';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setValidationError('Please enter both email and password.');
      return;
    }
    onSubmit(formData);
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setValidationError('');
    onSubmit({ email, password });
  };

  const handleGuestContinue = () => {
    const guestUser = {
      _id: 'guest_' + Date.now().toString(36),
      name: 'Guest Moviegoer',
      email: 'guest@imovies.com',
      role: 'user',
    };
    dispatch(setDemoAuth({ user: guestUser, token: 'mock_jwt_guest_' + Date.now() }));
  };

  return (
    <Paper
      elevation={4}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 3, sm: 4.5 },
        width: '100%',
        maxWidth: 460,
        backgroundColor: '#16213e',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Title Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={900} color="#fff">
          Welcome to <span style={{ color: '#e94560' }}>iMovies</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.8}>
          Log in to book cinema tickets and manage reservations
        </Typography>
      </Box>

      {/* Quick 1-Click Login Bar */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'rgba(233, 69, 96, 0.06)',
          borderColor: 'rgba(233, 69, 96, 0.3)',
          borderRadius: 2.5,
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, mb: 1.2 }}>
          <FlashOnIcon sx={{ color: '#ffd700', fontSize: 18 }} />
          <Typography variant="caption" fontWeight={700} color="#fff" letterSpacing={0.5}>
            FAST 1-CLICK DEMO LOGIN:
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="center">
          <Button
            size="small"
            variant="contained"
            startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleQuickLogin('rahul@example.com', 'password123')}
            sx={{
              bgcolor: '#0f3460',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              py: 0.6,
              px: 1.8,
              '&:hover': { bgcolor: '#1a4a8a' },
            }}
          >
            Demo User
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleQuickLogin('admin@imovies.com', 'admin123')}
            sx={{
              background: 'linear-gradient(45deg, #e94560, #ff6b81)',
              fontSize: '0.75rem',
              fontWeight: 700,
              py: 0.6,
              px: 1.8,
            }}
          >
            Demo Admin
          </Button>
        </Stack>
      </Paper>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || validationError}
        </Alert>
      )}

      {/* Form Fields */}
      <Box sx={{ mb: 2.5 }}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="e.g. rahul@example.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="••••••••"
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

      {/* Remember me & forgot password */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="small"
              sx={{ color: '#e94560', '&.Mui-checked': { color: '#e94560' } }}
            />
          }
          label={<Typography variant="caption" color="text.secondary">Remember me</Typography>}
        />
        <Link
          component="button"
          type="button"
          variant="caption"
          onClick={() => alert('For demo, use rahul@example.com / password123 or admin@imovies.com / admin123')}
          sx={{ color: '#e94560', textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<LoginIcon />}
        sx={{
          py: 1.3,
          fontWeight: 700,
          fontSize: '1rem',
          background: 'linear-gradient(45deg, #e94560, #ff6b81)',
          boxShadow: '0 4px 15px rgba(233, 69, 96, 0.4)',
        }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Guest Checkout Option */}
      <Button
        type="button"
        fullWidth
        variant="text"
        size="small"
        onClick={handleGuestContinue}
        sx={{
          mt: 1.5,
          color: 'text.secondary',
          fontSize: '0.82rem',
          '&:hover': { color: '#fff' },
        }}
      >
        Or Continue as Guest (Skip Sign In) →
      </Button>

      <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register" sx={{ color: '#e94560', fontWeight: 700 }}>
            Create an account
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginForm;
