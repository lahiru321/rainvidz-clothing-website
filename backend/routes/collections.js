const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Product = require('../models/Product');

/**
 * @route   GET /api/collections
 * @desc    Get all active collections
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const collections = await Collection.find({ isActive: true })
            .sort({ displayOrder: 1, createdAt: -1 });

        res.json({
            success: true,
            data: collections
        });
    } catch (error) {
        console.error('Get collections error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/collections/:slug
 * @desc    Get collection by slug with products
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
    try {
        const collection = await Collection.findOne({
            slug: req.params.slug,
            isActive: true
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                error: 'Collection not found'
            });
        }

        // Get products in this collection
        const products = await Product.find({ collection: collection._id })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                collection,
                products
            }
        });
    } catch (error) {
        console.error('Get collection error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
