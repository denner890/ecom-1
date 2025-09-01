import dotenv from 'dotenv';
import { createServer } from './app.js';
import { connectDB } from './config/db.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create Express app
    const app = createServer();
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();