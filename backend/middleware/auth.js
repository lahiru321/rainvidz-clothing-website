const jwt = require('jsonwebtoken')
const logger = require('../config/logger')

// Token blacklist for logout (in production, use Redis)
const tokenBlacklist = new Set()

// Generate access token (short-lived)
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h', // 1 hour access token
            algorithm: 'HS256'
        }
    )
}

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        {
            expiresIn: '7d', // 7 days refresh token
            algorithm: 'HS256'
        }
    )
}

// Verify access token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            })
        }

        const token = authHeader.split(' ')[1]

        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            logger.logSecurity('Attempt to use blacklisted token', {
                ip: req.ip,
                token: token.substring(0, 10) + '...'
            })
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token has been revoked'
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check if it's a refresh token being used as access token
        if (decoded.type === 'refresh') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token type'
            })
        }

        req.userId = decoded.userId
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            })
        }

        logger.logSecurity('Invalid token attempt', {
            ip: req.ip,
            error: error.message
        })

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        })
    }
}

// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        )

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type')
        }

        return decoded
    } catch (error) {
        throw error
    }
}

// Blacklist token (logout)
const blacklistToken = (token) => {
    tokenBlacklist.add(token)

    // Auto-remove from blacklist after expiry (1 hour)
    setTimeout(() => {
        tokenBlacklist.delete(token)
    }, 60 * 60 * 1000)

    logger.logAuth('Token blacklisted', {
        token: token.substring(0, 10) + '...'
    })
}

// Clean up expired tokens from blacklist (run periodically)
const cleanupBlacklist = () => {
    // In production, this would be handled by Redis TTL
    // For now, tokens auto-remove after 1 hour via setTimeout
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    blacklistToken,
    cleanupBlacklist
}
