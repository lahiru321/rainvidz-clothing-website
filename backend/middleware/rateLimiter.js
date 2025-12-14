const rateLimit = require('express-rate-limit')

// General API rate limiter - prevents API abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 for dev, 100 for prod
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'You have exceeded the request limit. Please try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        })
    }
})

// Strict limiter for authentication endpoints - prevents brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 login/register attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many authentication attempts',
            message: 'Account temporarily locked. Please try again in 15 minutes.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        })
    }
})

// Payment endpoint limiter - prevents payment abuse
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 payment attempts per hour
    message: 'Too many payment attempts, please contact support.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many payment attempts',
            message: 'You have exceeded the payment limit. Please contact support if you need assistance.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        })
    }
})

// Admin action limiter - protects admin endpoints
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 admin actions per 15 minutes
    message: 'Too many admin actions, please slow down.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many admin actions',
            message: 'You are performing actions too quickly. Please wait before continuing.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        })
    }
})

module.exports = {
    apiLimiter,
    authLimiter,
    paymentLimiter,
    adminLimiter
}
