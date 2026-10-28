import { Router } from 'express';
import {
  getAllShows,
  getShowById,
  getShowsByMovie,
  getShowsByTheatre,
  createShow,
  updateShow,
  deleteShow,
  getAvailableSeats,
} from '../controllers/showController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getAvailableSeats);
router.get('/movie/:movieId', getShowsByMovie);
router.get('/theatre/:theatreId', getShowsByTheatre);

// Admin routes
router.post('/', protect, authorize('admin'), createShow);
router.put('/:id', protect, authorize('admin'), updateShow);
router.delete('/:id', protect, authorize('admin'), deleteShow);

export default router;
