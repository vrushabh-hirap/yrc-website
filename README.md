# 🎓 Young's Research Conference (YRC 2026) Portal

### PCCOE · Department of AI & Machine Learning

A unified full-stack web application built with Next.js (App Router), React 19, Supabase (PostgreSQL & Storage), and a Neo-Brutalist design system.

---

## 🚀 Key Architectural Changes

1. **Single Unified Codebase**: Merged separate client and server folders into a clean, unified Next.js web app.
2. **Database Migration**: Replaced MongoDB Atlas with **Supabase PostgreSQL**.
3. **File Storage**: PDF research papers are uploaded and stored directly in **Supabase Storage Bucket (`yrc-papers`)**.
4. **Vercel Native Deployment**: Ready for 1-click deployment on Vercel as a single serverless application.

---

## 🗄 Database Setup (Supabase)

1. Create a project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Upload and execute the included [supabase_schema.sql](supabase_schema.sql) file. This will automatically create:
   - `users` table
   - `teams` table
   - `team_members` table
   - `papers` table
   - `feedbacks` table
   - Indexes & RLS Policies
   - `yrc-papers` Storage Bucket
   - Seeded Admin Account (`admin@pccoepune.org`)

---

## ⚡ Environment Variables

Create a `.env.local` file (or configure environment variables in Vercel project settings):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=yrc_portal_supabase_secret_2026_super_secure
```

---

## 🛠 Local Development & Build

```bash
# Install dependencies
npm install

# Run dev server (Port 3000)
npm run dev

# Production Build test
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`).
4. Click **Deploy**!
