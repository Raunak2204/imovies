import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ShieldIcon from '@mui/icons-material/Shield';
import { toast } from 'react-toastify';

import AdminLayout from '../components/admin/AdminLayout';
import DataTable from '../components/admin/DataTable';
import * as authService from '../services/authService';
import { formatDate } from '../utils/helpers';

const AdminUsersPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.email === 'superadmin@imovies.com' || currentUser?.role === 'superadmin';

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const res = await authService.getAllUsers(params);
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load user database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, [roleFilter]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      await authService.deleteUser(userToDelete._id, userToDelete.email);
      toast.success(`${userToDelete.role === 'admin' ? 'Administrator' : 'User'} "${userToDelete.name}" removed successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      if (detailsOpen && selectedUser?._id === userToDelete._id) {
        setDetailsOpen(false);
      }
      fetchUsersList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAllUsers = async () => {
    try {
      setActionLoading(true);
      await authService.clearAllUsers();
      toast.success('All non-superadmin users and admins cleared successfully');
      setClearDialogOpen(false);
      fetchUsersList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear user directory');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'User Name',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: row.role === 'admin' ? '#ffd700' : '#e94560',
              color: row.role === 'admin' ? '#1a1a2e' : '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div>
            <Typography variant="body2" fontWeight={700} color="#fff">
              {row.name || 'Anonymous User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: #{row._id ? row._id.slice(-6).toUpperCase() : 'N/A'}
            </Typography>
          </div>
        </Box>
      ),
    },
    {
      id: 'email',
      label: 'Email Address',
      render: (row) => (
        <Typography variant="body2" color="#fff">
          {row.email}
        </Typography>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.phone || 'Not Provided'}
        </Typography>
      ),
    },
    {
      id: 'role',
      label: 'Account Role',
      render: (row) => (
        <Chip
          label={row.role ? row.role.toUpperCase() : 'USER'}
          size="small"
          sx={{
            bgcolor: row.role === 'admin' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(33, 150, 243, 0.15)',
            color: row.role === 'admin' ? '#ffd700' : '#2196f3',
            border: `1px solid ${row.role === 'admin' ? '#ffd700' : '#2196f3'}`,
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
      ),
    },
    {
      id: 'bookings',
      label: 'Bookings Made',
      render: (row) => {
        const count = Array.isArray(row.bookings) ? row.bookings.length : 0;
        return (
          <Chip
            icon={<ConfirmationNumberIcon sx={{ fontSize: '14px !important' }} />}
            label={`${count} ${count === 1 ? 'Ticket' : 'Tickets'}`}
            size="small"
            sx={{
              bgcolor: count > 0 ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: count > 0 ? '#4caf50' : 'text.secondary',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      },
    },
    {
      id: 'createdAt',
      label: 'Registered Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => {
        const isTargetSuper = row.email === 'superadmin@imovies.com';
        const isTargetAdmin = row.role === 'admin';
        // Super Admin can delete admins and users. Normal admin can only delete users.
        const canDelete = !isTargetSuper && (isSuperAdmin || !isTargetAdmin);

        return (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="View User Details">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setSelectedUser(row);
                  setDetailsOpen(true);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {canDelete ? (
              <Tooltip title={isTargetAdmin ? 'Super Admin: Remove Administrator' : 'Delete User'}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setUserToDelete(row);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : isTargetSuper ? (
              <Tooltip title="Super Admin Account (Protected)">
                <span>
                  <IconButton size="small" disabled sx={{ color: 'rgba(255, 215, 0, 0.4)' }}>
                    <ShieldIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Only Super Admin can delete admin accounts">
                <span>
                  <IconButton size="small" disabled sx={{ color: 'rgba(255, 255, 255, 0.2)' }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <AdminLayout
      title="User Management"
      subtitle="Complete database directory of registered customers, account roles, and booking records"
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {isSuperAdmin && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setClearDialogOpen(true)}
              sx={{
                borderColor: 'rgba(233, 69, 96, 0.4)',
                color: '#e94560',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                '&:hover': { bgcolor: 'rgba(233, 69, 96, 0.1)', borderColor: '#e94560' },
              }}
            >
              Clear All Users
            </Button>
          )}

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="user-role-label">Filter Role</InputLabel>
            <Select
              labelId="user-role-label"
              value={roleFilter}
              label="Filter Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="user">Regular Users</MenuItem>
              <MenuItem value="admin">Administrators</MenuItem>
            </Select>
          </FormControl>
        </Box>
      }
    >
      <DataTable
        columns={columns}
        rows={users}
        loading={loading}
        searchPlaceholder="Search users by name or email..."
        searchField="name"
      />

      {/* User Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
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
          User Profile Details
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: selectedUser.role === 'admin' ? '#ffd700' : '#e94560',
                    color: selectedUser.role === 'admin' ? '#1a1a2e' : '#fff',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </div>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    ACCOUNT ROLE
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color={selectedUser.role === 'admin' ? '#ffd700' : '#fff'}>
                    {selectedUser.role ? selectedUser.role.toUpperCase() : 'USER'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    PHONE NUMBER
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedUser.phone || 'Not Provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    REGISTERED ON
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    TOTAL BOOKINGS
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#e94560">
                    {selectedUser.bookings?.length || 0} reservation(s)
                  </Typography>
                </Grid>
              </Grid>

              {Array.isArray(selectedUser.bookings) && selectedUser.bookings.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Recent Booking History
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedUser.bookings.map((b, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <Typography variant="body2" fontWeight={600}>
                            {b.movie?.title || 'Cinema Ticket'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ref: #{b.bookingNumber || b._id}
                          </Typography>
                        </div>
                        <Chip
                          label={b.status ? b.status.toUpperCase() : 'CONFIRMED'}
                          size="small"
                          color={b.status === 'confirmed' ? 'success' : 'default'}
                          sx={{ height: 22, fontSize: '0.65rem' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          {selectedUser && selectedUser.email !== 'superadmin@imovies.com' && (isSuperAdmin || selectedUser.role !== 'admin') ? (
            <Button
              color="error"
              variant="outlined"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                setUserToDelete(selectedUser);
                setDeleteDialogOpen(true);
              }}
            >
              Delete {selectedUser.role === 'admin' ? 'Admin' : 'User'}
            </Button>
          ) : <Box />}
          <Button onClick={() => setDetailsOpen(false)} sx={{ color: 'text.secondary' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !actionLoading && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.1)' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#e94560' }}>
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to remove {userToDelete?.role === 'admin' ? 'administrator' : 'user'}{' '}
            <strong>"{userToDelete?.name}"</strong> ({userToDelete?.email})? This account will be immediately deleted from the user directory.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={<DeleteOutlineIcon />}
          >
            {actionLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Users Dialog (Super Admin) */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => !actionLoading && setClearDialogOpen(false)}
        PaperProps={{
          sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3, border: '1px solid rgba(233, 69, 96, 0.3)' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#e94560' }}>
          Clear All Users Directory?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            <strong>Super Admin Action:</strong> This will purge all non-superadmin users and administrators from the system. Your Super Admin account will remain intact.
            <br /><br />
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setClearDialogOpen(false)} disabled={actionLoading} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleClearAllUsers}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={<DeleteSweepIcon />}
          >
            {actionLoading ? 'Clearing...' : 'Clear All Users'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsersPage;
