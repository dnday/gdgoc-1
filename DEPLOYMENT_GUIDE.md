# AI Recruitment Platform - Deployment Guide

This guide provides comprehensive instructions for deploying both the **Backend (NestJS)** and **Frontend (Next.js)** applications.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Third-Party Services Configuration](#third-party-services-configuration)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14 or higher
- **Git**: For version control

### Required Accounts

1. **Google Cloud Console** (for OAuth)
2. **Supabase** (for file storage)
3. **Google AI Studio** (for Gemini API)
4. **Email Service** (Gmail with App Password or other SMTP provider)

---

## Environment Variables Setup

### Backend Environment Variables

Create `.env` file in `ai-recruitment-backend/` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_recruitment"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Supabase Storage
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"

# Email Configuration (Gmail Example)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"

# Frontend URL
FRONTEND_URL="http://localhost:3001"

# Server Port
PORT="3000"
```

### Frontend Environment Variables

Create `.env.local` file in `ai-recruitment-frontend/` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## Backend Deployment

### Local Development

1. **Navigate to backend directory:**

   ```bash
   cd ai-recruitment-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup PostgreSQL database:**

   ```bash
   # Create database
   createdb ai_recruitment

   # Or use PostgreSQL CLI
   psql -U postgres
   CREATE DATABASE ai_recruitment;
   \q
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update all values with your credentials

5. **Run Prisma migrations:**

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. **Seed the database (optional but recommended):**

   ```bash
   npm run seed
   ```

7. **Start development server:**

   ```bash
   npm run start:dev
   ```

   Backend will run on `http://localhost:3000`

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start:prod
   ```

---

## Frontend Deployment

### Local Development

1. **Navigate to frontend directory:**

   ```bash
   cd ai-recruitment-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment configuration:**

   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3001`

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start
   ```

### Frontend Configuration (Recommended)

Create `ai-recruitment-frontend/lib/config.ts`:

```typescript
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
```

Then update all API calls from:

```typescript
fetch("http://localhost:3000/api/...");
```

To:

```typescript
import { API_URL } from "@/lib/config";
fetch(`${API_URL}/api/...`);
```

---

## Database Setup

### Using Prisma

The project uses Prisma ORM for database management.

#### Schema Location

`ai-recruitment-backend/prisma/schema.prisma`

#### Database Models

- **User**: Admin, Recruiter, Candidate accounts
- **Job**: Job postings created by recruiters
- **Application**: Candidate applications with AI analysis
- **RecruiterRequest**: Requests to become a recruiter

#### Migration Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database with test data
npm run seed

# Open Prisma Studio (Database GUI)
npx prisma studio
```

#### Database Seeding

The seed file creates:

- 1 Admin account
- 3 Candidate accounts
- 3 Recruiter accounts
- 6 Job postings
- 10 Sample applications

---

## Third-Party Services Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://your-domain.com/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 2. Supabase Storage Setup

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to **Storage** → Create bucket named `resumes`
4. Set bucket to **Public** access
5. Go to **Settings** → **API**
6. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon/Public Key → `SUPABASE_KEY`

### 3. Google Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy to `.env` as `GEMINI_API_KEY`
4. The application uses **Gemini 2.5 Flash** model

### 4. Email Service Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to **Google Account** → **Security** → **App Passwords**
3. Generate app password for "Mail"
4. Use this password in `EMAIL_PASS` (not your regular Gmail password)

**Alternative SMTP Providers:**

- SendGrid
- Mailgun
- AWS SES
- Postmark

---

## Production Deployment

### Deployment Platforms

#### Backend Options

1. **Heroku** - Easy deployment with PostgreSQL addon
2. **Railway** - Modern platform with great DX
3. **DigitalOcean App Platform** - Affordable and reliable
4. **AWS EC2 / ECS** - Full control
5. **Google Cloud Run** - Serverless containers

#### Frontend Options

1. **Vercel** (Recommended for Next.js)
2. **Netlify**
3. **AWS Amplify**
4. **Cloudflare Pages**

### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd ai-recruitment-frontend
vercel

# Set environment variables in Vercel Dashboard:
# Settings → Environment Variables
# Add: NEXT_PUBLIC_API_URL
```

### Railway Deployment (Backend)

1. Go to [Railway](https://railway.app/)
2. Connect GitHub repository
3. Add PostgreSQL database service
4. Set environment variables in Railway dashboard
5. Deploy automatically on git push

### Docker Deployment

#### Backend Dockerfile

Create `ai-recruitment-backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

#### Frontend Dockerfile

Create `ai-recruitment-frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: ai_recruitment
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./ai-recruitment-backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ai_recruitment
      # Add other environment variables

  frontend:
    build: ./ai-recruitment-frontend
    ports:
      - "3001:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000

volumes:
  postgres_data:
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:** `Can't reach database server`

**Solution:**

- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env`
- Check firewall settings
- Ensure database exists: `psql -l`

#### 2. Prisma Migration Error

**Error:** `Migration failed`

**Solution:**

```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Apply migrations
npx prisma migrate deploy
```

#### 3. Google OAuth Not Working

**Error:** `redirect_uri_mismatch`

**Solution:**

- Check Google Cloud Console → Credentials
- Ensure redirect URI matches exactly (including protocol and port)
- Verify `GOOGLE_CALLBACK_URL` in `.env`

#### 4. Gemini AI Error

**Error:** `Model not found`

**Solution:**

- Check API key is valid
- Try alternative model: `gemini-1.5-flash` or `gemini-2.0-flash-exp`
- Update in AI service

#### 5. Email Sending Failed

**Error:** `Authentication failed`

**Solution:**

- Enable 2FA on Gmail
- Generate App Password (not regular password)
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Check SMTP settings

#### 6. CORS Error

**Error:** `Access-Control-Allow-Origin`

**Solution:**

- Update CORS settings in `main.ts`
- Add frontend URL to allowed origins:

```typescript
app.enableCors({
  origin: ["http://localhost:3001", "https://your-frontend-domain.com"],
  credentials: true,
});
```

#### 7. Port Already in Use

**Error:** `EADDRINUSE`

**Solution (Windows PowerShell):**

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F

# Or kill all Node processes
Get-Process | Where-Object {$_.ProcessName -like '*node*'} | Stop-Process -Force
```

---

## Security Checklist

### Before Production Deployment

- [ ] Change default `JWT_SECRET` to strong random string
- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Set `NODE_ENV=production`
- [ ] Remove or disable database seeding in production
- [ ] Configure proper CORS origins (not `*`)
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Regular security updates for dependencies
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS on production domain
- [ ] Configure CSP headers
- [ ] Set up backup strategy for database

---

## Monitoring & Maintenance

### Recommended Tools

- **Logging**: Winston, Pino
- **Monitoring**: New Relic, Datadog, Sentry
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Mixpanel

### Regular Maintenance

- Update dependencies monthly
- Review security vulnerabilities
- Backup database weekly
- Monitor API usage and costs
- Review application logs

---

## Support

For issues or questions:

1. Check this documentation
2. Review error logs
3. Check GitHub Issues (if public repository)
4. Contact development team

---

**Last Updated:** January 31, 2026
