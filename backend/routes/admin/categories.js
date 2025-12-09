const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Apply auth middleware to all routes
router.use(verifyAuth);
router.use(verifyAdmin);

/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category
 * @access  Admin
 */
router.post('/', async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        // Check if category with slug already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: 'Category with this slug already exists'
            });
        }

        const category = new Category({
            name,
            slug,
            description
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update a category
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        // Check if slug is being changed and if it already exists
        if (slug) {
            const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    error: 'Category with this slug already exists'
                });
            }
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, slug, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category,
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete a category
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has products
        const productCount = await Product.countDocuments({ category: id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete category',
                message: `This category has ${productCount} product(s). Please reassign or delete them first.`
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/admin/categories/stats
 * @desc    Get category statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments();

        // Get categories with product counts
        const categoriesWithCounts = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    productCount: { $size: '$products' }
                }
            },
            {
                $sort: { productCount: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalCategories,
                categories: categoriesWithCounts
            }
        });
    } catch (error) {
        console.error('Get category stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
