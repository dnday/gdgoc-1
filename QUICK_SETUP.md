# ⚡ Quick Setup: Railway + Vercel

## 🎯 Port untuk Railway Domain

**Isi port: 3000** (bukan 8080)

## 📦 Backend di Railway

1. **New Project** → GitHub repo → `ai-recruitment`
2. **Settings** → Root Directory: `ai-recruitment-backend`
3. **Add PostgreSQL** database
4. **Generate Domain** → Port: **3000**
5. **Variables** (12 vars):
   ```
   NODE_ENV=production
   DATABASE_URL=(auto dari PostgreSQL)
   JWT_SECRET=(generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=https://your-backend.railway.app/auth/google/callback
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=3000
   ```
6. Deploy → Run migration:
   ```bash
   railway run npx prisma migrate deploy
   ```

## 🎨 Frontend di Vercel

1. **Add New Project** → Import `ai-recruitment`
2. **Root Directory**: `ai-recruitment-frontend`
3. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
4. **Deploy**

## 🔗 Connect

1. Update Railway backend:

   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

2. Update Google Cloud Console:
   - **Origins**: `https://your-frontend.vercel.app`
   - **Redirect URIs**: `https://your-backend.railway.app/auth/google/callback`

## ✅ Test

- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app
- Test login & Google OAuth

## 🎉 Done!
