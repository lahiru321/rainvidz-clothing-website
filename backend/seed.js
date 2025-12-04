require('dotenv').config();
const mongoose = require('mongoose');
const Collection = require('./models/Collection');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Collection.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create Collections
        console.log('📦 Creating collections...');
        const collections = await Collection.insertMany([
            {
                name: 'Summer Collection',
                slug: 'summer-collection',
                description: 'Light and breezy pieces for the warm season',
                imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
                isActive: true,
                displayOrder: 1
            },
            {
                name: 'New Arrivals',
                slug: 'new-arrivals',
                description: 'Fresh styles just landed',
                imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
                isActive: true,
                displayOrder: 2
            },
            {
                name: 'Trending Now',
                slug: 'trending-now',
                description: 'What everyone is wearing',
                imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
                isActive: true,
                displayOrder: 3
            }
        ]);
        console.log(`✅ Created ${collections.length} collections\n`);

        // Create Categories
        console.log('🏷️  Creating categories...');
        const categories = await Category.insertMany([
            {
                name: 'Tops',
                slug: 'tops',
                description: 'T-shirts, blouses, and more'
            },
            {
                name: 'Bottoms',
                slug: 'bottoms',
                description: 'Pants, skirts, and shorts'
            },
            {
                name: 'Dresses',
                slug: 'dresses',
                description: 'Casual and formal dresses'
            },
            {
                name: 'Accessories',
                slug: 'accessories',
                description: 'Complete your look'
            }
        ]);
        console.log(`✅ Created ${categories.length} categories\n`);

        // Create Products
        console.log('👕 Creating products...');
        const products = await Product.insertMany([
            // Product 1: Novela Tee - Black
            {
                name: 'Novela Tee - Black',
                slug: 'novela-tee-black',
                productCode: 'NT-BLK-001',
                description: 'A classic scoop neck tee with a fitted, cropped silhouette. Made from soft cotton blend for all-day comfort.',
                price: 3290,
                category: categories[0]._id, // Tops
                collection: collections[1]._id, // New Arrivals
                stockStatus: 'IN_STOCK',
                isNewArrival: true,
                isFeatured: true,
                soldCount: 45,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80&sat=-100',
                        isPrimary: false,
                        isHover: true,
                        displayOrder: 1
                    }
                ],
                variants: [
                    { color: 'Black', size: 'XS', quantity: 10, sku: 'NT-BLK-XS' },
                    { color: 'Black', size: 'S', quantity: 15, sku: 'NT-BLK-S' },
                    { color: 'Black', size: 'M', quantity: 20, sku: 'NT-BLK-M' },
                    { color: 'Black', size: 'L', quantity: 12, sku: 'NT-BLK-L' }
                ]
            },

            // Product 2: Novela Tee - Brown
            {
                name: 'Novela Tee - Brown',
                slug: 'novela-tee-brown',
                productCode: 'NT-BRN-001',
                description: 'A classic scoop neck tee with a fitted, cropped silhouette. Made from soft cotton blend for all-day comfort.',
                price: 3290,
                category: categories[0]._id,
                collection: collections[1]._id,
                stockStatus: 'IN_STOCK',
                isNewArrival: true,
                soldCount: 38,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80&sat=-100',
                        isPrimary: false,
                        isHover: true,
                        displayOrder: 1
                    }
                ],
                variants: [
                    { color: 'Brown', size: 'XS', quantity: 8, sku: 'NT-BRN-XS' },
                    { color: 'Brown', size: 'S', quantity: 12, sku: 'NT-BRN-S' },
                    { color: 'Brown', size: 'M', quantity: 18, sku: 'NT-BRN-M' },
                    { color: 'Brown', size: 'L', quantity: 10, sku: 'NT-BRN-L' }
                ]
            },

            // Product 3: Gia Tee - White
            {
                name: 'Gia Tee - White',
                slug: 'gia-tee-white',
                productCode: 'GT-WHT-001',
                description: 'Off-shoulder design with short sleeves and a fitted, cropped length. Perfect for summer days.',
                price: 2990,
                category: categories[0]._id,
                collection: collections[0]._id, // Summer Collection
                stockStatus: 'IN_STOCK',
                isNewArrival: true,
                isFeatured: true,
                soldCount: 52,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80&sat=-100',
                        isPrimary: false,
                        isHover: true,
                        displayOrder: 1
                    }
                ],
                variants: [
                    { color: 'White', size: 'XS', quantity: 15, sku: 'GT-WHT-XS' },
                    { color: 'White', size: 'S', quantity: 20, sku: 'GT-WHT-S' },
                    { color: 'White', size: 'M', quantity: 25, sku: 'GT-WHT-M' },
                    { color: 'White', size: 'L', quantity: 15, sku: 'GT-WHT-L' }
                ]
            },

            // Product 4: Kylie Tee - White
            {
                name: 'Kylie Tee - White',
                slug: 'kylie-tee-white',
                productCode: 'KT-WHT-001',
                description: 'Sleeveless tank top with a fitted, cropped silhouette. Essential summer staple.',
                price: 2990,
                category: categories[0]._id,
                collection: collections[0]._id,
                stockStatus: 'IN_STOCK',
                isNewArrival: true,
                soldCount: 41,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80&sat=-100',
                        isPrimary: false,
                        isHover: true,
                        displayOrder: 1
                    }
                ],
                variants: [
                    { color: 'White', size: 'XS', quantity: 12, sku: 'KT-WHT-XS' },
                    { color: 'White', size: 'S', quantity: 18, sku: 'KT-WHT-S' },
                    { color: 'White', size: 'M', quantity: 22, sku: 'KT-WHT-M' },
                    { color: 'White', size: 'L', quantity: 14, sku: 'KT-WHT-L' }
                ]
            },

            // Product 5: Bohemian Maxi Dress
            {
                name: 'Bohemian Maxi Dress',
                slug: 'bohemian-maxi-dress',
                productCode: 'BMD-FLR-001',
                description: 'Flowy maxi dress with floral print. Perfect for beach days and summer evenings.',
                price: 4990,
                salePrice: 3990,
                category: categories[2]._id, // Dresses
                collection: collections[2]._id, // Trending Now
                stockStatus: 'IN_STOCK',
                isFeatured: true,
                soldCount: 67,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    }
                ],
                variants: [
                    { color: 'Floral', size: 'S', quantity: 8, sku: 'BMD-FLR-S' },
                    { color: 'Floral', size: 'M', quantity: 12, sku: 'BMD-FLR-M' },
                    { color: 'Floral', size: 'L', quantity: 10, sku: 'BMD-FLR-L' }
                ]
            },

            // Product 6: Linen Wide Leg Pants
            {
                name: 'Linen Wide Leg Pants',
                slug: 'linen-wide-leg-pants',
                productCode: 'LWP-BGE-001',
                description: 'Comfortable wide-leg pants in breathable linen. Effortlessly chic.',
                price: 3790,
                category: categories[1]._id, // Bottoms
                collection: collections[0]._id,
                stockStatus: 'IN_STOCK',
                soldCount: 29,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    }
                ],
                variants: [
                    { color: 'Beige', size: 'S', quantity: 10, sku: 'LWP-BGE-S' },
                    { color: 'Beige', size: 'M', quantity: 15, sku: 'LWP-BGE-M' },
                    { color: 'Beige', size: 'L', quantity: 12, sku: 'LWP-BGE-L' },
                    { color: 'Black', size: 'S', quantity: 8, sku: 'LWP-BLK-S' },
                    { color: 'Black', size: 'M', quantity: 10, sku: 'LWP-BLK-M' },
                    { color: 'Black', size: 'L', quantity: 8, sku: 'LWP-BLK-L' }
                ]
            },

            // Product 7: Crochet Beach Bag
            {
                name: 'Crochet Beach Bag',
                slug: 'crochet-beach-bag',
                productCode: 'CBB-NAT-001',
                description: 'Handwoven crochet bag perfect for beach days or farmers market trips.',
                price: 2490,
                category: categories[3]._id, // Accessories
                collection: collections[0]._id,
                stockStatus: 'LOW_STOCK',
                soldCount: 15,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    }
                ],
                variants: [
                    { color: 'Natural', size: 'ONE SIZE', quantity: 5, sku: 'CBB-NAT-OS' }
                ]
            },

            // Product 8: Silk Scarf
            {
                name: 'Silk Scarf - Paisley',
                slug: 'silk-scarf-paisley',
                productCode: 'SS-PAI-001',
                description: 'Luxurious silk scarf with paisley print. Versatile accessory for any outfit.',
                price: 1990,
                category: categories[3]._id,
                collection: collections[2]._id,
                stockStatus: 'IN_STOCK',
                isFeatured: true,
                soldCount: 33,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
                        isPrimary: true,
                        isHover: false,
                        displayOrder: 0
                    }
                ],
                variants: [
                    { color: 'Paisley', size: 'ONE SIZE', quantity: 20, sku: 'SS-PAI-OS' }
                ]
            }
        ]);
        console.log(`✅ Created ${products.length} products\n`);

        // Summary
        console.log('📊 Seeding Summary:');
        console.log(`   Collections: ${collections.length}`);
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Products: ${products.length}`);
        console.log(`   Total Variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`);
        console.log('\n✅ Database seeding completed successfully!\n');

    } catch (error) {
        console.error('❌ Seeding error:', error);
        throw error;
    }
};

const run = async () => {
    await connectDB();
    await seedData();
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
};

run();
