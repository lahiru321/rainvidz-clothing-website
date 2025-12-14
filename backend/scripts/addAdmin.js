#!/usr/bin/env node

/**
 * CLI Script to add admin users to the database
 * Usage: node scripts/addAdmin.js <supabaseUserId> [role]
 * 
 * Example:
 *   node scripts/addAdmin.js abc123-def456-ghi789 admin
 *   node scripts/addAdmin.js abc123-def456-ghi789 super_admin
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

const addAdmin = async (supabaseUserId, role = 'admin') => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Validate role
        const validRoles = ['admin', 'super_admin'];
        if (!validRoles.includes(role)) {
            console.error(`❌ Invalid role: ${role}`);
            console.error(`   Valid roles: ${validRoles.join(', ')}`);
            process.exit(1);
        }

        // Check if admin already exists
        const existing = await AdminUser.findOne({ supabaseUserId });
        if (existing) {
            console.log(`⚠️  Admin user already exists with role: ${existing.role}`);
            console.log('   Do you want to update the role? (This script will exit)');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new AdminUser({
            supabaseUserId,
            role
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log(`   Supabase User ID: ${supabaseUserId}`);
        console.log(`   Role: ${role}`);
        console.log(`   Created at: ${adminUser.createdAt}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding admin user:', error.message);
        process.exit(1);
    }
};

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node scripts/addAdmin.js <supabaseUserId> [role]');
    console.log('');
    console.log('Arguments:');
    console.log('  supabaseUserId  - The Supabase user ID (required)');
    console.log('  role            - Admin role: admin or super_admin (default: admin)');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/addAdmin.js abc123-def456-ghi789');
    console.log('  node scripts/addAdmin.js abc123-def456-ghi789 super_admin');
    console.log('');
    console.log('How to get Supabase User ID:');
    console.log('  1. Create a user account via your app\'s registration');
    console.log('  2. Go to Supabase Dashboard > Authentication > Users');
    console.log('  3. Find the user and copy their User ID');
    process.exit(1);
}

const [supabaseUserId, role] = args;
addAdmin(supabaseUserId, role);
