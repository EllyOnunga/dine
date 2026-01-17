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
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── server/              # Backend Express server
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   ├── middleware.ts    # Security & performance middleware
│   ├── storage.ts       # Data storage layer
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema & Zod validation
└── script/              # Build and utility scripts
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API request throttling
- **CORS** - Cross-origin resource sharing protection
- **Input Validation** - Zod schema validation
- **Compression** - Response compression

## 🌐 API Endpoints

### Health Check

- `GET /health` - Server health status

### Menu

- `GET /api/menu` - Get all menu items

### Reservations

- `POST /api/reservations` - Create a new reservation

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2026-01-20",
    "time": "19:00",
    "guests": 4,
    "requests": "Window seat please"
  }
  ```

### Newsletter

- `POST /api/newsletter` - Subscribe to newsletter

  ```json
  {
    "email": "john@example.com"
  }
  ```

## 🚢 Deployment

### Environment Variables for Production

Ensure these are set in your production environment:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-super-secret-key
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com
```

### Deployment Platforms

#### Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Railway

1. Connect your GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically on push

#### Docker

1. **Build and run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   This will start both the application and a PostgreSQL database. The application will be available at `http://localhost:3000`.

2. **Run only the application (assuming external DB)**

   ```bash
   docker build -t dine-app .
   docker run -p 3000:3000 -e DATABASE_URL=your-db-url dine-app
   ```

## ⚠️ Important Notes

### Current Limitations (In-Memory Storage)

The application currently uses **in-memory storage** for development. This means:

- All data is lost when the server restarts
- Not suitable for production use
- Database integration is required for production

### TODO Before Production

- [ ] Implement PostgreSQL database connection
- [ ] Add database migrations
- [ ] Set up email service for reservation confirmations
- [ ] Add admin panel for managing reservations
- [ ] Implement proper logging service
- [ ] Set up monitoring and alerts
- [ ] Add automated backups

See `PRODUCTION_CHECKLIST.md` for complete production readiness guide.

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
