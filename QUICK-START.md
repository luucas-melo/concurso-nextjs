# 🚀 Quick Start Guide

Get your migrated Next.js app running in **5 simple steps**.

## Step 1: Create Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `concurso-track`
   - Database password: (generate strong password)
   - Region: South America (São Paulo) for Brazilian users
4. Wait ~2 minutes for project to initialize

## Step 2: Set Up Database (5 min)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open [`../concurso/plans/supabase-setup.md`](../concurso/plans/supabase-setup.md)
4. Copy the **entire SQL** from that file
5. Paste into SQL Editor and click **Run**
6. You should see "Success. No rows returned"

## Step 3: Get Your Credentials (1 min)

1. In Supabase, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Configure Environment (2 min)

1. In your terminal, navigate to the project:
   ```bash
   cd /home/lucasmelo/Documentos/concurso-nextjs
   ```

2. Create `.env.local` file:
   ```bash
   touch .env.local
   ```

3. Open `.env.local` and add (replace with YOUR values):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJxxxxx_your_actual_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Step 5: Run the App (2 min)

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ Test Your App

### 1. Sign Up
- Go to `/auth`
- Click "Criar conta"
- Enter email and password
- Should redirect to dashboard

### 2. Create an Exam
- Click "Novo Concurso" in sidebar
- Fill in exam details
- Click "Criar Concurso"
- Should see success message

### 3. View Exams
- Click "Concursos" in sidebar
- Should see your exam in a card
- Click the card to edit

### 4. Edit/Delete
- On edit page, change exam details
- Click "Salvar Alterações"
- Or click "Excluir" to delete

### 5. Logout
- Click user menu in top right
- Click "Sair"
- Should redirect to landing page

## 🎉 Success!

If all tests pass, your app is working perfectly!

## 📦 Deploy to Production

When ready to deploy:

```bash
# 1. Initialize git (if not already)
git init
git add .
git commit -m "Initial Next.js migration"

# 2. Push to GitHub
git remote add origin https://github.com/your-username/concurso-track.git
git push -u origin main

# 3. Go to vercel.com
# - Import your repository
# - Add the same environment variables
# - Deploy!
```

## 🆘 Troubleshooting

**Problem: "Failed to fetch"**
- Check your Supabase URL in `.env.local`
- Verify project is active in Supabase dashboard

**Problem: Can't sign up**
- Check if database migrations ran successfully
- Go to Supabase → Table Editor → Should see `profiles` and `exams` tables

**Problem: Styles not loading**
- Delete `.next` folder: `rm -rf .next`
- Restart: `npm run dev`

**Problem: TypeScript errors**
- Run: `npm run type-check`
- Most issues from missing dependencies: `npm install`

## 📚 Next Steps

After testing:
1. Read [`README.md`](./README.md) for detailed documentation
2. Read [`MIGRATION-COMPLETE.md`](./MIGRATION-COMPLETE.md) for what changed
3. Customize the app:
   - Update colors in `src/app/globals.css`
   - Modify landing page text in `src/components/landing/`
   - Add your logo in `public/`

## 🔗 Important Links

- **Project**: `../concurso-nextjs/`
- **Old Project**: `../concurso/` (React + Vite)
- **Plans**: `../concurso/plans/` (all documentation)
- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

**Total Setup Time: ~15 minutes** ⏱️

Need help? Check [`README.md`](./README.md) for full documentation!
