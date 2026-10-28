import { body, validationResult } from 'express-validator';

/**
 * Process validation results and return errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      error: messages.join('. '),
      errors: errors.array(),
    });
  }
  next();
};

/**
 * User registration validation rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  validate,
];

/**
 * User login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Movie creation validation rules
 */
export const movieValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Movie title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer (minutes)'),
  body('releaseDate')
    .notEmpty()
    .withMessage('Release date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('director')
    .trim()
    .notEmpty()
    .withMessage('Director name is required'),
  body('certificate')
    .optional()
    .isIn(['U', 'UA', 'A', 'S'])
    .withMessage('Certificate must be U, UA, A, or S'),
  body('status')
    .optional()
    .isIn(['now_showing', 'coming_soon', 'ended'])
    .withMessage('Status must be now_showing, coming_soon, or ended'),
  validate,
];

/**
 * Booking creation validation rules
 */
export const bookingValidation = [
  body('showId')
    .notEmpty()
    .withMessage('Show ID is required')
    .isMongoId()
    .withMessage('Invalid Show ID'),
  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected'),
  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),
  body('seats.*.seatType')
    .isIn(['regular', 'premium', 'vip'])
    .withMessage('Seat type must be regular, premium, or vip'),
  validate,
];
