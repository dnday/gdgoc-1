# 🚀 Deployment Guide: Backend (Railway) + Frontend (Vercel)

## 📋 Deployment Strategy

- **Backend (NestJS)**: Railway + PostgreSQL
- **Frontend (Next.js)**: Vercel

---

## 🎯 PART 1: Deploy Backend ke Railway

### Step 1: Login ke Railway

1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub

### Step 2: Buat Project Backend

1. Click **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository: `ai-recruitment`

### Step 3: Konfigurasi Backend

1. Click service → **Settings**
2. Set **Root Directory**: `ai-recruitment-backend`
3. Save

### Step 4: Tambah PostgreSQL

1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Database akan auto-provision
3. Copy `DATABASE_URL` dari Variables tab

### Step 5: Generate Domain

1. Settings → **Networking**
2. Click **"Generate Domain"**
3. **Port**: Isi **3000** (bukan 8080)
4. Copy domain (contoh: `backend-production-xyz.up.railway.app`)

### Step 6: Set Environment Variables

Tambahkan di backend Variables:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:xxx@host:5432/railway
JWT_SECRET=your-secret-min-32-chars-generate-dengan-crypto
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001
PORT=3000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7: Deploy & Migrate

Backend akan auto-deploy. Setelah running, jalankan migration:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run npx prisma migrate deploy
```

### Step 8: Test Backend

```bash
curl https://your-backend.railway.app
```

✅ **Backend Done!**

---

## 🎨 PART 2: Deploy Frontend ke Vercel

### Step 1: Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub

### Step 2: Import Project

1. Click **"Add New Project"**
2. Import repository: `ai-recruitment`
3. Vercel akan detect Next.js

### Step 3: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click **"Edit"** → Isi: `ai-recruitment-frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Step 4: Environment Variables

Add di Vercel:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**⚠️ PENTING:**
- Ganti dengan domain Railway backend yang sudah di-generate
- **Jangan** ada trailing slash

### Step 5: Deploy

1. Click **"Deploy"**
2. Tunggu build selesai (~2 menit)
3. Copy domain Vercel (contoh: `ai-recruitment-xxx.vercel.app`)

✅ **Frontend Done!**

---

## 🔗 PART 3: Connect Backend & Frontend

### Step 1: Update Backend Environment

Di Railway backend Variables:

```bash
FRONTEND_URL=https://your-frontend.vercel.app
```

Backend akan auto-redeploy.

### Step 2: Update CORS (Opsional)

Backend sudah set `origin: true`, tapi untuk production sebaiknya specific:

Edit [src/main.ts](d:\Dev\ai-recruitment\ai-recruitment-backend\src\main.ts):

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

Push ke GitHub untuk redeploy.

---

## 🔐 PART 4: Google OAuth Setup

### Update Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Click OAuth 2.0 Client ID

**Authorized JavaScript origins:**
```
https://your-frontend.vercel.app
```

**Authorized redirect URIs:**
```
https://your-backend.railway.app/auth/google/callback
```

Save.

---

## ✅ Testing

### 1. Test URLs

- Frontend: https://your-frontend.vercel.app
- Backend: https://your-backend.railway.app

### 2. Test Authentication

1. Open frontend → Click Register
2. Fill form and submit
3. Should redirect to dashboard

### 3. Test Google OAuth

1. Click "Login with Google"
2. Complete OAuth flow
3. Should work

### 4. Check Browser Console

Open DevTools (F12) → Network tab:
- API calls should go to Railway backend
- No CORS errors

---

## 🐛 Troubleshooting

### ❌ CORS Error

**Solusi:**
1. Check `FRONTEND_URL` di Railway backend
2. Pastikan tidak ada trailing slash
3. Redeploy backend

### ❌ API 404 Error

**Solusi:**
1. Check `NEXT_PUBLIC_API_URL` di Vercel
2. Test backend URL langsung: `curl https://backend.railway.app`
3. Pastikan backend running

### ❌ Google OAuth Error

**Solusi:**
1. Verify redirect URIs di Google Console
2. Check `GOOGLE_CALLBACK_URL` di Railway
3. Format: `https://backend.railway.app/auth/google/callback`

### ❌ Database Connection Error

**Solusi:**
1. Check `DATABASE_URL` di Railway
2. Ensure PostgreSQL service running
3. Run migration: `railway run npx prisma migrate deploy`

---

## 📝 Environment Variables Summary

### Backend (Railway) - 12 variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://backend.railway.app/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
FRONTEND_URL=https://frontend.vercel.app
PORT=3000
```

### Frontend (Vercel) - 1 variable
```bash
NEXT_PUBLIC_API_URL=https://backend.railway.app
```

---

## 🔄 Continuous Deployment

**Vercel:**
- Auto-deploy on push to `main`
- Preview deployments for PRs

**Railway:**
- Auto-deploy on push to `main`

---

## 💰 Cost

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for this project ✅

**Railway Free Tier:**
- $5 credit/month
- Backend + PostgreSQL: ~$4-5/month
- Fits in free tier ✅

---

## 🎯 Quick Reference

| Service | Platform | URL | Port |
|---------|----------|-----|------|
| Backend | Railway | backend.railway.app | 3000 |
| Frontend | Vercel | frontend.vercel.app | - |
| Database | Railway | (internal) | 5432 |

---

## 📋 Deployment Checklist

### Backend (Railway)
- [ ] Project created
- [ ] Root directory: `ai-recruitment-backend`
- [ ] PostgreSQL added
- [ ] Domain generated with port **3000**
- [ ] 12 environment variables set
- [ ] Migration run
- [ ] Backend accessible

### Frontend (Vercel)
- [ ] Project imported
- [ ] Root directory: `ai-recruitment-frontend`
- [ ] `NEXT_PUBLIC_API_URL` set
- [ ] Deployed successfully
- [ ] Frontend accessible

### Configuration
- [ ] Backend `FRONTEND_URL` updated
- [ ] Google OAuth URIs updated
- [ ] Login/Register tested
- [ ] Google OAuth tested
- [ ] All API calls working

---

## 🎉 Done!

Your app is live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

---

**Updated:** January 31, 2026  
**Deployment Type:** Railway (Backend) + Vercel (Frontend)
