const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['hero', 'banner'],
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    ctaText: {
        type: String,
        default: 'Shop Now'
    },
    ctaLink: {
        type: String,
        default: '/shop'
    },
    backgroundColor: {
        type: String,
        default: '#A7C1A8' // Sage green
    },
    season: {
        type: String,
        trim: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
homeSectionSchema.index({ type: 1, displayOrder: 1, isActive: 1 });

module.exports = mongoose.model('HomeSection', homeSectionSchema);
