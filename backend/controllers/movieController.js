import Movie from '../models/Movie.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

/**
 * @desc    Get all movies with pagination, filtering, and search
 * @route   GET /api/v1/movies
 * @access  Public
 */
export const getAllMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by genre
    if (req.query.genre) {
      filter.genre = { $in: req.query.genre.split(',') };
    }

    // Filter by language
    if (req.query.language) {
      filter.language = { $regex: new RegExp(req.query.language, 'i') };
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by certificate
    if (req.query.certificate) {
      filter.certificate = req.query.certificate;
    }

    // Text search on title and description
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults: total,
      },
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single movie by ID
 * @route   GET /api/v1/movies/:id
 * @access  Public
 */
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new movie
 * @route   POST /api/v1/movies
 * @access  Private/Admin
 */
export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a movie
 * @route   PUT /api/v1/movies/:id
 * @access  Private/Admin
 */
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a movie
 * @route   DELETE /api/v1/movies/:id
 * @access  Private/Admin
 */
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get now showing movies
 * @route   GET /api/v1/movies/now-showing
 * @access  Public
 */
export const getNowShowingMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Movie.countDocuments({ status: 'now_showing' });
    const movies = await Movie.find({ status: 'now_showing' })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get coming soon movies
 * @route   GET /api/v1/movies/coming-soon
 * @access  Public
 */
export const getComingSoonMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Movie.countDocuments({ status: 'coming_soon' });
    const movies = await Movie.find({ status: 'coming_soon' })
      .sort({ releaseDate: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};
