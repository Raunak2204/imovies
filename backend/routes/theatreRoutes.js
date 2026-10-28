import { Router } from 'express';
import {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} from '../controllers/theatreController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);

// Admin routes
router.post('/', protect, authorize('admin'), createTheatre);
router.put('/:id', protect, authorize('admin'), updateTheatre);
router.delete('/:id', protect, authorize('admin'), deleteTheatre);

export default router;
