const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// PayHere webhook
router.post('/webhook', paymentController.handleWebhook);

// Get payment status
router.get('/:orderId', paymentController.getPaymentStatus);

// Create COD order
router.post('/cod', paymentController.createCODOrder);

module.exports = router;
