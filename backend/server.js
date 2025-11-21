require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cloudinary = require('cloudinary').v2;
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// ======================
// Cloudinary Configuration
// ======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ======================
// Middleware Stack
// ======================

// HTTP request logging
app.use(morgan('combined', {
  skip: (req) => req.url === '/healthz'
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Data sanitization against NoSQL injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized ${key} on request ${req.method} ${req.url}`);
  },
}));

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Gzip compression
app.use(compression());

// ======================
// Rate Limiting
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for better UX
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0].trim() : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
});

app.use('/api', limiter);

// ======================
// CORS Configuration
// ======================
const corsOptions = {
  origin: [
    "https://cargo-frontend-hdrr.onrender.com", 
    "http://localhost:3000"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

// ======================
// Database Connection
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// ======================
// Routes
// ======================
app.use('/api/shipments', require('./routes/shipmentRoutes'));

// ======================
// Health Check Endpoint
// ======================
app.get('/healthz', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const cloudinaryStatus = !!cloudinary.config().cloud_name ? 'configured' : 'not configured';
  
  if (dbStatus !== 'connected') {
    return res.status(503).json({
      status: 'unhealthy',
      database: dbStatus,
      cloudinary: cloudinaryStatus,
      timestamp: new Date()
    });
  }

  res.status(200).json({
    status: 'healthy',
    database: dbStatus,
    cloudinary: cloudinaryStatus,
    timestamp: new Date()
  });
});

// ======================
// Root Endpoint
// ======================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cargo Shipment Tracker API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: 'https://your-docs-link.com'
  });
});

// ======================
// Error Handling
// ======================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // Handle Cloudinary specific errors
  if (err.name === 'CloudinaryError') {
    return res.status(502).json({
      success: false,
      message: 'Image service unavailable',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  shutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});