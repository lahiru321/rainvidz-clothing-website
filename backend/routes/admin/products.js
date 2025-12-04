const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Apply auth middleware to all routes
router.use(verifyAuth);
router.use(verifyAdmin);

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product
 * @access  Admin
 */
router.post('/', async (req, res) => {
    try {
        const productData = req.body;

        // Create product
        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Create product error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: error.message,
                details: error.errors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Duplicate Error',
                message: 'Product with this slug or product code already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update a product
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find and update product
        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: error.message,
                details: error.errors
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Duplicate Error',
                message: 'Product with this slug or product code already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully',
            data: { id }
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/admin/products/stats
 * @desc    Get product statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ stockStatus: 'IN_STOCK' });
        const lowStockProducts = await Product.countDocuments({ stockStatus: 'LOW_STOCK' });
        const outOfStockProducts = await Product.countDocuments({ stockStatus: 'OUT_OF_STOCK' });
        const newArrivals = await Product.countDocuments({ isNewArrival: true });
        const featuredProducts = await Product.countDocuments({ isFeatured: true });

        // Get low stock products list
        const lowStockList = await Product.find({ stockStatus: 'LOW_STOCK' })
            .select('name productCode stockStatus')
            .limit(10);

        // Get best selling products
        const bestSelling = await Product.find()
            .sort({ soldCount: -1 })
            .limit(5)
            .select('name soldCount price primaryImage');

        res.json({
            success: true,
            data: {
                total: totalProducts,
                active: activeProducts,
                lowStock: lowStockProducts,
                outOfStock: outOfStockProducts,
                newArrivals,
                featured: featuredProducts,
                lowStockList,
                bestSelling
            }
        });
    } catch (error) {
        console.error('Get product stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
