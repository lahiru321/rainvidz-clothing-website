const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    blacklistToken
} = require('../middleware/auth')
const { validateRegister, validateLogin } = require('../middleware/validators')
const logger = require('../config/logger')

// Register
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { email, password, name } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            logger.logSecurity('Registration attempt with existing email', { email, ip: req.ip })
            return res.status(400).json({ error: 'User already exists' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name
        })

        // Generate tokens
        const token = generateToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        logger.logAuth('User registered', { userId: user._id, email, ip: req.ip })

        res.status(201).json({
            message: 'User created successfully',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        logger.error('Registration error', { error: error.message, ip: req.ip })
        res.status(500).json({ error: 'Server error' })
    }
})

// Login
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            logger.logSecurity('Login attempt with non-existent email', { email, ip: req.ip })
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            logger.logSecurity('Failed login attempt - wrong password', { email, ip: req.ip })
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Generate tokens
        const token = generateToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        logger.logAuth('User logged in', { userId: user._id, email, ip: req.ip })

        res.json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        logger.error('Login error', { error: error.message, ip: req.ip })
        res.status(500).json({ error: 'Server error' })
    }
})

// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' })
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken)

        // Generate new access token
        const newToken = generateToken(decoded.userId)

        logger.logAuth('Token refreshed', { userId: decoded.userId, ip: req.ip })

        res.json({
            token: newToken
        })
    } catch (error) {
        logger.logSecurity('Invalid refresh token attempt', { error: error.message, ip: req.ip })
        res.status(401).json({ error: 'Invalid refresh token' })
    }
})

// Logout
router.post('/logout', verifyToken, (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (token) {
            blacklistToken(token)
        }

        logger.logAuth('User logged out', { userId: req.userId, ip: req.ip })

        res.json({ message: 'Logged out successfully' })
    } catch (error) {
        logger.error('Logout error', { error: error.message, ip: req.ip })
        res.status(500).json({ error: 'Server error' })
    }
})

// Get current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user })
    } catch (error) {
        logger.error('Get user error', { error: error.message, userId: req.userId })
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
