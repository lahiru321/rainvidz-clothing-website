const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    supabaseUserId: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true,
        trim: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variantId: {
            type: String, // Reference to variant within product (e.g., variant SKU or index)
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes
cartSchema.index({ supabaseUserId: 1 });
cartSchema.index({ 'items.productId': 1 });

// Method to add item to cart
cartSchema.methods.addItem = function (productId, variantId, quantity = 1) {
    const existingItemIndex = this.items.findIndex(
        item => item.productId.toString() === productId.toString() && item.variantId === variantId
    );

    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({ productId, variantId, quantity });
    }

    return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
    const item = this.items.id(itemId);
    if (item) {
        item.quantity = quantity;
    }
    return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
