# Production Deployment Guide

This guide covers deploying the Savannah Restaurant application to production with all critical features enabled.

## 🚀 Quick Start (Production)

```bash
# 1. Clone the repository
git clone https://github.com/EllyOnunga/dine.git
cd dine

# 2. Set up environment variables
cp .env.example .env
nano .env  # Edit with your production values

# 3. Generate SSL certificates (replace with your domain)
./setup-ssl.sh yourdomain.com admin@yourdomain.com

# 4. Start all services
docker-compose -f docker-compose.prod.yml up -d

# 5. Check health
curl https://yourdomain.com/health
```

---

## 📋 Prerequisites

### Required

- **Docker** & **Docker Compose** installed
- **Domain name** pointing to your server
- **Ports 80 and 443** open in firewall
- **Email account** for SMTP (Gmail, SendGrid, etc.)

### Recommended

- At least **2GB RAM**
- **2 CPU cores**
- **20GB disk space**

---

## 🔧 Configuration

### 1. Environment Variables

Edit `.env` with your production values:

```bash
# Database
DATABASE_URL=postgresql://admin:secure_password@db:5432/dine_db

# Server
NODE_ENV=production
PORT=3000

# Session (IMPORTANT: Generate a secure random string)
SESSION_SECRET=$(openssl rand -base64 32)

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

### 2. Email Setup

#### Option A: Gmail

1. Enable 2-Factor Authentication
2. Generate App Password: <https://myaccount.google.com/apppasswords>
3. Use the app password in `SMTP_PASS`

#### Option B: SendGrid

1. Sign up at <https://sendgrid.com>
2. Create API key
3. Configure:

   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

#### Option C: AWS SES

1. Verify your domain in AWS SES
2. Create SMTP credentials
3. Configure with your SES SMTP endpoint

---

## 🔐 SSL/HTTPS Setup

### Automatic (Recommended)

Use the provided script:

```bash
./setup-ssl.sh yourdomain.com admin@yourdomain.com
```

This will:

1. Create temporary self-signed certificate
2. Start Nginx
3. Obtain Let's Encrypt certificate
4. Configure auto-renewal

### Manual

```bash
# 1. Create self-signed cert (temporary)
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -days 1 \
  -subj "/CN=yourdomain.com"

# 2. Start services
docker-compose -f docker-compose.prod.yml up -d

# 3. Get Let's Encrypt certificate
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@yourdomain.com \
  --agree-tos \
  -d yourdomain.com

# 4. Update nginx.conf to use Let's Encrypt certs
# Edit nginx.conf and change:
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# 5. Restart Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🗄️ Database Migrations

The application uses **migration-based** database schema management for production safety.

### How It Works

1. **Development**: Make schema changes in `shared/schema.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Review Migration**: Check `migrations/` folder
4. **Apply in Production**: Automatically runs on container start

### Manual Migration

```bash
# Inside the container
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Rollback (if needed)

Migrations are versioned. To rollback:

1. Identify the migration file to revert
2. Manually create a down migration
3. Apply it using `npm run db:migrate`

---

## 📧 Email Notifications

The application sends emails for:

### 1. Reservation Confirmations

- **To**: Customer
- **When**: New reservation created
- **Content**: Reservation details, arrival instructions

### 2. Reservation Notifications

- **To**: Admin (ADMIN_EMAIL)
- **When**: New reservation created
- **Content**: Customer details, party size, special requests

### 3. Enquiry Notifications

- **To**: Admin (ADMIN_EMAIL)
- **When**: Contact form submitted
- **Content**: Customer message with reply-to email

### 4. Newsletter Welcome

- **To**: Subscriber
- **When**: Newsletter signup
- **Content**: Welcome message, subscription benefits

### Testing Email

```bash
# Send test reservation
curl -X POST https://yourdomain.com/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "date": "2026-01-20",
    "time": "19:00",
    "guests": 2
  }'
```

---

## 🔍 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f db

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 app
```

### Health Checks

```bash
# Application health
curl https://yourdomain.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-17T...",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected"
}
```

### Structured Logs

Logs are in JSON format for easy parsing:

```json
{
  "level": 30,
  "time": 1768658026983,
  "pid": 51,
  "hostname": "container-id",
  "msg": "serving on port 3000"
}
```

Log levels:

- `10` = trace
- `20` = debug
- `30` = info
- `40` = warn
- `50` = error
- `60` = fatal

---

## 🔄 Updates & Maintenance

### Deploying Updates

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Check health
curl https://yourdomain.com/health
```

### Database Backups

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U admin dine_db > backup-$(date +%Y%m%d).sql

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U admin dine_db < backup-20260117.sql
```

### Automated Backups (Recommended)

Add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/dine && docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U admin dine_db | gzip > /backups/dine-$(date +\%Y\%m\%d).sql.gz
```

---

## 🚨 Troubleshooting

### Issue: SSL Certificate Not Working

**Symptoms**: Browser shows "Not Secure" or certificate error

**Solutions**:

1. Check DNS: `dig yourdomain.com` should point to your server
2. Check port 80 is accessible: `curl http://yourdomain.com/.well-known/acme-challenge/test`
3. Check certbot logs: `docker-compose -f docker-compose.prod.yml logs certbot`
4. Verify firewall allows ports 80 and 443

### Issue: Emails Not Sending

**Symptoms**: No emails received, logs show email errors

**Solutions**:

1. Check SMTP credentials in `.env`
2. For Gmail: Ensure App Password is used, not regular password
3. Check logs: `docker-compose -f docker-compose.prod.yml logs app | grep email`
4. Test SMTP connection:

   ```bash
   docker-compose -f docker-compose.prod.yml exec app node -e "
   const nodemailer = require('nodemailer');
   const transport = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
   });
   transport.verify().then(console.log).catch(console.error);
   "
   ```

### Issue: Database Connection Failed

**Symptoms**: Health check shows `database: "disconnected"`

**Solutions**:

1. Check database is running: `docker-compose -f docker-compose.prod.yml ps db`
2. Check database logs: `docker-compose -f docker-compose.prod.yml logs db`
3. Verify DATABASE_URL in `.env`
4. Restart database: `docker-compose -f docker-compose.prod.yml restart db`

### Issue: High Memory Usage

**Symptoms**: Server slow, OOM errors

**Solutions**:

1. Check container stats: `docker stats`
2. Increase server resources
3. Add swap space
4. Optimize database queries
5. Consider adding Redis caching

---

## 📊 Performance Optimization

### Enable Gzip Compression

Already configured in `nginx.conf`

### Add Redis Caching (Optional)

```yaml
# Add to docker-compose.prod.yml
redis:
  image: redis:7-alpine
  networks:
    - app-network
  volumes:
    - redis_data:/data
```

### Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);
```

---

## 🔒 Security Checklist

- [x] HTTPS/SSL enabled
- [x] Security headers configured (Nginx)
- [x] Rate limiting enabled
- [x] Database credentials secured
- [x] Session secret is strong and unique
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] Monitoring/alerting set up

---

## 📞 Support

For issues or questions:

- **GitHub Issues**: <https://github.com/EllyOnunga/dine/issues>
- **Email**: <admin@savannahrestaurant.com>

---

## 📝 License

MIT License - See LICENSE file for details
