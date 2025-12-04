const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Indexes
collectionSchema.index({ slug: 1 });
collectionSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
