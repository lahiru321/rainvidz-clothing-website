const { createClient } = require('@supabase/supabase-js')
const logger = require('../config/logger')

// Validate environment variables
if (!process.env.SUPABASE_URL) {
    console.error('❌ SUPABASE_URL is not defined in .env file')
    process.exit(1)
}

if (!process.env.SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_ANON_KEY is not defined in .env file')
    console.error('Please add these to backend/.env:')
    console.error('SUPABASE_URL=your_supabase_url')
    console.error('SUPABASE_ANON_KEY=your_supabase_anon_key')
    process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

/**
 * Middleware to verify Supabase JWT token
 * Extracts user ID from Supabase token and attaches to req.userId
 */
const verifySupabaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            })
        }

        const token = authHeader.split(' ')[1]

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            logger.logSecurity('Invalid Supabase token attempt', {
                error: error?.message,
                ip: req.ip
            })
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            })
        }

        // Attach user ID to request
        req.userId = user.id
        req.userEmail = user.email

        next()
    } catch (error) {
        logger.error('Supabase token verification error', { error: error.message })
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token verification failed'
        })
    }
}

module.exports = {
    verifySupabaseToken
}
