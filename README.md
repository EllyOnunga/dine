# Dine - Restaurant Website

A modern, elegant restaurant website for Savannah Restaurant featuring menu display, online reservations, and newsletter signup.

## 🚀 Features

- **Dynamic Menu Display** - Categorized menu items with images and descriptions
- **Online Reservations** - Easy table booking system
- **Newsletter Signup** - Customer engagement and marketing
- **Responsive Design** - Mobile-first, works on all devices
- **Modern UI** - Built with React, Framer Motion, and Tailwind CSS
- **Type-Safe** - Full TypeScript implementation

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+ (for production)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dine
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - A secure random string
   - `PORT` - Server port (default: 3000)

4. **Set up the database**

   ```bash
   npm run db:push
   ```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**

   ```bash
   npm start
   ```

## 📁 Project Structure

```plaintext
dine/
├── client/              # Frontend React application
├── server/              # Backend Express server with Pino logging
├── shared/              # Shared types and Zod schemas
├── migrations/          # Database migrations
├── script/              # Utility scripts (migrate, etc.)
├── nginx.conf           # Nginx reverse proxy configuration
├── Dockerfile           # Multi-stage production Dockerfile
└── docker-compose.prod.yml # Production orchestration setup
```

## 🔒 Production Features

- **Structured Logging** - Pino-based machine-readable logs
- **Email Notifications** - Automated reservation, enquiry, and order emails
- **Database Migrations** - Safe, versioned schema management with Drizzle
- **HTTPS/SSL** - Automatic Let's Encrypt certificates with Certbot
- **Security Headers** - Helmet.js and Nginx security hardening
- **Health Monitoring** - `/health` endpoint with real-time DB checks

## 🚢 Deployment

For complete production deployment instructions, including SSL and Email setup, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Quick Start (Production)

```bash
# 1. Prepare environment
cp .env.example .env
nano .env

# 2. Setup SSL (automatically handles Nginx)
./setup-ssl.sh yourdomain.com admin@yourdomain.com

# 3. Launch services
docker compose -f docker-compose.prod.yml up -d --build
```

## 🧪 Testing

```bash
# Type checking
npm run check

# Build test
npm run build
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For support, email <support@savannahrestaurant.com> or open an issue in the repository.

## 🙏 Acknowledgments

- Images from Unsplash
- UI components from shadcn/ui
- Icons from Lucide React
