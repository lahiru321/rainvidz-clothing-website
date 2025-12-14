const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const { verifySupabaseToken } = require('../../middleware/supabaseAuth');
const { verifyAdmin } = require('../../middleware/adminAuth');
const logger = require('../../config/logger')

// Middleware to check if user is super admin
const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)

        if (!user || user.role !== 'admin') {
            logger.logSecurity('Unauthorized super admin access attempt', {
                userId: req.userId,
                ip: req.ip
            })
            return res.status(403).json({
                error: 'Access denied',
                message: 'Super admin privileges required'
            })
        }

        next()
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
}

/**
 * @route   PUT /api/admin/users/:userId/role
 * @desc    Update user role (admin only)
 * @access  Admin
 */
router.put('/users/:userId/role', verifySupabaseToken, isSuperAdmin, async (req, res) => {
    try {
        const { userId } = req.params
        const { role } = req.body

        // Validate role
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                error: 'Invalid role',
                message: 'Role must be either "user" or "admin"'
            })
        }

        // Find user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Prevent self-demotion
        if (userId === req.userId && role === 'user') {
            return res.status(400).json({
                error: 'Cannot demote yourself',
                message: 'You cannot remove your own admin privileges'
            })
        }

        // Update role
        user.role = role
        await user.save()

        logger.logAdmin('User role updated', {
            adminId: req.userId,
            targetUserId: userId,
            newRole: role,
            ip: req.ip
        })

        res.json({
            success: true,
            message: `User role updated to ${role}`,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        logger.error('Update user role error', { error: error.message })
        res.status(500).json({ error: 'Server error' })
    }
})

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get('/users', verifySupabaseToken, isSuperAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query

        const query = {}
        if (role) query.role = role
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ]
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const count = await User.countDocuments(query)

        res.json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        })
    } catch (error) {
        logger.error('Get users error', { error: error.message })
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
