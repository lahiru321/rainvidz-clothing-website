const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/categories/:slug
 * @desc    Get category by slug with products
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Get products in this category
        const products = await Product.find({ category: category._id })
            .populate('collection', 'name slug')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                category,
                products
            }
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
