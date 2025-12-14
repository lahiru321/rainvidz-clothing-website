const csrf = require('csurf')
const cookieParser = require('cookie-parser')

// CSRF protection middleware
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict'
    }
})

// Endpoint to get CSRF token
const getCsrfToken = (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
}

module.exports = {
    csrfProtection,
    getCsrfToken,
    cookieParser
}
