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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { toast } from 'react-toastify';

import AdminLayout from '../components/admin/AdminLayout';
import DataTable from '../components/admin/DataTable';
import TheatreForm from '../components/admin/TheatreForm';
import * as theatreService from '../services/theatreService';

const AdminTheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [theatreToDelete, setTheatreToDelete] = useState(null);

  const fetchTheatresList = async () => {
    try {
      setLoading(true);
      const res = await theatreService.getAllTheatres({ limit: 50 });
      setTheatres(res.data || []);
    } catch (err) {
      toast.error('Failed to load theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatresList();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setFormLoading(true);
      if (editingTheatre) {
        await theatreService.updateTheatre(editingTheatre._id, formData);
        toast.success('Theatre updated successfully');
      } else {
        await theatreService.createTheatre(formData);
        toast.success('Theatre added successfully');
      }
      setFormOpen(false);
      setEditingTheatre(null);
      fetchTheatresList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!theatreToDelete) return;
    try {
      await theatreService.deleteTheatre(theatreToDelete._id);
      toast.success('Theatre deleted successfully');
      setDeleteDialogOpen(false);
      setTheatreToDelete(null);
      fetchTheatresList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete theatre');
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Theatre Name',
      render: (row) => (
        <div>
          <Typography variant="body2" fontWeight={700} color="#fff">
            {row.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 13, color: '#e94560' }} />
            <Typography variant="caption">{row.location?.address || row.location?.city}</Typography>
          </Box>
        </div>
      ),
    },
    {
      id: 'city',
      label: 'City',
      render: (row) => (
        <Chip
          label={row.location?.city || 'City'}
          size="small"
          sx={{ bgcolor: 'rgba(233, 69, 96, 0.15)', color: '#ff6b81', fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'screens',
      label: 'Screens',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="#fff">
          {row.screens?.length || 1} Audi
        </Typography>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      render: (row) => (
        <div>
          <Typography variant="body2" color="#fff">
            {row.contactNumber || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </div>
      ),
    },
    {
      id: 'amenities',
      label: 'Amenities',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {Array.isArray(row.amenities) &&
            row.amenities.slice(0, 3).map((a) => (
              <Chip key={a} label={a} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
            ))}
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
              setEditingTheatre(row);
              setFormOpen(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setTheatreToDelete(row);
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
      title="Theatre Management"
      subtitle="Configure cinema complexes, screens, and location venues"
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTheatre(null);
            setFormOpen(true);
          }}
          sx={{ background: 'linear-gradient(45deg, #e94560, #ff6b81)', fontWeight: 700 }}
        >
          Add New Theatre
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={theatres}
        loading={loading}
        searchPlaceholder="Search theatres..."
        searchField="name"
      />

      {/* Theatre Form Dialog */}
      <TheatreForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTheatre(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTheatre}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#16213e', color: '#fff', borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700}>Confirm Theatre Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to remove <strong>{theatreToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Theatre
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTheatresPage;
