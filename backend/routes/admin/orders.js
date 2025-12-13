const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Apply auth middleware to all routes
router.use(verifyAuth);
router.use(verifyAdmin);

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with filters
 * @access  Admin
 */
router.get('/', async (req, res) => {
    try {
        const {
            status,
            paymentMethod,
            startDate,
            endDate,
            search,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        // Build filter object
        const filter = {};

        if (status) filter.status = status.toUpperCase();
        if (paymentMethod) filter.paymentMethod = paymentMethod.toUpperCase();

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Search by email or order ID
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { _id: search }
            ];
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const orders = await Order.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        // Get total count
        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order details
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Admin
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status: status.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/admin/orders/stats
 * @desc    Get order statistics
 * @access  Admin
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        // Count by status
        const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
        const paidOrders = await Order.countDocuments({ status: 'PAID' });
        const processingOrders = await Order.countDocuments({ status: 'PROCESSING' });
        const shippedOrders = await Order.countDocuments({ status: 'SHIPPED' });
        const deliveredOrders = await Order.countDocuments({ status: 'DELIVERED' });
        const cancelledOrders = await Order.countDocuments({ status: 'CANCELLED' });

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id email totalAmount status createdAt');

        res.json({
            success: true,
            data: {
                total: totalOrders,
                byStatus: {
                    pending: pendingOrders,
                    paid: paidOrders,
                    processing: processingOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                },
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
