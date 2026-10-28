import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
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
      label: 'Customer',
      render: (row) => (
        <div>
          <Typography variant="body2" fontWeight={600} color="#fff">
            {row.user?.name || 'Customer'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.user?.email || row.user?.phone}
          </Typography>
        </div>
      ),
    },
    {
      id: 'movie',
      label: 'Movie',
      render: (row) => row.movie?.title || 'Movie Title',
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
      id: 'seats',
      label: 'Seats',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.seats?.map((s, idx) => (
            <Chip key={idx} label={s.seatNumber || s} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
          ))}
        </Box>
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
        searchPlaceholder="Search bookings..."
        searchField="movie"
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
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedBooking.user?.name} ({selectedBooking.user?.email})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {selectedBooking.user?.phone || 'N/A'}
                </Typography>
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
                  Reserved Seats ({selectedBooking.seats?.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {selectedBooking.seats?.map((s, idx) => (
                    <Chip key={idx} label={s.seatNumber || s} color="primary" size="small" />
                  ))}
                </Box>
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
