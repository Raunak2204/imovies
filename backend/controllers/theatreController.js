import mongoose from 'mongoose';
import Theatre from '../models/Theatre.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

/**
 * @desc    Get all theatres with filtering by city
 * @route   GET /api/v1/theatres
 * @access  Public
 */
export const getAllTheatres = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.city) {
      filter['location.city'] = { $regex: new RegExp(req.query.city, 'i') };
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const total = await Theatre.countDocuments(filter);
    const theatres = await Theatre.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: theatres.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single theatre by ID
 * @route   GET /api/v1/theatres/:id
 * @access  Public
 */
export const getTheatreById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    res.status(200).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new theatre
 * @route   POST /api/v1/theatres
 * @access  Private/Admin
 */
export const createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);

    res.status(201).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a theatre
 * @route   PUT /api/v1/theatres/:id
 * @access  Private/Admin
 */
export const updateTheatre = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    res.status(200).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a theatre
 * @route   DELETE /api/v1/theatres/:id
 * @access  Private/Admin
 */
export const deleteTheatre = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    const theatre = await Theatre.findByIdAndDelete(req.params.id);

    if (!theatre) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
