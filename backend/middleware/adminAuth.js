const AdminUser = require('../models/AdminUser');

/**
 * Middleware to check if authenticated user is an admin
 * Must be used AFTER verifyAuth middleware
 */
const verifyAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated (should be set by verifyAuth middleware)
        if (!req.userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        // Check if user is in admin_users collection
        const adminUser = await AdminUser.findOne({ supabaseUserId: req.userId });

        if (!adminUser) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required'
            });
        }

        // Attach admin role to request
        req.adminRole = adminUser.role;
        req.isAdmin = true;

        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error verifying admin access'
        });
    }
};

/**
 * Middleware to check if user is a super admin
 * Must be used AFTER verifyAuth middleware
 */
const verifySuperAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        const adminUser = await AdminUser.findOne({
            supabaseUserId: req.userId,
            role: 'super_admin'
        });

        if (!adminUser) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Super admin access required'
            });
        }

        req.adminRole = 'super_admin';
        req.isSuperAdmin = true;

        next();
    } catch (error) {
        console.error('Super admin auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error verifying super admin access'
        });
    }
};

module.exports = { verifyAdmin, verifySuperAdmin };
