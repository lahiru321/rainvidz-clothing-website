require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const morgan = require('morgan');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const { apiLimiter, authLimiter, paymentLimiter, adminLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "https://www.payhere.lk"],
            connectSrc: ["'self'", process.env.FRONTEND_URL],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Sanitize data to prevent XSS attacks
app.use(xss());

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    // Log to file in production
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// Apply strict rate limiting to authentication routes (before general limiter)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply payment rate limiting
app.use('/api/payment/', paymentLimiter);

// Apply admin rate limiting
app.use('/api/admin/', adminLimiter);

// Public API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/home-sections', require('./routes/homeSections'));
app.use('/api/payment', require('./routes/payment'));

// Admin API routes (protected)
app.use('/api/admin/products', require('./routes/admin/products'));
app.use('/api/admin/categories', require('./routes/admin/categories'));
app.use('/api/admin/collections', require('./routes/admin/collections'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));
app.use('/api/admin/home-sections', require('./routes/admin/homeSections'));
app.use('/api/admin/upload', require('./routes/admin/upload'));
app.use('/api/admin/logs', require('./routes/admin/logs'));
app.use('/api/admin', require('./routes/admin/users'));


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});
