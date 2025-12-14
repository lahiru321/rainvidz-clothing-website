const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    supabaseUserId: {
        type: String,
        required: [true, 'Supabase user ID is required'],
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    }
}, {
    timestamps: true
});

// Indexes
adminUserSchema.index({ supabaseUserId: 1 });

module.exports = mongoose.model('AdminUser', adminUserSchema);
