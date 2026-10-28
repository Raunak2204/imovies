import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  genre: {
    type: [String],
    required: [true, 'Please provide at least one genre'],
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one genre is required',
    },
  },
  language: {
    type: String,
    required: [true, 'Please provide the language'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please provide the duration in minutes'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please provide the release date'],
  },
  endDate: {
    type: Date,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  posterUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  cast: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String, default: '' },
    },
  ],
  director: {
    type: String,
    required: [true, 'Please provide the director name'],
    trim: true,
  },
  certificate: {
    type: String,
    enum: ['U', 'UA', 'A', 'S'],
    default: 'UA',
  },
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon', 'ended'],
    default: 'coming_soon',
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search with language_override disabled to prevent Hindi language error
movieSchema.index({ title: 'text', description: 'text' }, { language_override: 'none' });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;