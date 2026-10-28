import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';

import AdminLayout from '../components/admin/AdminLayout';
import StatsCard from '../components/admin/StatsCard';
import DataTable from '../components/admin/DataTable';
import * as movieService from '../services/movieService';
import * as theatreService from '../services/theatreService';
import * as bookingService from '../services/bookingService';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [moviesRes, theatresRes, bookingsRes] = await Promise.all([
          movieService.getAllMovies({ limit: 1 }),
          theatreService.getAllTheatres({ limit: 1 }),
          bookingService.getAllBookings({ limit: 5 }),
        ]);

        setStats({
          totalMovies: moviesRes.pagination?.total || moviesRes.data?.length || 0,
          totalTheatres: theatresRes.count || theatresRes.data?.length || 0,
          totalBookings: bookingsRes.pagination?.total || bookingsRes.data?.length || 0,
          totalRevenue: bookingsRes.totalRevenue || 0,
        });

        setRecentBookings(bookingsRes.data || []);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const bookingColumns = [
    {
      id: 'id',
      label: 'Booking Ref',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="#fff">
          #{row._id?.slice(-8).toUpperCase()}
        </Typography>
      ),
    },
    {
      id: 'user',
      label: 'Customer',
      render: (row) => (
        <div>
          <Typography variant="body2" color="#fff">
            {row.user?.name || 'Customer'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.user?.email}
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
      id: 'createdAt',
      label: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Overview of cinema performance, sales, schedules, and active bookings"
      action={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/movies')}
            sx={{ background: 'linear-gradient(45deg, #e94560, #ff6b81)', fontWeight: 600 }}
          >
            Add Movie
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/shows')}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
          >
            Schedule Show
          </Button>
        </Box>
      }
    >
      {/* 4 Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<MonetizationOnIcon fontSize="large" />}
            subtitle="Lifetime gross ticket revenue"
            color="#4caf50"
            trend="+14%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<ConfirmationNumberIcon fontSize="large" />}
            subtitle="Completed ticket reservations"
            color="#e94560"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Active Movies"
            value={stats.totalMovies}
            icon={<MovieIcon fontSize="large" />}
            subtitle="Films in database & listings"
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Cinema Theatres"
            value={stats.totalTheatres}
            icon={<TheatersIcon fontSize="large" />}
            subtitle="Operating cinema locations"
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Recent Bookings Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#fff">
            Recent Ticket Bookings
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/admin/bookings')}
            sx={{ color: '#e94560', fontWeight: 600 }}
          >
            View All Bookings
          </Button>
        </Box>

        <DataTable
          columns={bookingColumns}
          rows={recentBookings}
          loading={loading}
          searchPlaceholder="Search recent bookings..."
          searchField="movie"
        />
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
