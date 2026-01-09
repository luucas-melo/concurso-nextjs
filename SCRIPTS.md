# 📜 Available NPM Scripts

This document explains all available npm scripts for the ConcursoTrack project.

## 🚀 Development Scripts

### `npm run dev`
Start the Next.js development server.

```bash
npm run dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Shows build errors in browser

### `npm run build`
Build the application for production.

```bash
npm run build
```

- Creates optimized production build in `.next/` folder
- Checks for TypeScript and build errors
- Shows bundle size analysis

### `npm start`
Start the production server (after building).

```bash
npm run build
npm start
```

- Serves the production build
- Use this to test production locally

### `npm run lint`
Run ESLint to check code quality.

```bash
npm run lint
```

- Checks for code style issues
- Auto-fix with: `npm run lint -- --fix`

## 🔍 Type Checking

### `npm run type-check`
Run TypeScript compiler to check for type errors without building.

```bash
npm run type-check
```

- Faster than full build
- Use before committing code
- Shows all TypeScript errors

## 🗄️ Database Scripts

### `npm run db:status`
Check Supabase database connection and verify tables exist.

```bash
npm run db:status
```

**Output:**
```
🔍 Checking Supabase Connection...

📋 Checking profiles table...
✅ Profiles table: OK
📋 Checking exams table...
✅ Exams table: OK
🔐 Checking authentication...
ℹ️  No user logged in (this is normal)

✅ All checks passed! Database is ready.
```

**When to use:**
- After setting up Supabase
- After running SQL schema
- When debugging connection issues
- Before deploying

**Troubleshooting:**
- ❌ Missing environment variables → Check `.env.local`
- ❌ Table not found → Run `supabase-schema.sql` in Supabase
- ❌ Connection error → Check Supabase URL and key

### `npm run db:types`
Generate TypeScript types from your Supabase database schema.

```bash
# Set your project ID first
export PROJECT_ID=your-project-id
npm run db:types
```

**What it does:**
- Connects to your Supabase project
- Reads database schema
- Generates `src/types/database.ts` with all table types
- Use these types for type-safe database queries

**Example usage:**
```typescript
import { Database } from '@/types/database';

export type Exam = Database['public']['Tables']['exams']['Row'];
export type ExamInsert = Database['public']['Tables']['exams']['Insert'];
```

**When to use:**
- After changing database schema
- After adding new tables
- When types are out of sync with database

### `npm run db:push`
Reminder to push schema changes to Supabase.

```bash
npm run db:push
```

**Output:**
```
Copy supabase-schema.sql and run in Supabase SQL Editor
```

**Steps:**
1. Edit `supabase-schema.sql`
2. Go to Supabase dashboard → SQL Editor
3. Copy and paste the SQL
4. Click Run
5. Run `npm run db:status` to verify

## 🔗 Supabase CLI Scripts

### `npm run supabase:login`
Login to Supabase CLI.

```bash
npm run supabase:login
```

- Opens browser for authentication
- Saves credentials locally
- Required for CLI operations

### `npm run supabase:link`
Link local project to Supabase remote project.

```bash
# Get project ref from Supabase dashboard → Settings → General
export PROJECT_REF=your-project-ref
npm run supabase:link
```

- Connects local dev to remote database
- Enables local migrations
- Syncs types and schema

## 🔄 Complete Workflow

### Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Check database connection
npm run db:status

# 4. Start development
npm run dev
```

### Daily Development
```bash
# Start dev server
npm run dev

# In another terminal, check types
npm run type-check

# Before committing
npm run lint
npm run type-check
```

### After Schema Changes
```bash
# 1. Edit supabase-schema.sql
nano supabase-schema.sql

# 2. Run in Supabase SQL Editor
npm run db:push  # Shows reminder

# 3. Regenerate types
export PROJECT_ID=your-project-id
npm run db:types

# 4. Verify connection
npm run db:status
```

### Before Deploying
```bash
# 1. Check types
npm run type-check

# 2. Run lint
npm run lint

# 3. Test build
npm run build

# 4. Test production locally
npm start

# 5. Check database
npm run db:status
```

## 🆘 Common Issues

### "Missing environment variables"
**Problem:** `npm run db:status` fails with missing env vars

**Solution:**
```bash
# Check if .env.local exists
cat .env.local

# If not, create it
cp .env.local.example .env.local
# Edit with your actual credentials
```

### "Table not found" error
**Problem:** Database check fails with table not found

**Solution:**
```bash
# Run the SQL schema in Supabase
# 1. Go to Supabase → SQL Editor
# 2. Copy supabase-schema.sql
# 3. Paste and Run
# 4. Verify
npm run db:status
```

### "Failed to generate types"
**Problem:** `npm run db:types` fails

**Solution:**
```bash
# Make sure you're logged in
npm run supabase:login

# Link your project
export PROJECT_REF=your-project-ref
npm run supabase:link

# Try again
export PROJECT_ID=your-project-id
npm run db:types
```

## 📝 Script Summary

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `dev` | Start dev server | Always during development |
| `build` | Build for production | Before deploying |
| `start` | Run production build | Testing production locally |
| `lint` | Check code quality | Before committing |
| `type-check` | Check TypeScript | Before committing/building |
| `db:status` | Verify database | After setup, before deploy |
| `db:types` | Generate types | After schema changes |
| `db:push` | Push schema reminder | After editing SQL |
| `supabase:login` | Login to Supabase CLI | First time setup |
| `supabase:link` | Link to remote | For local development |

## 🎯 Quick Commands

```bash
# Check everything is working
npm run type-check && npm run lint && npm run db:status

# Fresh start after pulling changes
npm install && npm run dev

# Full production test
npm run build && npm start

# After database schema update
npm run db:push  # Run SQL in Supabase
npm run db:types  # Regenerate types
npm run db:status  # Verify
```

---

**Need more help?** Check [`README.md`](./README.md) or [`DATABASE-SETUP-GUIDE.md`](./DATABASE-SETUP-GUIDE.md)
