import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { autoSeedIfEmpty } from '../utils/seeder.js';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error('CRITICAL: MONGODB_URI environment variable is missing! Please configure MONGODB_URI in your Render / hosting environment variables.');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial catalog & demo accounts if database is fresh
    await autoSeedIfEmpty();
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.warn('Please check MongoDB Atlas Network Access (ensure 0.0.0.0/0 is allowed) and verify database user credentials.');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

export default connectDB;
