const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { verifyAuth, optionalAuth } = require('../middleware/auth');

/**
 * @route   POST /api/orders/create
 * @desc    Create new order
 * @access  Public (supports guest checkout)
 */
router.post('/create', optionalAuth, async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phone,
            shippingAddress,
            items, // For guest checkout
            paymentMethod
        } = req.body;

        // Validation
        if (!email || !firstName || !lastName || !phone || !shippingAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        let orderItems = [];
        let totalAmount = 0;

        // Prioritize items from request body (for local cart)
        // If no items in request, try to get from database cart (for authenticated users)
        if (items && items.length > 0) {
            // Items provided in request (local cart checkout)
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        error: `Product not found: ${item.productId}`
                    });
                }

                const variant = product.variants.find(v =>
                    v.sku === item.variantId || v._id.toString() === item.variantId
                );

                if (!variant || variant.quantity < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        error: `Insufficient stock for ${product.name}`
                    });
                }

                const price = product.salePrice || product.price;
                orderItems.push({
                    productId: product._id,
                    productName: product.name,
                    productCode: product.productCode,
                    color: variant.color,
                    size: variant.size,
                    quantity: item.quantity,
                    priceAtPurchase: price
                });

                totalAmount += price * item.quantity;
            }
        } else if (req.userId) {
            // No items in request, try database cart (authenticated users only)
            const cart = await Cart.findOne({ supabaseUserId: req.userId })
                .populate('items.productId');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cart is empty'
                });
            }

            // Build order items from cart
            for (const item of cart.items) {
                const product = item.productId;
                const variant = product.variants.find(v =>
                    v.sku === item.variantId || v._id.toString() === item.variantId
                );

                if (!variant || variant.quantity < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        error: `Insufficient stock for ${product.name}`,
                        product: product.name
                    });
                }

                const price = product.salePrice || product.price;
                orderItems.push({
                    productId: product._id,
                    productName: product.name,
                    productCode: product.productCode,
                    color: variant.color,
                    size: variant.size,
                    quantity: item.quantity,
                    priceAtPurchase: price
                });

                totalAmount += price * item.quantity;
            }
        } else {
            // No items provided and user not authenticated
            return res.status(400).json({
                success: false,
                error: 'No items provided'
            });
        }

        // Create order
        const order = await Order.create({
            supabaseUserId: req.userId || null,
            email,
            firstName,
            lastName,
            phone,
            shippingAddress,
            items: orderItems,
            totalAmount,
            paymentMethod,
            status: 'PENDING'
        });

        // If authenticated, clear cart
        if (req.userId) {
            const cart = await Cart.findOne({ supabaseUserId: req.userId });
            if (cart) {
                await cart.clearCart();
            }
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/orders/user
 * @desc    Get user's order history
 * @access  Private
 */
router.get('/user', verifyAuth, async (req, res) => {
    try {
        const orders = await Order.find({ supabaseUserId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get specific order details
 * @access  Public (guests can view their orders, authenticated users can only view their own)
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // If user is authenticated, check if order belongs to them
        if (req.userId && order.supabaseUserId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
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

module.exports = router;
