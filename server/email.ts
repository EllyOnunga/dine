import nodemailer from 'nodemailer';
import { logger } from './logger';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      logger.error({ err: error }, 'Email service configuration error');
    } else {
      logger.info('Email service is ready');
    }
  });
}

export interface ReservationEmailData {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  requests?: string | null;
}

export interface EnquiryEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface OrderStatusEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  status: string;
}

export interface CustomOrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  message: string;
}

export interface AdminOrderEmailData extends OrderConfirmationEmailData {
  // Same as confirmation but for admin
}

export interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: Date;
  status: string;
  items: Array<{
    itemName: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Send reservation confirmation email to customer
 */
export async function sendReservationConfirmation(data: ReservationEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping reservation confirmation');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'Reservation Confirmation - Savannah Restaurant',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Reservation Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for choosing Savannah Restaurant! We're excited to host you.</p>
            
            <div class="details">
              <h2 style="color: #667eea; margin-top: 0;">Reservation Details</h2>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Guests:</span>
                <span>${data.guests} ${data.guests === 1 ? 'person' : 'people'}</span>
              </div>
              ${data.requests ? `
              <div class="detail-row">
                <span class="detail-label">Special Requests:</span>
                <span>${data.requests}</span>
              </div>
              ` : ''}
            </div>

            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Please arrive 10 minutes before your reservation time</li>
              <li>We'll hold your table for 15 minutes past the reservation time</li>
              <li>If you need to cancel or modify, please contact us at least 2 hours in advance</li>
            </ul>

            <p>We look forward to serving you!</p>
            
            <div class="footer">
              <p><strong>Savannah Restaurant</strong></p>
              <p>Nairobi, Kenya | Phone: +254 710 297 603</p>
              <p>Email: reservations@savannahrestaurant.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ email: data.email }, 'Reservation confirmation email sent');
  } catch (error) {
    logger.error({ err: error, email: data.email }, 'Failed to send reservation confirmation');
    throw error;
  }
}

/**
 * Send reservation notification to restaurant admin
 */
export async function sendReservationNotificationToAdmin(data: ReservationEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) {
    logger.warn('Email service not configured, skipping admin notification');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New Reservation: ${data.name} - ${data.date} at ${data.time}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d3748; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f7fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📅 New Reservation Alert</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <p><strong>Customer:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Party Size:</strong> ${data.guests} guests</p>
              ${data.requests ? `<p><strong>Special Requests:</strong> ${data.requests}</p>` : ''}
            </div>
            <p><em>Please prepare accordingly and confirm the reservation if needed.</em></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ adminEmail: process.env.ADMIN_EMAIL }, 'Admin notification sent');
  } catch (error) {
    logger.error({ err: error }, 'Failed to send admin notification');
    // Don't throw - admin notification failure shouldn't block the reservation
  }
}

/**
 * Send enquiry notification to admin
 */
