import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/merch-app';
    
    const conn = await mongoose.connect(mongoUri, {
      // Modern Mongoose doesn't need these options, but keeping for reference
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    logger.info(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
}

export default connectDB;