const express = require('express');
const router = express.Router();
const HomeSection = require('../models/HomeSection');

/**
 * @route   GET /api/home-sections
 * @desc    Get active home sections (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = { isActive: true };

        if (type) {
            filter.type = type;
        }

        const sections = await HomeSection.find(filter)
            .sort({ displayOrder: 1 })
            .select('-__v');

        res.json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error('Get home sections error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
