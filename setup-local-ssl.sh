#!/bin/bash

# Setup script for IP-based or Localhost SSL (No Domain)
# Use this if you don't have a domain name yet but want HTTPS.

set -e

echo "🔐 Setting up Local/IP SSL (Self-Signed)"
echo "========================================"

# 1. Create directory
mkdir -p ssl

# 2. Generate strong self-signed certificate (Valid for 1 year)
echo "Generating self-signed certificate..."
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -days 365 \
  -subj "/CN=localhost"

echo "✅ Certificate generated in ./ssl/"
echo ""

# 3. Check for .env
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Copying .env.example to .env..."
    cp .env.example .env
    
    # Generate a random session secret
    SECRET=$(openssl rand -base64 32)
    # Escape special characters for sed
    ESCAPED_SECRET=$(printf '%s\n' "$SECRET" | sed -e 's/[\/&]/\\&/g')
    
    # Update the session secret in the new .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/SESSION_SECRET=your-super-secret-session-key-change-this-in-production/SESSION_SECRET=$ESCAPED_SECRET/" .env
    else
        sed -i "s/SESSION_SECRET=your-super-secret-session-key-change-this-in-production/SESSION_SECRET=$ESCAPED_SECRET/" .env
    fi
    
    echo "✅ Created .env with a secure SESSION_SECRET"
fi

echo "📋 Starting Services..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "You can now access your site at:"
echo "  https://localhost"
echo "  (or https://<your-server-ip>)"
echo ""
echo "⚠️  IMPORTANT NOTE:"
echo "Since this is a self-signed certificate (no domain), your browser"
echo "WILL show a 'Not Secure' or 'Privacy Error' warning."
echo ""
echo "This is NORMAL. You must manually proceed past the warning:"
echo "  - Chrome: Click 'Advanced' -> 'Proceed to...'"
echo "  - Firefox: Click 'Advanced' -> 'Accept the Risk and Continue'"
