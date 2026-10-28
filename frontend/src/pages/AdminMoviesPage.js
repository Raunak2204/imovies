import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Chip,
  Avatar,
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
import MovieForm from '../components/admin/MovieForm';
import * as movieService from '../services/movieService';
import { formatDuration } from '../utils/helpers';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const fetchMoviesList = async () => {
    try {
      setLoading(true);
      const res = await movieService.getAllMovies({ limit: 100 });
      setMovies(res.data || []);
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesList();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setFormLoading(true);
      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, formData);
        toast.success('Movie updated successfully');
      } else {
        await movieService.createMovie(formData);
        toast.success('Movie created successfully');
      }
      setFormOpen(false);
      setEditingMovie(null);
      fetchMoviesList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!movieToDelete) return;
    try {
      await movieService.deleteMovie(movieToDelete._id);
      toast.success('Movie deleted successfully');
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
      fetchMoviesList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  const columns = [
    {
      id: 'poster',
      label: 'Poster',
      render: (row) => (
        <Avatar
          variant="rounded"
          src={row.posterUrl}
          sx={{ width: 44, height: 60, bgcolor: '#0f3460' }}
        >
          {row.title?.charAt(0)}
        </Avatar>
      ),
    },
    {
      id: 'title',
      label: 'Movie Title',
      render: (row) => (
        <div>
          <Typography variant="body2" fontWeight={700} color="#fff">
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.language} • {formatDuration(row.duration)}
          </Typography>
        </div>
      ),
    },
    {
      id: 'genre',
      label: 'Genres',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {Array.isArray(row.genre) &&
            row.genre.map((g) => (
              <Chip key={g} label={g} size="small" sx={{ height: 22, fontSize: '0.65rem' }} />
            ))}
        </Box>
      ),
    },
    {
      id: 'certificate',
      label: 'Cert',
      render: (row) => (
        <Chip
          label={row.certificate || 'UA'}
          size="small"
          sx={{ bgcolor: '#0f3460', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status === 'now_showing' ? 'Now Showing' : row.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}
          color={row.status === 'now_showing' ? 'success' : row.status === 'coming_soon' ? 'warning' : 'default'}
          size="small"
          sx={{ fontSize: '0.7rem', fontWeight: 600 }}
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
              setEditingMovie(row);
              setFormOpen(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setMovieToDelete(row);
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
      title="Movie Management"
      subtitle="Add, edit, or remove cinema films from the catalog"
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingMovie(null);
            setFormOpen(true);
          }}
          sx={{ background: 'linear-gradient(45deg, #e94560, #ff6b81)', fontWeight: 700 }}
        >
          Add New Movie
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={movies}
        loading={loading}
        searchPlaceholder="Search movies by title..."
        searchField="title"
      />

      {/* Movie Form Modal */}
      <MovieForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingMovie(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingMovie}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700}>Confirm Movie Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{movieToDelete?.title}</strong>? All associated shows and bookings
            will be affected. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Movie
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMoviesPage;
