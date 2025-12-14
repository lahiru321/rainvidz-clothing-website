const { body, param, validationResult } = require('express-validator')

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        })
    }
    next()
}

// Product validation rules
const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

    body('price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID'),

    handleValidationErrors
]

// User registration validation
const validateRegister = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    handleValidationErrors
]

// User login validation
const validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
]

// Order validation
const validateOrder = [
    body('shippingAddress.fullName')
        .trim()
        .notEmpty().withMessage('Full name is required'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),

    body('shippingAddress.address')
        .trim()
        .notEmpty().withMessage('Address is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty().withMessage('Postal code is required'),

    body('paymentMethod')
        .isIn(['payhere', 'cod']).withMessage('Invalid payment method'),

    handleValidationErrors
]

// Category validation
const validateCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Description must be less than 200 characters'),

    handleValidationErrors
]

// Collection validation
const validateCollection = [
    body('name')
        .trim()
        .notEmpty().withMessage('Collection name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),

    handleValidationErrors
]

// MongoDB ID validation
const validateMongoId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),

    handleValidationErrors
]

module.exports = {
    validateProduct,
    validateRegister,
    validateLogin,
    validateOrder,
    validateCategory,
    validateCollection,
    validateMongoId,
    handleValidationErrors
}
