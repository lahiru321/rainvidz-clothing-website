#!/usr/bin/env node

/**
 * CLI Script to list all admin users
 * Usage: node scripts/listAdmins.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

const listAdmins = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all admin users
        const admins = await AdminUser.find().sort({ createdAt: -1 });

        if (admins.length === 0) {
            console.log('ℹ️  No admin users found');
            process.exit(0);
        }

        console.log(`📋 Found ${admins.length} admin user(s):\n`);
        console.log('─'.repeat(80));

        admins.forEach((admin, index) => {
            console.log(`\n${index + 1}. Supabase User ID: ${admin.supabaseUserId}`);
            console.log(`   Role: ${admin.role}`);
            console.log(`   Created: ${admin.createdAt.toLocaleString()}`);
            console.log(`   Updated: ${admin.updatedAt.toLocaleString()}`);
        });

        console.log('\n' + '─'.repeat(80));
        console.log(`\nTotal: ${admins.length} admin(s)\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error listing admins:', error.message);
        process.exit(1);
    }
};

listAdmins();
