require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Testing Email Configuration...\n');

// Show current config (hide password)
console.log('Current Configuration:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
console.log('  SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
console.log('  SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ NOT SET');
console.log('');

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Error: SMTP credentials not configured in .env file\n');
    console.log('Please set SMTP_USER and SMTP_PASS in your .env file');
    console.log('See EMAIL_SETUP.md for instructions\n');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function testEmail() {
    try {
        console.log('📡 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        console.log('📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"Savannah Restaurant Test" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: '✅ Email Configuration Test - Savannah Restaurant',
            text: 'Congratulations! Your email configuration is working correctly.',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667eea;">✅ Success!</h1>
            <p>Your email configuration is working correctly.</p>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>SMTP Host: ${process.env.SMTP_HOST}</li>
              <li>SMTP Port: ${process.env.SMTP_PORT}</li>
              <li>From: ${process.env.SMTP_USER}</li>
            </ul>
            <p>You can now receive reservation confirmations and notifications!</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This is a test email from Savannah Restaurant application.
            </p>
          </div>
        </div>
      `,
        });

        console.log('✅ Test email sent successfully!\n');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Sent to:', process.env.ADMIN_EMAIL || process.env.SMTP_USER);
        console.log('\n🎉 Email configuration is working perfectly!');
        console.log('Check your inbox (or Mailtrap if using that)\n');

    } catch (error) {
        console.error('\n❌ Email test failed!\n');
        console.error('Error:', error.message);
        console.error('\nCommon issues:');
        console.error('  1. Wrong SMTP credentials');
        console.error('  2. For Gmail: Use App Password, not regular password');
        console.error('  3. For SendGrid: Use "apikey" as username');
        console.error('  4. Check firewall/network settings\n');
        console.error('Full error details:', error);
        process.exit(1);
    }
}

testEmail();
