# Global Testing Deployment Guide (Neon + Render)

This guide provides a "Free Forever" (or generous trial) path to hosting your Savannah Restaurant application globally for testing and feedback.

## 🗄️ Step 1: Database (Neon.tech)

Neon is a serverless PostgreSQL database with a high-performance free tier.

1. Sign up at **[Neon.tech](https://neon.tech/)**.
2. Create a new project named `savannah-restaurant-test`.
3. Choose your preferred region (e.g., US East).
4. Once created, you will see a **Connection String**.
    * It looks like: `postgresql://user:pass@ep-hostname.region.aws.neon.tech/neondb?sslmode=require`
5. **Important**: Keep this string handy for Step 2.

---

## 🚀 Step 2: Application (Render.com)

Render provides an easy-to-use platform for hosting Node.js servers.

1. Sign up at **[Render.com](https://render.com/)**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `EllyOnunga/dine`.
4. Configure the service:
    * **Name**: `savannah-restaurant`
    * **Region**: Same as your Neon database (e.g., US East).
    * **Runtime**: `Node` (or `Docker` if you prefer).
    * **Build Command**: `npm install && npm run build`
    * **Start Command**: `npm run db:migrate && npm start`
5. **Environment Variables**:
    Click "Advanced" -> "Add Environment Variable":

    | Key | Value |
    | :--- | :--- |
    | `NODE_ENV` | `production` |
    | `DATABASE_URL` | *(Paste your Neon connection string here)* |
    | `SESSION_SECRET` | *(Any secure random string)* |
    | `SMTP_HOST` | *(e.g., smtp.gmail.com)* |
    | `SMTP_USER` | *(Your email)* |
    | `SMTP_PASS` | *(Your app password)* |
    | `ADMIN_EMAIL` | *(Your email)* |

6. Click **Create Web Service**.

---

## 🧪 Step 3: Verify and Test

1. Render will start the build process. You can monitor the logs in the dashboard.
2. Once "Live", Render will give you a unique URL (e.g., `savannah-restaurant.onrender.com`).
3. Open the URL and verify:
    * The menu displays correctly (fetches from Neon).
    * The reservation form works.
    * Check the `/health` endpoint: `https://your-url.onrender.com/health`.

---

## ⚠️ Important Notes for Free Tiers

* **Spin Down**: If no one uses the site for 15 minutes, Render will "sleep" the app. The next person to visit will wait about 30 seconds for it to wake up.
* **Database Idle**: Neon also pauses your database when not in use to save resources (this is automatic and near-instant).
* **SSL**: Render and Neon both handle SSL automatically. Your app is already configured to support this in production.
