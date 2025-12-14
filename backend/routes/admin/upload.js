const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, uploadOptions } = require('../../config/cloudinary');
const { verifySupabaseToken } = require('../../middleware/supabaseAuth');
const { verifyAdmin } = require('../../middleware/adminAuth');


// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only jpg and png
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG and PNG images are allowed'), false);
        }
    }
});

// Protect all routes
router.use(verifySupabaseToken);
router.use(verifyAdmin);


/**
 * @route   POST /api/admin/upload
 * @desc    Upload image to Cloudinary
 * @access  Admin
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to Cloudinary using buffer
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/upload/:publicId
 * @desc    Delete image from Cloudinary
 * @access  Admin
 */
router.delete('/:publicId(*)', async (req, res) => {
    try {
        const publicId = req.params.publicId;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found or already deleted'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/admin/upload/multiple
 * @desc    Upload multiple images to Cloudinary
 * @access  Admin
 */
router.post('/multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }

        // Upload all images
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            width: result.width,
                            height: result.height,
                            format: result.format,
                            size: result.bytes
                        });
                    }
                );
                uploadStream.end(file.buffer);
            });
        });

        const results = await Promise.all(uploadPromises);

        res.json({
            success: true,
            message: `${results.length} images uploaded successfully`,
            data: results
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
});

module.exports = router;
