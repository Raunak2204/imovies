import React, { useEffect, useState } from 'react';
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
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { toast } from 'react-toastify';

import AdminLayout from '../components/admin/AdminLayout';
import DataTable from '../components/admin/DataTable';
import * as bookingService from '../services/bookingService';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchBookingsList = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const res = await bookingService.getAllBookings(params);
      setBookings(res.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsList();
  }, [statusFilter]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled and refund initiated');
      setDetailsOpen(false);
      fetchBookingsList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const columns = [
    {
      id: 'id',
      label: 'Booking ID',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="#fff">
          #{row._id?.slice(-8).toUpperCase()}
        </Typography>
      ),
    },
    {
      id: 'customer',
      label: 'Customer Name',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#e94560',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : 'C'}
          </Avatar>
          <div>
            <Typography variant="body2" fontWeight={700} color="#fff">
              {row.user?.name || 'Customer'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {row.user?.email || 'No email'}
            </Typography>
            {row.user?.phone && (
              <Typography variant="caption" sx={{ color: '#00adb5', fontSize: '0.7rem' }}>
                {row.user.phone}
              </Typography>
            )}
          </div>
        </Box>
      ),
    },
    {
      id: 'personsAndSeats',
      label: 'Persons & Seats',
      render: (row) => {
        const personCount = row.seats?.length || 1;
        return (
          <Box>
            <Chip
              icon={<PeopleAltOutlinedIcon sx={{ fontSize: '14px !important' }} />}
              label={`${personCount} ${personCount === 1 ? 'Person' : 'Persons'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(233, 69, 96, 0.15)',
                color: '#e94560',
                fontWeight: 700,
                fontSize: '0.72rem',
                mb: 0.5,
              }}
            />
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {row.seats?.map((s, idx) => (
                <Chip
                  key={idx}
                  label={s.seatNumber || s}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'movie',
      label: 'Movie',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.movie?.posterUrl && (
            <Box
              component="img"
              src={row.movie.posterUrl}
              alt=""
              sx={{ width: 26, height: 36, borderRadius: 1, objectFit: 'cover' }}
            />
          )}
          <Typography variant="body2" fontWeight={600} color="#fff">
            {row.movie?.title || 'Movie Title'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'show',
      label: 'Show & Venue',
      render: (row) => (
        <div>
          <Typography variant="body2" color="#fff">
            {row.theatre?.name || 'Theatre'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.show?.date)} • {row.show?.startTime}
          </Typography>
        </div>
      ),
    },
    {
      id: 'totalAmount',
      label: 'Amount',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="#e94560">
          {formatCurrency(row.totalAmount)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status ? row.status.toUpperCase() : 'CONFIRMED'}
          size="small"
          sx={{
            bgcolor: `${getStatusColor(row.status)}20`,
            color: getStatusColor(row.status),
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              setSelectedBooking(row);
              setDetailsOpen(true);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Booking Oversight"
      subtitle="Monitor all movie ticket reservations, customer payments, and cancellations"
      action={
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="booking-status-label">Filter Status</InputLabel>
          <Select
            labelId="booking-status-label"
            value={statusFilter}
            label="Filter Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      }
    >
      <DataTable
        columns={columns}
        rows={bookings}
        loading={loading}
        searchPlaceholder="Search by customer name, email, movie, or ID..."
      />

      {/* Booking Details Dialog */}
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
          Booking Details #{selectedBooking?._id?.slice(-8).toUpperCase()}
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  Customer Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Avatar sx={{ bgcolor: '#e94560', width: 36, height: 36, fontWeight: 700 }}>
                    {selectedBooking.user?.name ? selectedBooking.user.name.charAt(0).toUpperCase() : 'C'}
                  </Avatar>
                  <div>
                    <Typography variant="body1" fontWeight={700}>
                      {selectedBooking.user?.name || 'Customer'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedBooking.user?.email || 'No email provided'}
                    </Typography>
                    {selectedBooking.user?.phone && (
                      <Typography variant="caption" sx={{ color: '#00adb5' }}>
                        📞 {selectedBooking.user.phone}
                      </Typography>
                    )}
                  </div>
                </Box>
              </Box>

              <Box sx={{ bgcolor: 'rgba(233, 69, 96, 0.08)', p: 2, borderRadius: 2, border: '1px solid rgba(233, 69, 96, 0.2)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PeopleAltOutlinedIcon fontSize="small" sx={{ color: '#e94560' }} />
                    Persons / Guests Booked
                  </Typography>
                  <Chip
                    label={`${selectedBooking.seats?.length || 1} ${selectedBooking.seats?.length === 1 ? 'Person' : 'Persons'}`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Reserved Seats Breakdown:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedBooking.seats?.map((s, idx) => (
                    <Chip
                      key={idx}
                      label={`${s.seatNumber || s} (${(s.seatType || 'Standard').toUpperCase()} - ₹${s.price || ''})`}
                      size="small"
                      sx={{ bgcolor: '#0f3460', color: '#fff', fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Movie & Venue
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedBooking.movie?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBooking.theatre?.name} • Screen {selectedBooking.show?.screenNumber || 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(selectedBooking.show?.date)} at {selectedBooking.show?.startTime}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Status
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#e94560">
                  {formatCurrency(selectedBooking.totalAmount)} ({selectedBooking.status?.toUpperCase()})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Booked on {formatDate(selectedBooking.createdAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {selectedBooking?.status !== 'cancelled' && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => handleCancelBooking(selectedBooking?._id)}
            >
              Cancel Booking
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)} sx={{ color: 'text.secondary' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookingsPage;
