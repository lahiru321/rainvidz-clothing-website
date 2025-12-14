const mongoose = require('mongoose')

const adminLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE_PRODUCT',
            'UPDATE_PRODUCT',
            'DELETE_PRODUCT',
            'CREATE_CATEGORY',
            'UPDATE_CATEGORY',
            'DELETE_CATEGORY',
            'CREATE_COLLECTION',
            'UPDATE_COLLECTION',
            'DELETE_COLLECTION',
            'UPDATE_ORDER_STATUS',
            'DELETE_ORDER',
            'UPLOAD_IMAGE',
            'CREATE_HOME_SECTION',
            'UPDATE_HOME_SECTION',
            'DELETE_HOME_SECTION',
            'OTHER'
        ]
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['Product', 'Category', 'Collection', 'Order', 'HomeSection', 'Upload', 'Other']
    },
    resourceId: {
        type: String
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE'],
        default: 'SUCCESS'
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
})

// Index for faster queries
adminLogSchema.index({ userId: 1, createdAt: -1 })
adminLogSchema.index({ action: 1, createdAt: -1 })
adminLogSchema.index({ createdAt: -1 })

module.exports = mongoose.model('AdminLog', adminLogSchema)
