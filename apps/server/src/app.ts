import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

export function createServer() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit auth attempts
    message: { ok: false, message: 'Too many auth attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth', authLimiter);

  // General rate limiting
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { ok: false, message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', generalLimiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      ok: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/upload', uploadRoutes);

  // 404 handler for unknown routes
  app.use('*', (req, res) => {
    res.status(404).json({
      ok: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createServer();