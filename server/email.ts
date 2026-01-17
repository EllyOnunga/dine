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
    requests?: string;
}

export interface EnquiryEmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
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
              <p>Nairobi, Kenya | Phone: +254 XXX XXX XXX</p>
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
