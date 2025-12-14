const express = require('express')
const router = express.Router()
const { getAdminLogs } = require('../../middleware/adminLogger')
const { verifySupabaseToken } = require('../../middleware/supabaseAuth');
const { verifyAdmin } = require('../../middleware/adminAuth');

// Get admin logs (admin only)
router.get('/logs', verifySupabaseToken, verifyAdmin, getAdminLogs)

module.exports = router
