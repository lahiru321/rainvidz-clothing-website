const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products with filters and sorting
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const {
            category,
            collection,
            isNewArrival,
            isFeatured,
            minPrice,
            maxPrice,
            color,
            size,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) filter.category = category;
        if (collection) filter.collection = collection;
        if (isNewArrival) filter.isNewArrival = isNewArrival === 'true';
        if (isFeatured) filter.isFeatured = isFeatured === 'true';

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Color/Size filter (check variants)
        if (color || size) {
            const variantFilter = {};
            if (color) variantFilter.color = color;
            if (size) variantFilter.size = size;

            filter['variants'] = {
                $elemMatch: {
                    ...variantFilter,
                    quantity: { $gt: 0 } // Only in-stock variants
                }
            };
        }

        // Build sort object
        const sortOptions = {};
        if (sortBy === 'price') {
            sortOptions.price = order === 'asc' ? 1 : -1;
        } else if (sortBy === 'soldCount') {
            sortOptions.soldCount = -1; // Best selling
        } else if (sortBy === 'name') {
            sortOptions.name = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = order === 'asc' ? 1 : -1; // Newest
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .populate('collection', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/products/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category', 'name slug')
            .populate('collection', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/products/:id/variants
 * @desc    Get product variants
 * @access  Public
 */
router.get('/:id/variants', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('variants');

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product.variants
        });
    } catch (error) {
        console.error('Get variants error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
