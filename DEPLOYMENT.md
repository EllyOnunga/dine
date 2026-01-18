# Deployment Guide

This guide describes how to deploy the Savannah Restaurant application in a production environment using Docker Compose.

## 🏗️ Architecture

The production setup consists of:

- **App**: Node.js/Express application (built from `Dockerfile`)
- **Database**: PostgreSQL 15 (persisted in a Docker volume)
- **Proxy**: Nginx (handling reverse proxying)
- **SSL** (Optional): Certbot (managing Let's Encrypt certificates)

## 📋 Prerequisites

- A Linux server (Ubuntu/Debian recommended) with a public IP.
- Docker and Docker Compose installed on the server.
- Ports 80 (and 443 for SSL) open in your firewall.

## 🚀 Step-by-Step Deployment

### 1. Clone the Repository

SSH into your server and clone the project:

```bash
git clone <your-repo-url>
cd dine
```

### 2. Configure Environment

Create the production environment file:

```bash
cp .env.example .env
nano .env
```

Update the following variables:

- `DATABASE_URL`: You can leave this usage of the internal docker dns `postgresql://admin:admin@db:5432/dine_db` if using the built-in DB container.
- `SESSION_SECRET`: Set a strong random string.
- `SMTP_*`: Configure for email sending.
- `ADMIN_EMAIL`: The email to receive notifications.

### 3A. Option: Deploying without a Domain (IP Address only)

If you don't have a domain yet and want to access the site via `http://YOUR_SERVER_IP`, use the IP-specific configuration.
**Note:** SSL/HTTPS will NOT be enabled.

```bash
docker compose -f docker-compose.ip.yml up -d --build
```

Your site will be available at `http://<your-ip-address>`.

### 3B. Option: Deploying with a Domain (SSL/HTTPS)

If you have a domain, we have provided a script to handle the complex SSL bootstrapping process automatically.
Replace `yourdomain.com` with your actual domain.

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh yourdomain.com admin@yourdomain.com
```

This script will:

1. Generate a temporary self-signed certificate.
2. Start Nginx.
3. Request a real certificate from Let's Encrypt using Certbot.
4. Update `nginx.conf` to use the new secure certificate.
5. Restart Nginx.

### 4. Verify Deployment

- For IP deployment: `http://<your-ip>`
- For Domain deployment: `https://yourdomain.com`

## 🔄 Updates & Maintenance

### Deploying New Code

To update the application with the latest code from git:

```bash
# Pull latest changes
git pull

# Rebuild and restart the app service
# For IP setup:
docker compose -f docker-compose.ip.yml up -d --build --no-deps app
# For Domain setup:
docker compose -f docker-compose.prod.yml up -d --build --no-deps app
```

### Running Database Migrations

Migrations run automatically on container startup, but you can run them manually if needed:

```bash
docker compose -f docker-compose.ip.yml run --rm app npm run db:migrate
```

### Viewing Logs

```bash
docker compose -f docker-compose.ip.yml logs -f app
```
