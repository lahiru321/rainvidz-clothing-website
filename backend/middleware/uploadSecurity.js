const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const logger = require('../config/logger')

// Whitelist of allowed MIME types
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
]

// Whitelist of allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Generate secure random filename
const generateSecureFilename = (originalname) => {
    const randomName = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(originalname).toLowerCase()
    const timestamp = Date.now()
    return `${timestamp}-${randomName}${ext}`
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const secureFilename = generateSecureFilename(file.originalname)
        cb(null, secureFilename)
    }
})

// File filter for security
const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        logger.logSecurity('Invalid file type upload attempt', {
            mimetype: file.mimetype,
            originalname: file.originalname,
            ip: req.ip,
            userId: req.userId
        })
        return cb(new Error(`Invalid file type. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed.`), false)
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        logger.logSecurity('Invalid file extension upload attempt', {
            extension: ext,
            originalname: file.originalname,
            ip: req.ip,
            userId: req.userId
        })
        return cb(new Error(`Invalid file extension. Only ${ALLOWED_EXTENSIONS.join(', ')} are allowed.`), false)
    }

    // Check for double extensions (e.g., file.php.jpg)
    const filename = path.basename(file.originalname, ext)
    if (filename.includes('.')) {
        logger.logSecurity('Double extension upload attempt', {
            originalname: file.originalname,
            ip: req.ip,
            userId: req.userId
        })
        return cb(new Error('Invalid filename. Double extensions are not allowed.'), false)
    }

    cb(null, true)
}

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only one file at a time
    },
    fileFilter: fileFilter
})

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
            })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Too many files',
                message: 'Only one file can be uploaded at a time'
            })
        }
        return res.status(400).json({
            error: 'Upload error',
            message: err.message
        })
    }

    if (err) {
        logger.error('File upload error', { error: err.message, ip: req.ip })
        return res.status(400).json({
            error: 'Upload failed',
            message: err.message
        })
    }

    next()
}

module.exports = {
    upload,
    handleUploadError,
    generateSecureFilename,
    ALLOWED_MIME_TYPES,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE
}
