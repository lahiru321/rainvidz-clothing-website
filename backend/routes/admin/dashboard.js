const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Apply auth middleware to all routes
router.use(verifyAuth);
router.use(verifyAdmin);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get overall dashboard statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
    try {
        // Product stats
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ stockStatus: 'IN_STOCK' });
        const lowStockProducts = await Product.countDocuments({ stockStatus: 'LOW_STOCK' });

        // Order stats
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
        const processingOrders = await Order.countDocuments({ status: 'PROCESSING' });
        const shippedOrders = await Order.countDocuments({ status: 'SHIPPED' });

        // Revenue calculation
        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id email firstName lastName totalAmount status createdAt items');

        // Low stock products
        const lowStockList = await Product.find({ stockStatus: 'LOW_STOCK' })
            .select('name productCode stockStatus primaryImage')
            .limit(5);

        // Best selling products
        const bestSelling = await Product.find()
            .sort({ soldCount: -1 })
            .limit(5)
            .select('name soldCount price primaryImage');

        res.json({
            success: true,
            data: {
                products: {
                    total: totalProducts,
                    active: activeProducts,
                    lowStock: lowStockProducts
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders,
                    processing: processingOrders,
                    shipped: shippedOrders
                },
                revenue: {
                    total: totalRevenue
                },
                recentOrders,
                lowStockList,
                bestSelling
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
