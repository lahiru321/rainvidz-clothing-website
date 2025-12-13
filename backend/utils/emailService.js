const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Create transporter
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('items.productId');

        if (!order) {
            throw new Error('Order not found');
        }

        const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.color}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Rs ${item.priceAtPurchase.toLocaleString()}</td>
      </tr>
    `).join('');

        const mailOptions = {
            from: `"Rainvidz" <${process.env.SMTP_USER}>`,
            to: order.email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #A7C1A8; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 20px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f0f0f0; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Hi ${order.firstName},</p>
              <p>We've received your order and will process it shortly.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                
                <h3 style="margin-top: 20px;">Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
                
                <div class="total">
                  Total: Rs ${order.totalAmount.toLocaleString()}
                </div>
                
                <h3 style="margin-top: 20px;">Shipping Address</h3>
                <p>
                  ${order.shippingAddress.addressLine1}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
                </p>
              </div>
              
              <p>We'll send you another email when your order ships.</p>
              <p>If you have any questions, please contact us at hello@rainvidz.com</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Rainvidz. All rights reserved.</p>
              <p>Colombo, Sri Lanka</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

// Send payment failed email
exports.sendPaymentFailedEmail = async (orderId) => {
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        const mailOptions = {
            from: `"Rainvidz" <${process.env.SMTP_USER}>`,
            to: order.email,
            subject: `Payment Failed - Order ${order.orderNumber}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Failed</h1>
            </div>
            <div class="content">
              <p>Hi ${order.firstName},</p>
              <p>Unfortunately, your payment for order ${order.orderNumber} could not be processed.</p>
              <p>Please try again or contact us for assistance.</p>
              <p>Order Amount: Rs ${order.totalAmount.toLocaleString()}</p>
              <p>If you have any questions, please contact us at hello@rainvidz.com</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Payment failed email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending payment failed email:', error);
        throw error;
    }
};
