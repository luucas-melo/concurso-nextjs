# 🗄️ Database Setup Guide - Step by Step

Follow these steps to set up your Supabase database for ConcursoTrack.

## ⏱️ Estimated Time: 10 minutes

---

## Step 1: Create Supabase Account & Project (5 min)

### 1.1 Sign Up
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in the details:
   - **Organization**: Create new or select existing
   - **Name**: `concurso-track` (or any name you prefer)
   - **Database Password**: Click "Generate a password"
     - ⚠️ **SAVE THIS PASSWORD** - You'll need it for database access
   - **Region**: Select **"South America (São Paulo)"** for Brazilian users
     - Or choose closest region to your location
   - **Pricing Plan**: Free tier is sufficient for development

3. Click **"Create new project"**
4. ⏳ Wait ~2 minutes for project initialization

### 1.3 Get Your API Credentials
1. Once project is ready, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (this is safe to expose)
     - `service_role` key (⚠️ keep this secret)

3. **Copy these values** - you'll need them soon

---

## Step 2: Run Database Schema (3 min)

### 2.1 Open SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"** button (top right)

### 2.2 Copy & Paste SQL Script
1. Open the file [`supabase-schema.sql`](./supabase-schema.sql) in this project
2. **Select ALL** the SQL code (Ctrl+A or Cmd+A)
3. **Copy** it (Ctrl+C or Cmd+C)
4. **Paste** into the Supabase SQL Editor

### 2.3 Execute the Script
1. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
2. ⏳ Wait a few seconds for execution
3. ✅ You should see: "Success. No rows returned"
4. Look for green success messages in the Results panel

### 2.4 Verify Tables Were Created
1. In left sidebar, click **"Table Editor"**
2. You should see two tables:
   - ✅ `profiles` - User profile information
   - ✅ `exams` - Exam data
3. Click on each table to see the columns

---

## Step 3: Configure Environment Variables (2 min)

### 3.1 Create .env.local File
1. Navigate to your project directory:
   ```bash
   cd /home/lucasmelo/Documentos/concurso-nextjs
   ```

2. Create the environment file:
   ```bash
   nano .env.local
   ```
   Or open with your preferred editor

### 3.2 Add Your Credentials
Copy this template and **replace with your actual values**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find these values:**
- `NEXT_PUBLIC_SUPABASE_URL`: From Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: From Settings → API → Project API keys → anon public

### 3.3 Save the File
- In nano: Press `Ctrl+O`, then `Enter`, then `Ctrl+X`
- In other editors: Just save normally

⚠️ **IMPORTANT**: Never commit `.env.local` to git! It's already in `.gitignore`

---

## Step 4: Verify Setup (1 min)

### 4.1 Check Database Tables
In Supabase dashboard:
1. Go to **Table Editor**
2. Click on `exams` table
3. You should see these columns:
   - id, user_id, name, public_body, position, exam_board
   - city, state, status, dates, documents
   - created_at, updated_at

### 4.2 Check RLS Policies
1. In Table Editor, click on `exams`
2. Click on **"RLS"** tab (Row Level Security)
3. You should see 4 policies:
   - ✅ Users can view own exams
   - ✅ Users can insert own exams
   - ✅ Users can update own exams
   - ✅ Users can delete own exams

### 4.3 Check Authentication Settings
1. Go to **Authentication** → **Providers**
2. Verify **Email** is enabled
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL**: `http://localhost:3000`
5. Add **Redirect URL**: `http://localhost:3000/auth/callback`

---

## Step 5: Test Your Setup (Optional but Recommended)

### 5.1 Install Dependencies
```bash
cd /home/lucasmelo/Documentos/concurso-nextjs
npm install
```

### 5.2 Start Development Server
```bash
npm run dev
```

### 5.3 Test Signup
1. Open http://localhost:3000 in your browser
2. Click "Começar agora" or go to `/auth`
3. Click "Criar conta" tab
4. Fill in:
   - Nome: Your name
   - Email: Your email
   - Senha: At least 6 characters
5. Click "Criar conta"

### 5.4 Verify in Supabase
1. Go to **Authentication** → **Users** in Supabase
2. You should see your new user
3. Go to **Table Editor** → **profiles**
4. You should see a profile automatically created!

### 5.5 Test Creating an Exam
1. After login, you'll be redirected to dashboard
2. Click "Novo Concurso" in sidebar
3. Fill in exam details
4. Click "Criar Concurso"
5. Go to Supabase → Table Editor → **exams**
6. You should see your exam!

---

## ✅ Setup Complete!

If all tests pass, your database is ready. You can now:
- ✅ Sign up and log in users
- ✅ Create, edit, and delete exams
- ✅ All data is protected by Row Level Security
- ✅ User profiles are auto-created on signup

---

## 🆘 Troubleshooting

### Problem: "Failed to fetch" error
**Solution**:
- Check your `.env.local` file has correct URL and key
- Restart dev server: `Ctrl+C` then `npm run dev`

### Problem: "Invalid API key" error
**Solution**:
- Go to Supabase → Settings → API
- Copy the `anon` `public` key (not service_role)
- Update in `.env.local`
- Restart dev server

### Problem: Can't sign up
**Solution**:
- Go to Supabase → Authentication → Providers
- Make sure Email is enabled
- Check if Site URL is set to `http://localhost:3000`

### Problem: SQL script errors
**Solution**:
- Make sure you copied the **entire** script
- Run it in a fresh SQL Editor query
- Check for any red error messages
- If table already exists, you can skip (it's safe)

### Problem: Profile not created after signup
**Solution**:
- Go to Supabase → Database → Triggers
- Check if `on_auth_user_created` trigger exists
- If not, re-run the SQL script from Step 2

### Problem: Can't see my exams
**Solution**:
- Go to Supabase → Table Editor → exams → RLS
- Make sure all 4 RLS policies are enabled
- Check that exams have your user_id

---

## 📊 Database Schema Overview

### Tables Created

**profiles**
```
- id (UUID) - Links to auth.users
- email (TEXT)
- full_name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**exams**
```
- id (UUID)
- user_id (UUID) - Links to auth.users
- name, public_body, position (TEXT)
- exam_board, city, state (TEXT)
- status (TEXT) - waiting|registered|taken|approved|rejected
- registration_open, registration_deadline (DATE)
- payment_deadline, exam_date, results_date (DATE)
- documents (JSONB) - Array of document names
- created_at, updated_at (TIMESTAMP)
```

### Security Features

- 🔒 **Row Level Security (RLS)** enabled on all tables
- 👤 Users can only see/edit their own data
- 🔐 Policies enforce user_id matching
- ⚡ Automatic profile creation on signup
- 🕐 Auto-updating timestamps

---

## 🎯 Next Steps

After database setup is complete:

1. **Read the README**: [`README.md`](./README.md)
2. **Test all features**: Sign up, create exams, edit, delete
3. **Deploy to production**: Follow Vercel deployment guide
4. **Add custom features**: Email alerts, calendar sync, etc.

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)

---

**Setup Time**: ✅ ~10 minutes
**Difficulty**: 🟢 Easy
**Status**: Ready for production use

Need help? Check the troubleshooting section above or README.md!
