const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { verifySupabaseToken } = require('../middleware/supabaseAuth');

// All cart routes require authentication
router.use(verifySupabaseToken);

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ supabaseUserId: req.userId })
            .populate({
                path: 'items.productId',
                select: 'name slug price salePrice images variants productCode'
            });

        // Create cart if doesn't exist
        if (!cart) {
            cart = await Cart.create({ supabaseUserId: req.userId, items: [] });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/add', async (req, res) => {
    try {
        const { productId, variantId, quantity = 1 } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Validate variant exists and has stock
        const variant = product.variants.find(v => v.sku === variantId || v._id.toString() === variantId);
        if (!variant) {
            return res.status(404).json({
                success: false,
                error: 'Variant not found'
            });
        }

        if (variant.quantity < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock',
                available: variant.quantity
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ supabaseUserId: req.userId });
        if (!cart) {
            cart = await Cart.create({ supabaseUserId: req.userId, items: [] });
        }

        // Add item to cart
        await cart.addItem(productId, variantId, quantity);

        // Populate and return updated cart
        cart = await Cart.findOne({ supabaseUserId: req.userId })
            .populate({
                path: 'items.productId',
                select: 'name slug price salePrice images variants productCode'
            });

        res.json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/cart/update/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/update/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid quantity'
            });
        }

        const cart = await Cart.findOne({ supabaseUserId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        await cart.updateItemQuantity(req.params.itemId, quantity);

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({ supabaseUserId: req.userId })
            .populate({
                path: 'items.productId',
                select: 'name slug price salePrice images variants productCode'
            });

        res.json({
            success: true,
            message: 'Cart updated',
            data: updatedCart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/cart/remove/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/remove/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ supabaseUserId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        await cart.removeItem(req.params.itemId);

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({ supabaseUserId: req.userId })
            .populate({
                path: 'items.productId',
                select: 'name slug price salePrice images variants productCode'
            });

        res.json({
            success: true,
            message: 'Item removed from cart',
            data: updatedCart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/clear', async (req, res) => {
    try {
        const cart = await Cart.findOne({ supabaseUserId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        await cart.clearCart();

        res.json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
