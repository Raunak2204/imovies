import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

// Admin user management routes
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
