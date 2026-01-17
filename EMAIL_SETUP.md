# Email Configuration Guide

## 🔧 Gmail SMTP Setup (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication

1. Go to <https://myaccount.google.com/security>
2. Enable 2-Step Verification

### Step 2: Generate App Password

1. Go to <https://myaccount.google.com/apppasswords>
2. Select "Mail" and "Other (Custom name)"
3. Name it "Savannah Restaurant"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Configure .env

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop  # No spaces!
ADMIN_EMAIL=your-email@gmail.com
```

### Common Gmail Issues

#### Issue 1: "Cannot reach smtp.gmail.com from Docker"

**Solution**: Add to `docker-compose.yml`:

```yaml
services:
  app:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

#### Issue 2: "Authentication failed"

- Ensure you're using App Password, not regular password
- Remove spaces from the app password
- Check username is full email address

#### Issue 3: "Connection timeout"

- Check firewall allows outbound port 587
- Try port 465 with `SMTP_SECURE=true`

---

## 🚀 Alternative Email Providers

### Option 1: Mailtrap (Best for Testing)

**Free tier**: 500 emails/month  
**Perfect for**: Development and testing

```bash
# Sign up at https://mailtrap.io
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
ADMIN_EMAIL=admin@yourdomain.com
```

**Pros**:

- ✅ No authentication issues
- ✅ Email preview in web interface
- ✅ No risk of sending to real users during testing
- ✅ Works from anywhere (no firewall issues)

**Cons**:

- ❌ Emails don't actually send (testing only)

---

### Option 2: SendGrid (Best for Production)

**Free tier**: 100 emails/day forever  
**Perfect for**: Production use

```bash
# Sign up at https://sendgrid.com
# Create API key at https://app.sendgrid.com/settings/api_keys

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxx  # Your API key
ADMIN_EMAIL=admin@yourdomain.com
```

**Pros**:

- ✅ Reliable delivery
- ✅ Email analytics
- ✅ No Gmail restrictions
- ✅ Free tier is generous

**Cons**:

- ❌ Requires domain verification for production

**Setup Steps**:

1. Sign up at <https://sendgrid.com>
2. Verify your email
3. Create API key (Settings → API Keys)
4. Copy API key to `SMTP_PASS`
5. Use `apikey` as `SMTP_USER`

---

### Option 3: Mailgun (Good for High Volume)

**Free tier**: 5,000 emails/month for 3 months  
**Perfect for**: Growing businesses

```bash
# Sign up at https://mailgun.com

SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
ADMIN_EMAIL=admin@yourdomain.com
```

**Pros**:

- ✅ High deliverability
- ✅ Detailed analytics
- ✅ API access

**Cons**:

- ❌ Requires credit card for free tier
- ❌ Domain verification required

---

### Option 4: AWS SES (Best for Scale)

**Free tier**: 62,000 emails/month (if sending from EC2)  
**Perfect for**: AWS-hosted applications

```bash
# Set up in AWS Console
# Get SMTP credentials from SES console

SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
ADMIN_EMAIL=admin@yourdomain.com
```

**Pros**:

- ✅ Extremely cheap at scale
- ✅ High deliverability
- ✅ Integrates with AWS ecosystem

**Cons**:

- ❌ Complex setup
- ❌ Starts in sandbox mode (limited)
- ❌ Requires AWS account

---

### Option 5: Brevo (formerly Sendinblue)

**Free tier**: 300 emails/day  
**Perfect for**: Small to medium businesses

```bash
# Sign up at https://brevo.com

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-brevo-smtp-key
ADMIN_EMAIL=admin@yourdomain.com
```

**Pros**:

- ✅ No credit card required
- ✅ Good free tier
- ✅ Marketing tools included

---

## 🧪 Testing Email Configuration

### Method 1: Using Node.js Script

Create `test-email.js`:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

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
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Savannah Restaurant',
      text: 'If you receive this, your email is configured correctly!',
      html: '<b>If you receive this, your email is configured correctly!</b>',
    });

    console.log('✅ Test email sent!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
```

Run it:

```bash
node test-email.js
```

### Method 2: Using Docker

```bash
docker-compose exec app node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transport.verify()
  .then(() => console.log('✅ SMTP OK'))
  .catch(err => console.error('❌ SMTP Error:', err.message));
"
```

### Method 3: Using curl (Test SMTP connection)

```bash
# Test connection to SMTP server
curl -v telnet://smtp.gmail.com:587
```

---

## 🔧 Docker Network Fix

If Gmail works outside Docker but not inside, add DNS servers:

**Update `docker-compose.yml`**:

```yaml
services:
  app:
    build: .
    dns:
      - 8.8.8.8  # Google DNS
      - 8.8.4.4
    environment:
      - DATABASE_URL=postgresql://admin:admin@db:5432/dine_db
      - SESSION_SECRET=your-secret-key-here
      - NODE_ENV=production
      # ... rest of env vars
```

**Or update `docker-compose.prod.yml`**:

```yaml
services:
  app:
    build: .
    dns:
      - 8.8.8.8
      - 1.1.1.1  # Cloudflare DNS
    # ... rest of config
```

---

## 📋 Quick Comparison

| Provider | Free Tier | Setup Difficulty | Best For |
|----------|-----------|------------------|----------|
| **Mailtrap** | 500/month | ⭐ Easy | Testing |
| **SendGrid** | 100/day | ⭐⭐ Medium | Production |
| **Gmail** | ~500/day | ⭐⭐ Medium | Small apps |
| **Mailgun** | 5000/month | ⭐⭐⭐ Hard | Growing apps |
| **AWS SES** | 62000/month | ⭐⭐⭐⭐ Very Hard | Scale |
| **Brevo** | 300/day | ⭐⭐ Medium | Marketing |

---

## 🎯 My Recommendation

### For Development/Testing

**Use Mailtrap**

- No authentication issues
- See emails in web interface
- Works from anywhere

### For Production

**Use SendGrid**

- Reliable and free
- Easy setup
- Good deliverability
- No daily limits on free tier

---

## 🚨 Common Errors & Solutions

### Error: "ECONNREFUSED"

**Cause**: Cannot connect to SMTP server  
**Solution**:

- Check firewall
- Verify SMTP_HOST and SMTP_PORT
- Try different port (465 instead of 587)

### Error: "Invalid login"

**Cause**: Wrong credentials  
**Solution**:

- For Gmail: Use App Password, not regular password
- For SendGrid: Use 'apikey' as username
- Remove any spaces from password

### Error: "ETIMEDOUT"

**Cause**: Network/firewall blocking  
**Solution**:

- Add DNS servers to Docker
- Check corporate firewall
- Try different email provider

### Error: "self signed certificate"

**Cause**: SSL certificate issue  
**Solution**:

```javascript
// In server/email.ts, add:
const transporter = nodemailer.createTransport({
  // ... existing config
  tls: {
    rejectUnauthorized: false  // Only for development!
  }
});
```

---

## 📞 Need Help?

1. **Test with Mailtrap first** - Eliminates authentication issues
2. **Check Docker logs**: `docker-compose logs app | grep email`
3. **Verify .env file**: `cat .env | grep SMTP`
4. **Test outside Docker**: Run `node test-email.js` directly

---

**Updated**: 2026-01-17  
**Status**: Ready to configure ✅
