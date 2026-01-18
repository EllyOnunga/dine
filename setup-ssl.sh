#!/bin/bash

# SSL Certificate Setup Script for Let's Encrypt
# This script helps you obtain SSL certificates for your domain

set -e

echo "🔐 SSL Certificate Setup for Savannah Restaurant"
echo "================================================"
echo ""

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-ssl.sh yourdomain.com"
    echo ""
    echo "Example: ./setup-ssl.sh savannahrestaurant.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Check if running in production
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found"
    exit 1
fi

echo "📋 Step 1: Creating self-signed certificate for initial setup..."
echo "This allows Nginx to start while we obtain the real certificate."
echo ""

# Create self-signed certificate for initial setup
openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -days 1 \
    -subj "/CN=$DOMAIN"

echo "✅ Self-signed certificate created"
echo ""

echo "📋 Step 2: Starting Nginx with self-signed certificate..."
docker compose -f docker-compose.prod.yml up -d nginx

echo "✅ Nginx started"
echo ""

echo "📋 Step 3: Obtaining Let's Encrypt certificate..."
echo "This may take a minute..."
echo ""

# Obtain the real certificate
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ Certificate obtained successfully!"
    echo ""
    
    echo "📋 Step 4: Updating Nginx configuration to use Let's Encrypt certificate..."
    
    # Update nginx.conf to use Let's Encrypt certificates
    sed -i.bak \
        -e "s|ssl_certificate /etc/nginx/ssl/cert.pem;|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|" \
        -e "s|ssl_certificate_key /etc/nginx/ssl/key.pem;|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|" \
        nginx.conf
    
    echo "✅ Nginx configuration updated"
    echo ""
    
    echo "📋 Step 5: Restarting Nginx with real certificate..."
    docker compose -f docker-compose.prod.yml restart nginx
    
    echo "✅ Nginx restarted"
    echo ""
    
    echo "🎉 SSL setup complete!"
    echo ""
    echo "Your site is now accessible at:"
    echo "  https://$DOMAIN"
    echo ""
    echo "Certificate will auto-renew every 12 hours via the certbot container."
    echo ""
    echo "To check certificate status:"
    echo "  docker compose -f docker-compose.prod.yml logs certbot"
else
    echo "❌ Failed to obtain certificate"
    echo ""
    echo "Common issues:"
    echo "  1. Domain DNS not pointing to this server"
    echo "  2. Port 80 not accessible from internet"
    echo "  3. Firewall blocking HTTP traffic"
    echo ""
    echo "Your site is still running with self-signed certificate at:"
    echo "  https://$DOMAIN (browsers will show security warning)"
    exit 1
fi
