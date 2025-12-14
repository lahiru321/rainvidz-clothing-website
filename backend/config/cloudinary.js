const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload options
const uploadOptions = {
    folder: 'clothing-website',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
    ]
};

module.exports = {
    cloudinary,
    uploadOptions
};
