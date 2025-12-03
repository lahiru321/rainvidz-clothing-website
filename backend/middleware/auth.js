const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for server-side auth verification
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Middleware to verify Supabase JWT token
 * Attaches user object to req.user if valid
 */
const verifyAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authorization token provided'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
        }

        // Attach user to request object
        req.user = user;
        req.userId = user.id; // Supabase user ID

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error verifying authentication'
        });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token
 * Useful for endpoints that work for both authenticated and guest users
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabase.auth.getUser(token);

            if (user) {
                req.user = user;
                req.userId = user.id;
            }
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};

module.exports = { verifyAuth, optionalAuth };
