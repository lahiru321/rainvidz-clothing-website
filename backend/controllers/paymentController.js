const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Generate PayHere hash for payment verification
const generatePayHereHash = (merchantId, orderId, amount, currency, merchantSecret) => {
    const hash = crypto
        .createHash('md5')
        .update(
            merchantId +
            orderId +
            parseFloat(amount).toFixed(2) +
            currency +
            crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
        )
        .digest('hex')
        .toUpperCase();
    return hash;
};

// Initiate payment
exports.initiatePayment = async (req, res) => {
    try {
        const { orderId, amount, customerDetails } = req.body;

        // Validate order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Generate hash for PayHere
        const hash = generatePayHereHash(
            process.env.PAYHERE_MERCHANT_ID,
            orderId,
            amount,
            'LKR',
            process.env.PAYHERE_MERCHANT_SECRET
        );

        const paymentData = {
            merchant_id: process.env.PAYHERE_MERCHANT_ID,
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            notify_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
            order_id: orderId,
            items: 'Order Items',
            currency: 'LKR',
            amount: parseFloat(amount).toFixed(2),
            first_name: customerDetails.firstName,
            last_name: customerDetails.lastName,
            email: customerDetails.email,
            phone: customerDetails.phone,
            address: customerDetails.address,
            city: customerDetails.city,
            country: 'Sri Lanka',
            hash: hash
        };

        res.json({ success: true, paymentData });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Handle PayHere webhook
exports.handleWebhook = async (req, res) => {
    try {
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig
        } = req.body;

        // Verify hash
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
        const hash = crypto
            .createHash('md5')
            .update(
                merchant_id +
                order_id +
                payhere_amount +
                payhere_currency +
                status_code +
                crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
            )
            .digest('hex')
            .toUpperCase();

        if (hash !== md5sig) {
            console.error('Invalid webhook signature');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Update order and payment based on status
        if (status_code === '2') { // Success
            await Order.findByIdAndUpdate(order_id, {
                paymentStatus: 'completed',
                status: 'PAID',
                transactionId: payment_id,
                paymentId: payment_id
            });

            await Payment.create({
                orderId: order_id,
                paymentId: payment_id,
                paymentMethod: 'payhere',
                amount: parseFloat(payhere_amount),
                currency: payhere_currency,
                status: 'completed',
                transactionId: payment_id,
                paymentData: req.body
            });

            // TODO: Send confirmation email
            console.log(`Payment successful for order ${order_id}`);
        } else if (status_code === '-2') { // Failed
            await Order.findByIdAndUpdate(order_id, {
                paymentStatus: 'failed',
                status: 'FAILED'
            });

            await Payment.create({
                orderId: order_id,
                paymentId: payment_id,
                paymentMethod: 'payhere',
                amount: parseFloat(payhere_amount),
                currency: payhere_currency,
                status: 'failed',
                transactionId: payment_id,
                paymentData: req.body,
                failureReason: 'Payment declined'
            });
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payment = await Payment.findOne({ orderId }).sort({ createdAt: -1 });
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({
            success: true,
            payment: payment || null,
            order: {
                status: order.status,
                paymentStatus: order.paymentStatus,
                transactionId: order.transactionId
            }
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create COD order
exports.createCODOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentMethod: 'COD',
                paymentStatus: 'pending',
                status: 'PENDING'
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Create payment record
        await Payment.create({
            orderId: orderId,
            paymentMethod: 'cod',
            amount: order.totalAmount,
            currency: 'LKR',
            status: 'pending'
        });

        res.json({ success: true, order });
    } catch (error) {
        console.error('COD order error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
