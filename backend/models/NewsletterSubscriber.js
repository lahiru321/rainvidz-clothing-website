const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    subscribed: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'checkout',
        trim: true
    }
}, {
    timestamps: true
});

// Indexes
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ subscribed: 1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
