const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    supabaseUserId: {
        type: String,
        required: [true, 'Supabase user ID is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    addressLine1: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    newsletterSubscribed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
userSchema.index({ supabaseUserId: 1 });
userSchema.index({ email: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || '';
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
