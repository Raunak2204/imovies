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
  Tabs,
  Tab,
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
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');

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

  const handleToggleStatus = async (movie, newStatus) => {
    try {
      await movieService.updateMovie(movie._id, { ...movie, status: newStatus });
      toast.success(
        newStatus === 'now_showing'
          ? `"${movie.title}" is now published as Now Showing!`
          : newStatus === 'ended'
          ? `"${movie.title}" theatrical run marked as Ended`
          : `"${movie.title}" marked as Coming Soon`
      );
      fetchMoviesList();
    } catch (err) {
      toast.error('Failed to update movie status');
    }
  };

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
      label: 'Status & Controls',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, alignItems: 'flex-start' }}>
          <Chip
            label={row.status === 'now_showing' ? 'Now Showing' : row.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}
            color={row.status === 'now_showing' ? 'success' : row.status === 'coming_soon' ? 'warning' : 'default'}
            size="small"
            sx={{ fontSize: '0.7rem', fontWeight: 700 }}
          />
          {row.status === 'coming_soon' && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => handleToggleStatus(row, 'now_showing')}
              sx={{ py: 0.2, px: 1, fontSize: '0.68rem', fontWeight: 700, borderColor: '#4caf50' }}
            >
              Publish (Now Showing)
            </Button>
          )}
          {row.status === 'now_showing' && (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => handleToggleStatus(row, 'ended')}
              sx={{ py: 0.2, px: 1, fontSize: '0.68rem', fontWeight: 700, borderColor: '#ff9800' }}
            >
              End Run
            </Button>
          )}
          {row.status === 'ended' && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => handleToggleStatus(row, 'now_showing')}
              sx={{ py: 0.2, px: 1, fontSize: '0.68rem', fontWeight: 700, borderColor: '#2196f3' }}
            >
              Re-Publish
            </Button>
          )}
        </Box>
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

  const allCount = movies.length;
  const nowCount = movies.filter((m) => m.status === 'now_showing').length;
  const soonCount = movies.filter((m) => m.status === 'coming_soon').length;
  const endedCount = movies.filter((m) => m.status === 'ended').length;

  const filteredMovies =
    selectedStatusTab === 'all'
      ? movies
      : movies.filter((m) => m.status === selectedStatusTab);

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
      <Box sx={{ mb: 2.5, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Tabs
          value={selectedStatusTab}
          onChange={(e, val) => setSelectedStatusTab(val)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#e94560', height: 3 },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              fontSize: '0.88rem',
              textTransform: 'none',
              minWidth: 100,
              '&.Mui-selected': { color: '#fff', fontWeight: 700 },
            },
          }}
        >
          <Tab label={`All Movies (${allCount})`} value="all" />
          <Tab label={`Now Showing (${nowCount})`} value="now_showing" />
          <Tab label={`Coming Soon (${soonCount})`} value="coming_soon" />
          <Tab label={`Ended Run (${endedCount})`} value="ended" />
        </Tabs>
      </Box>

      <DataTable
        columns={columns}
        rows={filteredMovies}
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