export async function sendEnquiryNotification(data: EnquiryEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) {
    logger.warn('Email service not configured, skipping enquiry notification');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: data.email,
    subject: `📧 New Enquiry: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d3748; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f7fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 New Customer Enquiry</h2>
          </div>
          <div class="content">
            <p><strong>From:</strong> ${data.name} (${data.email})</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <div class="message-box">
              <h3>Message:</h3>
              <p>${data.message.replace(/\n/g, '<br>')}</p>
            </div>
            <p><em>Reply directly to this email to respond to the customer.</em></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ adminEmail: process.env.ADMIN_EMAIL }, 'Enquiry notification sent');
  } catch (error) {
    logger.error({ err: error }, 'Failed to send enquiry notification');
    throw error;
  }
}

/**
 * Send enquiry confirmation to customer
 */
export async function sendEnquiryConfirmation(data: EnquiryEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping enquiry confirmation');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'We have received your enquiry - Savannah Restaurant',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
          .message-preview { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4a5568; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #2d3748; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-family: serif;">Savannah Restaurant</h1>
            <p style="margin-top:10px; opacity: 0.8;">Enquiry Receipt</p>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for reaching out to us! We've received your message regarding <strong>"${data.subject}"</strong> and our team is already looking into it.</p>
            
            <div class="message-preview">
              <p style="margin-top:0; color: #4a5568; font-weight: bold; font-size: 12px; text-transform: uppercase;">Your Message Content:</p>
              <p style="margin:0; font-style: italic;">"${data.message.replace(/\n/g, '<br>')}"</p>
            </div>

            <p>We aim to respond to all enquiries within 24 hours. In the meantime, feel free to browse our latest menu or make a reservation online.</p>

            <div style="text-align: center;">
              <a href="#" class="btn">View Our Menu</a>
            </div>
            
            <div class="footer">
              <p><strong>Savannah Restaurant</strong></p>
              <p>Nairobi, Kenya | +254 710 297 603</p>
              <p>&copy; ${new Date().getFullYear()} Savannah Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ email: data.email }, 'Enquiry confirmation email sent');
  } catch (error) {
    logger.error({ err: error, email: data.email }, 'Failed to send enquiry confirmation');
  }
}

/**
 * Send welcome email to newsletter subscriber
 */
export async function sendNewsletterWelcome(email: string): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping newsletter welcome');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to Savannah Restaurant Newsletter! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefit-item { padding: 10px 0; display: flex; align-items: start; }
          .benefit-icon { font-size: 24px; margin-right: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Our Family!</h1>
          </div>
          <div class="content">
            <p>Thank you for subscribing to the Savannah Restaurant newsletter!</p>
            
            <div class="benefits">
              <h2 style="color: #667eea; margin-top: 0;">What You'll Receive:</h2>
              <div class="benefit-item">
                <span class="benefit-icon">🍽️</span>
                <span>Exclusive menu previews and seasonal specials</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span>Special offers and promotions for subscribers</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">📅</span>
                <span>Updates on events and special dining experiences</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">👨‍🍳</span>
                <span>Chef's tips and behind-the-scenes stories</span>
              </div>
            </div>

            <p>We promise to only send you the good stuff - no spam, just delicious updates!</p>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>See you soon at Savannah!</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ email }, 'Newsletter welcome email sent');
  } catch (error) {
    logger.error({ err: error, email }, 'Failed to send newsletter welcome');
    // Don't throw - newsletter welcome failure shouldn't block the subscription
  }
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusUpdate(data: OrderStatusEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping order status update');
    return;
  }

  logger.info({ orderId: data.orderId, status: data.status, to: data.customerEmail }, 'Sending order status update email');

  const statusColors: Record<string, string> = {
    'pending': '#f6ad55',
    'confirmed': '#4299e1',
    'preparing': '#9f7aea',
    'out_for_delivery': '#38b2ac',
    'delivered': '#48bb78',
    'cancelled': '#f56565'
  };

  const statusLabels: Record<string, string> = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  const currentColor = statusColors[data.status] || '#667eea';
  const currentLabel = statusLabels[data.status] || data.status;

  const mailOptions = {
    from: `"Savannah Restaurant" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Order Status Update: ${currentLabel} - Savannah Restaurant`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d3748; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { 
            display: inline-block; 
            padding: 10px 20px; 
            background: ${currentColor}; 
            color: white; 
            border-radius: 20px; 
            font-weight: bold;
            margin: 20px 0;
          }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍴 Savannah Restaurant</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Your order status has been updated!</p>
            
            <div style="text-align: center;">
              <div class="status-badge">${currentLabel.toUpperCase()}</div>
            </div>

            <div class="order-info">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PUBLIC_URL || 'http://localhost:3000'}/track-order?id=${data.orderId}" 
                 style="background: ${currentColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
                Track Your Progress Live
              </a>
            </div>

            <p>We'll keep you updated as your delicious meal makes its way to you.</p>
            
            <p>If you have any questions, please feel free to reach out to us.</p>
            
            <div class="footer">
              <p><strong>Savannah Restaurant</strong></p>
              <p>Nairobi, Kenya | +254 710 297 603</p>
              <p>Thank you for choosing us!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ orderId: data.orderId, status: data.status }, 'Order status email sent');
  } catch (error) {
    logger.error({ err: error, orderId: data.orderId }, 'Failed to send order status email');
  }
}

/**
 * Send a custom message about an order to a customer
 */
export async function sendOrderCustomMessage(data: CustomOrderEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping custom order message');
    return;
  }

  const mailOptions = {
    from: `"Savannah Restaurant Support" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Update regarding your Order #${data.orderId.slice(-4).toUpperCase()} - Savannah Restaurant`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d3748; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f7fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Communication</h2>
          </div>
          <div class="content">
            <p>We have a message for you regarding your recent order <strong>#${data.orderId.slice(-4).toUpperCase()}</strong>:</p>
            
            <div class="message-box">
              ${data.message.replace(/\n/g, '<br>')}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PUBLIC_URL || 'http://localhost:3000'}/track-order?id=${data.orderId}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
                View Order Progress
              </a>
            </div>

            <p>If you need to discuss this further, please reply to this email or call us.</p>
            
            <div class="footer">
              <p><strong>Savannah Restaurant</strong></p>
              <p>Nairobi, Kenya | +254 710 297 603</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ orderId: data.orderId }, 'Custom order message email sent');
  } catch (error) {
    logger.error({ err: error, orderId: data.orderId }, 'Failed to send custom order message');
    throw error;
  }
}

/**
 * Send full order details email (Confirmed/Receipt)
 */
