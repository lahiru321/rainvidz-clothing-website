const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    productCode: {
        type: String,
        required: [true, 'Product code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    salePrice: {
        type: Number,
        min: [0, 'Sale price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },
    stockStatus: {
        type: String,
        enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
        default: 'IN_STOCK'
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    soldCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Embedded images array
    images: [{
        url: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        isHover: {
            type: Boolean,
            default: false
        },
        displayOrder: {
            type: Number,
            default: 0
        }
    }],
    // Embedded variants array
    variants: [{
        color: {
            type: String,
            required: true,
            trim: true
        },
        size: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        }
    }]
}, {
    timestamps: true
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ productCode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ 'variants.sku': 1 }, { sparse: true });

// Virtual for checking if product is on sale
productSchema.virtual('isOnSale').get(function () {
    return this.salePrice && this.salePrice < this.price;
});

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function () {
    return this.isOnSale ? this.salePrice : this.price;
});

// Transform to add primary and hover image URLs at root level
productSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        // Add primary image URL at root level
        const primaryImage = ret.images?.find(img => img.isPrimary);
        ret.primaryImage = primaryImage ? primaryImage.url : (ret.images?.[0]?.url || '');

        // Add hover image URL at root level
        const hoverImage = ret.images?.find(img => img.isHover);
        ret.hoverImage = hoverImage ? hoverImage.url : ret.primaryImage;

        return ret;
    }
});

productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
