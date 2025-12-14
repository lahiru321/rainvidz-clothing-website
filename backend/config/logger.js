const winston = require('winston')
const path = require('path')

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
)

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'rainvidz-backend' },
    transports: [
        // Error logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Combined logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Security logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/security.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
})

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }))
}

// Helper functions for common log types
logger.logSecurity = (message, meta = {}) => {
    logger.warn(message, { type: 'security', ...meta })
}

logger.logAuth = (message, meta = {}) => {
    logger.info(message, { type: 'auth', ...meta })
}

logger.logPayment = (message, meta = {}) => {
    logger.info(message, { type: 'payment', ...meta })
}

logger.logAdmin = (message, meta = {}) => {
    logger.info(message, { type: 'admin', ...meta })
}

module.exports = logger