export async function sendOrderDetailsEmail(data: OrderConfirmationEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email service not configured, skipping full order details email');
    return;
  }

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.itemName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Savannah Restaurant" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderId.slice(-4).toUpperCase()} - Savannah Restaurant`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc; }
          .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: #1a202c; color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-family: serif; font-size: 28px; letter-spacing: 1px; }
          .content { padding: 30px; }
          .order-status { text-align: center; margin-bottom: 30px; }
          .status-tag { display: inline-block; padding: 6px 16px; background: #ebf8ff; color: #2b6cb0; border-radius: 9999px; font-weight: bold; font-size: 14px; text-transform: uppercase; }
          .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .summary-table th { text-align: left; font-size: 12px; text-transform: uppercase; color: #718096; padding: 10px; border-bottom: 2px solid #edf2f7; }
          .total-row { font-weight: bold; font-size: 18px; color: #1a202c; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7; }
          .info-item h4 { margin: 0 0 8px 0; color: #718096; font-size: 12px; text-transform: uppercase; }
          .info-item p { margin: 0; font-size: 14px; font-weight: 500; }
          .footer { text-align: center; padding: 30px; color: #a0aec0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>🍴 Savannah Restaurant</h1>
              <p style="margin-top: 10px; opacity: 0.8;">Order Confirmation</p>
            </div>
            <div class="content">
              <p>Hello <strong>${data.customerName}</strong>,</p>
              <p>Great news! Your order has been <strong>${data.status}</strong> and is being prepared with care by our chefs.</p>
              
              <div class="order-status">
                <span class="status-tag">${data.status}</span>
              </div>

              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 20px 10px 10px; text-align: right;">Grand Total:</td>
                    <td style="padding: 20px 10px 10px; text-align: right; color: #C0841D;">KSh ${data.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div class="info-grid">
                <div class="info-item">
                  <h4>Order Details</h4>
                  <p>#${data.orderId.slice(-8).toUpperCase()}</p>
                  <p>${new Date(data.createdAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div class="info-item">
                  <h4>Customer Info</h4>
                  <p>${data.customerPhone}</p>
                  <p>${data.customerEmail}</p>
                </div>
              </div>

              <div class="info-item" style="margin-top: 20px;">
                <h4>Delivery Address</h4>
                <p>${data.deliveryAddress}</p>
              </div>

              <div class="info-item" style="margin-top: 20px;">
                <h4>Payment Method</h4>
                <p style="text-transform: capitalize;">${data.paymentMethod} (${data.paymentMethod === 'cash' ? 'Pay on Delivery' : 'Paid Online'})</p>
              </div>

              <div style="margin-top: 40px; text-align: center; border-top: 2px solid #edf2f7; padding-top: 30px;">
                <p style="margin-bottom: 20px; color: #718096; font-size: 14px;">Want to see where your food is?</p>
                <a href="${process.env.PUBLIC_URL || 'http://localhost:3000'}/track-order?id=${data.orderId}" 
                   style="background: #C0841D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(192, 132, 29, 0.2);">
                  Track My Order Now
                </a>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>Savannah Restaurant | Nairobi, Kenya</p>
            <p>If you have any questions about your order, please call us at +254 710 297 603</p>
            <p>&copy; ${new Date().getFullYear()} Savannah Restaurant</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ orderId: data.orderId, to: data.customerEmail }, 'Full order details email sent to customer');
  } catch (error) {
    logger.error({ err: error, orderId: data.orderId, to: data.customerEmail }, 'Failed to send full order details email to customer');
    throw error;
  }
}

/**
 * Send order notification to admin
 */
export async function sendOrderNotificationToAdmin(data: AdminOrderEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) {
    logger.warn('Email service not configured, skipping admin order notification');
    return;
  }

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.itemName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Savannah System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 NEW ORDER #${data.orderId.slice(-4).toUpperCase()} - ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #e2e8f0; border-radius: 12px; }
          .header { background: #2d3748; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { font-weight: bold; font-size: 18px; color: #2d3748; }
          .customer-box { background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 New Order Received!</h2>
          </div>
          
          <div class="customer-box">
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Phone:</strong> ${data.customerPhone}</p>
            <p><strong>Address:</strong> ${data.deliveryAddress}</p>
          </div>

          <h3>Order Items:</h3>
          <table class="summary-table">
            <thead>
              <tr style="text-align: left; background: #edf2f7;">
                <th style="padding:10px;">Item</th>
                <th style="padding:10px;">Qty</th>
                <th style="padding:10px;">Price</th>
                <th style="padding:10px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total">
                <td colspan="3" style="padding: 20px 10px 10px; text-align: right;">Grand Total:</td>
                <td style="padding: 20px 10px 10px; text-align: right;">KSh ${data.totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Time:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://savannah.restaurant/admin' : 'http://localhost:3000/admin'}" 
               style="background: #2d3748; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Manage Order in Dashboard
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ orderId: data.orderId, to: process.env.ADMIN_EMAIL }, 'Admin order notification sent');
  } catch (error) {
    logger.error({ err: error, orderId: data.orderId }, 'Failed to send admin order notification');
  }
}
