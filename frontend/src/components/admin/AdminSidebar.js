import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
  { label: 'Bookings', path: '/admin/bookings', icon: <ConfirmationNumberIcon /> },
  { label: 'Movies', path: '/admin/movies', icon: <MovieIcon /> },
  { label: 'Theatres', path: '/admin/theatres', icon: <TheatersIcon /> },
  { label: 'Shows', path: '/admin/shows', icon: <AccessTimeIcon /> },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#16213e',
        borderRadius: 3,
        p: 2,
        height: 'fit-content',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="overline" color="#e94560" fontWeight={700} letterSpacing={1.5}>
          ADMIN CONSOLE
        </Typography>
        <Typography variant="h6" fontWeight={700} color="#fff">
          Management
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

      <List component="nav" disablePadding>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={isSelected}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.8,
                color: isSelected ? '#fff' : 'text.secondary',
                bgcolor: isSelected ? 'rgba(233, 69, 96, 0.15) !important' : 'transparent',
                borderLeft: isSelected ? '3px solid #e94560' : '3px solid transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected ? '#e94560' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: isSelected ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)', color: '#fff' },
          }}
        >
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText
            primary="Back to Site"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default AdminSidebar;
