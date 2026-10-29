import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
  InputBase,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Movie as MovieIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  ConfirmationNumber as TicketIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Search as SearchIcon,
  LocalMovies as LocalMoviesIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isAdminOrSuper =
    user?.role === 'admin' ||
    user?.role === 'superadmin' ||
    user?.email === 'superadmin@imovies.com' ||
    user?.email === 'admin@imovies.com';

  const isSuperAdmin =
    user?.role === 'superadmin' || user?.email === 'superadmin@imovies.com';
  const adminLabel = isSuperAdmin ? 'Super Admin' : 'Admin';
  const adminDashboardLabel = isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard';

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Movies', path: '/movies', icon: <MovieIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ width: 280, bgcolor: '#16213e', height: '100%', pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalMoviesIcon sx={{ color: '#e94560', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e94560' }}>
            IMovies
          </Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              sx={{ '&:hover': { bgcolor: 'rgba(233,69,96,0.1)' } }}
            >
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      {isAuthenticated ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/profile" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/my-bookings" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>
                <TicketIcon />
              </ListItemIcon>
              <ListItemText primary="My Bookings" />
            </ListItemButton>
          </ListItem>
          {isAdminOrSuper && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/dashboard" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon sx={{ color: '#ffd700', minWidth: 40 }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary={adminDashboardLabel}
                  primaryTypographyProps={{ sx: { color: '#ffd700', fontWeight: 700 } }}
                />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/register" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon sx={{ color: '#e94560', minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        className="no-print"
        sx={{
          background: 'linear-gradient(180deg, rgba(22,33,62,0.98) 0%, rgba(22,33,62,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Logo + Nav */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="start">
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <LocalMoviesIcon sx={{ color: '#e94560', fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                IMovies
              </Typography>
            </Box>
            {!isMobile && (
              <Box sx={{ display: 'flex', ml: 3, gap: 1 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      color: '#fff',
                      '&:hover': { color: '#e94560', bgcolor: 'rgba(233,69,96,0.08)' },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Center: Search */}
          {!isMobile && (
            <Box
              className="search-bar no-print"
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                maxWidth: 400,
                flex: 1,
                mx: 3,
              }}
            >
              <SearchIcon sx={{ color: '#b0b0b0', mr: 1 }} />
              <InputBase
                placeholder="Search movies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ color: '#fff', flex: 1, fontSize: 14 }}
              />
            </Box>
          )}

          {/* Right: Auth actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setSearchOpen(!searchOpen)}>
                <SearchIcon />
              </IconButton>
            )}
            {isAuthenticated ? (
              <>
                {!isMobile && isAdminOrSuper && (
                  <Button
                    component={Link}
                    to="/admin/dashboard"
                    variant="outlined"
                    size="small"
                    startIcon={<DashboardIcon sx={{ color: '#ffd700' }} />}
                    sx={{
                      color: '#ffd700',
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                      fontWeight: 700,
                      fontSize: 13,
                      px: 1.5,
                      mr: 1,
                      bgcolor: 'rgba(255, 215, 0, 0.08)',
                      '&:hover': {
                        borderColor: '#ffd700',
                        bgcolor: 'rgba(255, 215, 0, 0.18)',
                        color: '#fff',
                      },
                    }}
                  >
                    {adminLabel}
                  </Button>
                )}
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Badge
                    variant="dot"
                    color="success"
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#e94560',
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: '#16213e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  {isAdminOrSuper && (
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/dashboard');
                        handleMenuClose();
                      }}
                      sx={{
                        bgcolor: 'rgba(255, 215, 0, 0.06)',
                        '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.16)' },
                      }}
                    >
                      <DashboardIcon sx={{ mr: 1, fontSize: 20, color: '#ffd700' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffd700' }}>
                        {adminDashboardLabel}
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleMenuClose();
                    }}
                  >
                    <PersonIcon sx={{ mr: 1, fontSize: 20, color: '#e94560' }} /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/my-bookings');
                      handleMenuClose();
                    }}
                  >
                    <TicketIcon sx={{ mr: 1, fontSize: 20, color: '#e94560' }} /> My Bookings
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20, color: '#e94560' }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': { borderColor: '#e94560', color: '#e94560' },
                    }}
                  >
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained" size="small" color="primary">
                    Register
                  </Button>
                </>
              )
            )}
          </Box>
        </Toolbar>

        {/* Mobile search bar */}
        {isMobile && searchOpen && (
          <Box sx={{ px: 2, pb: 1.5 }} className="no-print">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                px: 2,
                py: 0.5,
              }}
            >
              <SearchIcon sx={{ color: '#b0b0b0', mr: 1 }} />
              <InputBase
                placeholder="Search movies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ color: '#fff', flex: 1, fontSize: 14 }}
                autoFocus
              />
            </Box>
          </Box>
        )}
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="no-print"
        PaperProps={{ sx: { bgcolor: '#16213e' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
