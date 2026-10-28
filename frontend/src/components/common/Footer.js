import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocalMovies as LocalMoviesIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0d1524',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalMoviesIcon sx={{ color: '#e94560', fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                IMovies
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2, lineHeight: 1.8 }}>
              Your premier destination for cinema booking. Experience movies the way they were meant to be seen.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: '#b0b0b0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { color: '#e94560', borderColor: '#e94560' },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Quick Links
            </Typography>
            {[
              { label: 'Home', path: '/' },
              { label: 'Movies', path: '/movies' },
              { label: 'My Bookings', path: '/my-bookings' },
              { label: 'Profile', path: '/profile' },
            ].map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                variant="body2"
                sx={{
                  display: 'block',
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  mb: 1.2,
                  '&:hover': { color: '#e94560' },
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Help */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Help & Support
            </Typography>
            {['About Us', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Refund Policy'].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{
                  color: '#b0b0b0',
                  mb: 1.2,
                  cursor: 'pointer',
                  '&:hover': { color: '#e94560' },
                  transition: 'color 0.2s',
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Contact Us
            </Typography>
            {[
              { icon: <LocationIcon fontSize="small" />, text: '123 Cinema Street, Mumbai 400001' },
              { icon: <PhoneIcon fontSize="small" />, text: '+91 98765 43210' },
              { icon: <EmailIcon fontSize="small" />, text: 'support@imovies.com' },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                <Box sx={{ color: '#e94560', mt: 0.3 }}>{item.icon}</Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} IMovies. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Made with ❤️ for cinema lovers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
