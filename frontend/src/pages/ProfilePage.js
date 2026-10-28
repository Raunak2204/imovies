import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';

import { updateProfile, changePassword } from '../redux/slices/authSlice';
import { formatDate } from '../utils/helpers';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      await dispatch(
        changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} color="#fff" gutterBottom>
        Account Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Manage your personal profile and security preferences
      </Typography>

      {/* Profile Overview Card */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#16213e',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#e94560',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#fff">
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email} • Member since {formatDate(user?.createdAt)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              mt: 0.8,
              px: 1.5,
              py: 0.2,
              borderRadius: 1,
              bgcolor: 'rgba(233, 69, 96, 0.2)',
              color: '#ff6b81',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {user?.role || 'User'}
          </Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper
        elevation={2}
        sx={{
          backgroundColor: '#16213e',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            '& .MuiTabs-indicator': { bgcolor: '#e94560' },
            '& .MuiTab-root': {
              color: 'text.secondary',
              fontWeight: 600,
              '&.Mui-selected': { color: '#e94560' },
            },
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Details" />
          <Tab icon={<LockIcon />} iconPosition="start" label="Change Password" />
        </Tabs>

        {/* Tab 0: Personal Details */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleProfileSubmit} sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Avatar Image URL"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<SaveIcon />}
                sx={{
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                }}
              >
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab 1: Password Change */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ p: 4 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {passwordError}
              </Alert>
            )}

            <Grid container spacing={3} maxWidth={500}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<LockIcon />}
                sx={{
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                }}
              >
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
