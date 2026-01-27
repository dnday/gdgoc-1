# 🎨 Frontend Setup Guide - AI Recruitment System

> Panduan singkat untuk Frontend Developer

---

## 📋 Prerequisites

Install dulu:
- **Node.js** v18+ → [nodejs.org](https://nodejs.org/)
- **Git** → [git-scm.com](https://git-scm.com/)

Cek versi:
```bash
node --version  # harus v18+
npm --version
git --version
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/username/ai-recruitment.git
cd ai-recruitment
```

### 2. Setup Frontend
```bash
cd ai-recruitment-frontend
npm install
```

### 3. Setup Environment
Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Cara dapat Supabase credentials:**
> 1. Login ke [supabase.com](https://supabase.com)
> 2. Buka project → Settings → API
> 3. Copy **Project URL** dan **anon public** key

### 4. Run Development Server
```bash
npm run dev
```

Buka browser: **http://localhost:3000**

---

## 📁 Struktur Project

```
ai-recruitment-frontend/
├── app/              # Pages (Next.js App Router)
├── components/       # React Components
├── lib/              # Utilities
├── public/           # Static files
└── styles/           # CSS
```

---

## 💻 Daily Workflow

```bash
# 1. Pull latest code
git pull origin master

# 2. Install dependencies (jika ada update)
npm install

# 3. Start dev server
npm run dev

# 4. Coding...
```

---

## 📜 Available Commands

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build production |
| `npm run lint` | Check code quality |

---

## 🛠️ Tech Stack

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend & Database

---

## 🐛 Common Issues

### Port 3000 sudah dipakai
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Atau run di port lain
npm run dev -- -p 3001
```

### Environment variables tidak work
1. Pastikan file bernama `.env.local` (bukan `.env`)
2. Restart dev server setelah edit `.env.local`
3. Variable harus dimulai dengan `NEXT_PUBLIC_`

### npm install error
```bash
npm cache clean --force
npm install
```

---

## 🎯 Git Workflow

```bash
# 1. Buat branch baru
git checkout -b feature/nama-feature

# 2. Coding...

# 3. Commit
git add .
git commit -m "feat: deskripsi perubahan"

# 4. Push
git push origin feature/nama-feature
```

**Commit message format:**
- `feat:` - fitur baru
- `fix:` - bug fix
- `style:` - styling
- `refactor:` - refactor code

---

## 📚 Resources

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Dokumentasi lengkap
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Repository cloned
- [ ] `npm install` done
- [ ] `.env.local` configured
- [ ] Dev server running
- [ ] Browser opened at localhost:3000

---

**Ready to code!** 🚀

**Last Updated**: 2026-01-28
