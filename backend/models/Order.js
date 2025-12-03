const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    supabaseUserId: {
        type: String, // Optional for guest checkout
        trim: true
    },
    // Guest checkout fields
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    // Order details
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'],
        default: 'PENDING'
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    paymentMethod: {
        type: String,
        enum: ['PAYHERE', 'WEBXPAY', 'COD']
    },
    paymentId: {
        type: String,
        trim: true
    },
    trackingNumber: {
        type: String,
        trim: true
    },
    // Address snapshot
    shippingAddress: {
        addressLine1: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        }
    },
    // Order items (embedded)
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName: {
            type: String,
            required: true
        },
        productCode: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtPurchase: {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ supabaseUserId: 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentId: 1 });

// Virtual for order number (formatted ID)
orderSchema.virtual('orderNumber').get(function () {
    return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Virtual for subtotal
orderSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
