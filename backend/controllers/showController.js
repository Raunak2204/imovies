import mongoose from 'mongoose';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { generateSeatMap, calculateEndTime } from '../utils/helpers.js';

/**
 * @desc    Get all shows
 * @route   GET /api/v1/shows
 * @access  Public
 */
export const getAllShows = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const queryDate = new Date(req.query.date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: queryDate, $lt: nextDay };
    }

    const total = await Show.countDocuments(filter);
    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name location screens amenities')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: shows.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single show by ID
 * @route   GET /api/v1/shows/:id
 * @access  Public
 */
export const getShowById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Show not found', 404));
    }

    const show = await Show.findById(req.params.id)
      .populate('movie', 'title posterUrl duration language certificate genre director')
      .populate('theatre', 'name location screens amenities');

    if (!show) {
      return next(new ErrorResponse('Show not found', 404));
    }

    res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get shows by movie
 * @route   GET /api/v1/shows/movie/:movieId
 * @access  Public
 */
export const getShowsByMovie = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let targetMovieId = req.params.movieId;

    if (!mongoose.Types.ObjectId.isValid(targetMovieId)) {
      // Check if maybe queried by demo slug / name
      const titleSearch = targetMovieId.replace(/^movie_/, '').replace(/_\d+$/, '').replace(/[-_]/g, ' ');
      const foundMovie = await Movie.findOne({
        title: { $regex: new RegExp(titleSearch, 'i') },
      });
      if (foundMovie) {
        targetMovieId = foundMovie._id;
      } else {
        return res.status(200).json({
          success: true,
          count: 0,
          pagination: { page, limit, totalPages: 0, totalResults: 0 },
          data: [],
        });
      }
    }

    const filter = { movie: targetMovieId, status: 'active' };

    if (req.query.date) {
      const queryDate = new Date(req.query.date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: queryDate, $lt: nextDay };
    }

    if (req.query.city) {
      const theatresInCity = await Theatre.find({
        'location.city': { $regex: new RegExp(req.query.city, 'i') },
      }).select('_id');
      filter.theatre = { $in: theatresInCity.map((t) => t._id) };
    }

    const total = await Show.countDocuments(filter);
    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name location')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: shows.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get shows by theatre
 * @route   GET /api/v1/shows/theatre/:theatreId
 * @access  Public
 */
export const getShowsByTheatre = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(req.params.theatreId)) {
      return res.status(200).json({
        success: true,
        count: 0,
        pagination: { page, limit, totalPages: 0, totalResults: 0 },
        data: [],
      });
    }

    const filter = { theatre: req.params.theatreId, status: 'active' };

    if (req.query.date) {
      const queryDate = new Date(req.query.date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: queryDate, $lt: nextDay };
    }

    const total = await Show.countDocuments(filter);
    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name location')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: shows.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new show
 * @route   POST /api/v1/shows
 * @access  Private/Admin
 */
export const createShow = async (req, res, next) => {
  try {
    const { movie: movieId, theatre: theatreId, screenNumber, date, startTime, price } = req.body;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }

    // Validate theatre exists
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return next(new ErrorResponse('Theatre not found', 404));
    }

    // Validate screen exists
    const screen = theatre.screens[screenNumber - 1];
    if (!screen) {
      return next(
        new ErrorResponse(
          `Screen ${screenNumber} does not exist in this theatre`,
          400
        )
      );
    }

    // Calculate end time
    const endTime = calculateEndTime(startTime, movie.duration + 15); // 15 min buffer for ads/interval

    // Generate seat map from screen layout
    const rows = screen.seatLayout?.rows || 10;
    const cols = screen.seatLayout?.columns || 15;
    const seatMap = generateSeatMap(rows, cols);
    const totalSeats = rows * cols;

    const show = await Show.create({
      movie: movieId,
      theatre: theatreId,
      screenNumber,
      date: new Date(date),
      startTime,
      endTime,
      price,
      availableSeats: totalSeats,
      totalSeats,
      seatMap,
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title posterUrl duration')
      .populate('theatre', 'name location');

    res.status(201).json({
      success: true,
      data: populatedShow,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a show
 * @route   PUT /api/v1/shows/:id
 * @access  Private/Admin
 */
export const updateShow = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Show not found', 404));
    }

    const show = await Show.findById(req.params.id);

    if (!show) {
      return next(new ErrorResponse('Show not found', 404));
    }

    // Prevent updating if show has bookings and is being cancelled
    const allowedUpdates = ['startTime', 'endTime', 'price', 'status', 'date'];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedShow = await Show.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('movie', 'title posterUrl duration')
      .populate('theatre', 'name location');

    res.status(200).json({
      success: true,
      data: updatedShow,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a show
 * @route   DELETE /api/v1/shows/:id
 * @access  Private/Admin
 */
export const deleteShow = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Show not found', 404));
    }

    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return next(new ErrorResponse('Show not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available seats for a show
 * @route   GET /api/v1/shows/:id/seats
 * @access  Public
 */
export const getAvailableSeats = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Show not found', 404));
    }

    const show = await Show.findById(req.params.id).select(
      'seatMap availableSeats totalSeats price status'
    );

    if (!show) {
      return next(new ErrorResponse('Show not found', 404));
    }

    if (show.status !== 'active') {
      return next(new ErrorResponse('This show is no longer active', 400));
    }

    // Convert seatMap to categorized object
    const seats = {
      available: [],
      booked: [],
      blocked: [],
    };

    if (show.seatMap) {
      for (const [seat, status] of show.seatMap.entries()) {
        seats[status].push(seat);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        showId: show._id,
        totalSeats: show.totalSeats,
        availableSeats: show.availableSeats,
        price: show.price,
        seats,
      },
    });
  } catch (error) {
    next(error);
  }
};
