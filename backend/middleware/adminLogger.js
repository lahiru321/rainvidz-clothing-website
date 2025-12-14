const AdminLog = require('../models/AdminLog')
const logger = require('../config/logger')

// Log admin action
const logAdminAction = async (req, action, resourceType, resourceId = null, details = {}, status = 'SUCCESS', errorMessage = null) => {
    try {
        const log = await AdminLog.create({
            userId: req.userId,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            status,
            errorMessage
        })

        // Also log to Winston for immediate visibility
        logger.logAdmin(`Admin action: ${action}`, {
            userId: req.userId,
            resourceType,
            resourceId,
            status,
            ip: req.ip
        })

        return log
    } catch (error) {
        // Don't fail the request if logging fails
        logger.error('Failed to log admin action', { error: error.message })
    }
}

// Middleware to automatically log admin actions
const adminLogger = (action, resourceType) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send

        // Override send function to log after response
        res.send = function (data) {
            // Determine status based on response
            const status = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILURE'

            // Get resource ID from params or body
            const resourceId = req.params.id || req.body._id || req.body.id

            // Log the action
            logAdminAction(
                req,
                action,
                resourceType,
                resourceId,
                {
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode
                },
                status,
                status === 'FAILURE' ? data : null
            )

            // Call original send
            originalSend.call(this, data)
        }

        next()
    }
}

// Get admin logs (for admin dashboard)
const getAdminLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, userId, action, startDate, endDate } = req.query

        const query = {}

        if (userId) query.userId = userId
        if (action) query.action = action
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        const logs = await AdminLog.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const count = await AdminLog.countDocuments(query)

        res.json({
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        })
    } catch (error) {
        logger.error('Error fetching admin logs', { error: error.message })
        res.status(500).json({ error: 'Failed to fetch admin logs' })
    }
}

module.exports = {
    logAdminAction,
    adminLogger,
    getAdminLogs
}
