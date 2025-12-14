const express = require('express');
const router = express.Router();
const Collection = require('../../models/Collection');
const Product = require('../../models/Product');
const { verifySupabaseToken } = require('../../middleware/supabaseAuth');
const { verifyAdmin } = require('../../middleware/adminAuth');


// Apply auth middleware to all routes
router.use(verifySupabaseToken);
router.use(verifyAdmin);


/**
 * @route   POST /api/admin/collections
 * @desc    Create a new collection
 * @access  Admin
 */
router.post('/', async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        // Check if collection with slug already exists
        const existingCollection = await Collection.findOne({ slug });
        if (existingCollection) {
            return res.status(400).json({
                success: false,
                error: 'Collection with this slug already exists'
            });
        }

        const collection = new Collection({
            name,
            slug,
            description
        });

        await collection.save();

        res.status(201).json({
            success: true,
            data: collection,
            message: 'Collection created successfully'
        });
    } catch (error) {
        console.error('Create collection error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/collections/:id
 * @desc    Update a collection
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        // Check if slug is being changed and if it already exists
        if (slug) {
            const existingCollection = await Collection.findOne({ slug, _id: { $ne: id } });
            if (existingCollection) {
                return res.status(400).json({
                    success: false,
                    error: 'Collection with this slug already exists'
                });
            }
        }

        const collection = await Collection.findByIdAndUpdate(
            id,
            { name, slug, description },
            { new: true, runValidators: true }
        );

        if (!collection) {
            return res.status(404).json({
                success: false,
                error: 'Collection not found'
            });
        }

        res.json({
            success: true,
            data: collection,
            message: 'Collection updated successfully'
        });
    } catch (error) {
        console.error('Update collection error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/collections/:id
 * @desc    Delete a collection
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if collection has products
        const productCount = await Product.countDocuments({ collection: id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete collection',
                message: `This collection has ${productCount} product(s). Please reassign or delete them first.`
            });
        }

        const collection = await Collection.findByIdAndDelete(id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                error: 'Collection not found'
            });
        }

        res.json({
            success: true,
            message: 'Collection deleted successfully'
        });
    } catch (error) {
        console.error('Delete collection error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/admin/collections/stats
 * @desc    Get collection statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
    try {
        const totalCollections = await Collection.countDocuments();

        // Get collections with product counts
        const collectionsWithCounts = await Collection.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'collection',
                    as: 'products'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    productCount: { $size: '$products' }
                }
            },
            {
                $sort: { productCount: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalCollections,
                collections: collectionsWithCounts
            }
        });
    } catch (error) {
        console.error('Get collection stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;
