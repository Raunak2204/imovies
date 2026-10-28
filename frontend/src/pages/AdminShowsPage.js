import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import AdminLayout from '../components/admin/AdminLayout';
import DataTable from '../components/admin/DataTable';
import ShowForm from '../components/admin/ShowForm';
import * as showService from '../services/showService';
import * as movieService from '../services/movieService';
import * as theatreService from '../services/theatreService';
import { formatDate, formatCurrency } from '../utils/helpers';

const AdminShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        showService.getAllShows ? showService.getAllShows() : fetch('/api/v1/shows').then((r) => r.json()),
        movieService.getAllMovies({ limit: 100 }),
        theatreService.getAllTheatres({ limit: 100 }),
      ]);

      setShows(showsRes.data || []);
      setMovies(moviesRes.data || []);
      setTheatres(theatresRes.data || []);
    } catch (err) {
      toast.error('Failed to load show schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setFormLoading(true);
      if (editingShow) {
        await showService.updateShow(editingShow._id, formData);
        toast.success('Show schedule updated');
      } else {
        await showService.createShow(formData);
        toast.success('New show scheduled successfully');
      }
      setFormOpen(false);
      setEditingShow(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showToDelete) return;
    try {
      await showService.deleteShow(showToDelete._id);
      toast.success('Show deleted successfully');
      setDeleteDialogOpen(false);
      setShowToDelete(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete show');
    }
  };

  const columns = [
    {
      id: 'movie',
      label: 'Movie',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="#fff">
          {row.movie?.title || 'Unknown Title'}
        </Typography>
      ),
    },
    {
      id: 'theatre',
      label: 'Theatre',
      render: (row) => (
        <div>
          <Typography variant="body2" color="#fff">
            {row.theatre?.name || 'Theatre'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Screen {row.screenNumber || 1}
          </Typography>
        </div>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      render: (row) => formatDate(row.date),
    },
    {
      id: 'time',
      label: 'Showtime',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="#e94560">
          {row.startTime} - {row.endTime}
        </Typography>
      ),
    },
    {
      id: 'price',
      label: 'Prices',
      render: (row) => (
        <Typography variant="caption" color="text.secondary">
          ₹{row.price?.regular || 200} / ₹{row.price?.premium || 350} / ₹{row.price?.vip || 500}
        </Typography>
      ),
    },
    {
      id: 'availableSeats',
      label: 'Seats Left',
      render: (row) => (
        <Chip
          label={`${row.availableSeats || 0} / ${row.totalSeats || 150}`}
          size="small"
          color={row.availableSeats > 20 ? 'success' : 'warning'}
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
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
              setEditingShow(row);
              setFormOpen(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setShowToDelete(row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Show Scheduling"
      subtitle="Manage movie screenings, theatre auditoriums, and slot timings"
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingShow(null);
            setFormOpen(true);
          }}
          sx={{ background: 'linear-gradient(45deg, #e94560, #ff6b81)', fontWeight: 700 }}
        >
          Schedule Show
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={shows}
        loading={loading}
        searchPlaceholder="Search shows by movie..."
        searchField="movie"
      />

      {/* Show Form Dialog */}
      <ShowForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingShow(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingShow}
        movies={movies}
        theatres={theatres}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700}>Cancel / Delete Show</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete this show for <strong>{showToDelete?.movie?.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            Back
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Show
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminShowsPage;
