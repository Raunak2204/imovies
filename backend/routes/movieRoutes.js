import { Router } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getNowShowingMovies,
  getComingSoonMovies,
} from '../controllers/movieController.js';
import { protect, authorize } from '../middleware/auth.js';
import { movieValidation } from '../middleware/validator.js';

const router = Router();

// Public routes
router.get('/now-showing', getNowShowingMovies);
router.get('/coming-soon', getComingSoonMovies);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin routes
router.post('/', protect, authorize('admin'), movieValidation, createMovie);
router.put('/:id', protect, authorize('admin'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

export default router;
