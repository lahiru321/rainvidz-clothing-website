const express = require('express');
const router = express.Router();
const HomeSection = require('../../models/HomeSection');
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Apply auth middleware to all routes
router.use(verifyAuth);
router.use(verifyAdmin);

/**
 * @route   GET /api/admin/home-sections
 * @desc    Get all home sections
 * @access  Admin
 */
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};

        const sections = await HomeSection.find(filter)
            .sort({ type: 1, displayOrder: 1 });

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

/**
 * @route   GET /api/admin/home-sections/:id
 * @desc    Get a single home section
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
    try {
        const section = await HomeSection.findById(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Home section not found'
            });
        }

        res.json({
            success: true,
            data: section
        });
    } catch (error) {
        console.error('Get home section error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/admin/home-sections
 * @desc    Create a new home section
 * @access  Admin
 */
router.post('/', async (req, res) => {
    try {
        const section = new HomeSection(req.body);
        await section.save();

        res.status(201).json({
            success: true,
            data: section,
            message: 'Home section created successfully'
        });
    } catch (error) {
        console.error('Create home section error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/home-sections/:id
 * @desc    Update a home section
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const section = await HomeSection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Home section not found'
            });
        }

        res.json({
            success: true,
            data: section,
            message: 'Home section updated successfully'
        });
    } catch (error) {
        console.error('Update home section error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/home-sections/:id
 * @desc    Delete a home section
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const section = await HomeSection.findByIdAndDelete(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Home section not found'
            });
        }

        res.json({
            success: true,
            message: 'Home section deleted successfully'
        });
    } catch (error) {
        console.error('Delete home section error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
