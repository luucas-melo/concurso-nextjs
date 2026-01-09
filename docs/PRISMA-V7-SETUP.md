# 🔷 Prisma v7 Setup (Updated Configuration)

**Prisma v7 has breaking changes** - This guide shows the new configuration format.

## ⚡ What Changed in Prisma v7?

- ❌ **Removed**: `url` and `directUrl` from `schema.prisma`
- ✅ **Added**: `prisma.config.ts` for configuration
- ✅ **Simpler**: Only `DATABASE_URL` environment variable needed

## 📦 Files Structure

```
concurso-nextjs/
├── prisma.config.ts           ← NEW! Configuration file
├── prisma/
│   └── schema.prisma          ← Updated (no URLs)
├── .env.local                 ← Only DATABASE_URL needed
└── src/lib/prisma.ts          ← Prisma client singleton
```

## 🚀 Quick Setup

### Step 1: Get Connection String (2 min)

Go to Supabase → **Settings** → **Database** → **Connection string**

**Use Transaction Pooler (Session Mode):**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 2: Configure Environment (1 min)

Edit `.env.local`:

```env
# Supabase (for Auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Prisma (only this URL needed!)
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres"

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Replace `[PASSWORD]` with your actual Supabase database password!**

### Step 3: Install & Generate (2 min)

```bash
cd /home/lucasmelo/Documentos/concurso-nextjs

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Expected output:
# ✔ Generated Prisma Client (v7.x.x)
```

### Step 4: Verify Setup (1 min)

```bash
# Pull existing database schema
npm run prisma:pull

# Open Prisma Studio to browse data
npm run prisma:studio
```

## 📄 Configuration Files

### `prisma.config.ts` (NEW in v7)

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

### `prisma/schema.prisma` (Updated)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // NO url or directUrl here anymore!
}

// Models...
model Profile {
  id        String   @id @db.Uuid
  email     String   @unique
  // ...
}
```

## 🎯 Usage in Code (Unchanged)

```typescript
import { prisma } from '@/lib/prisma';

// Query exams
const exams = await prisma.exam.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
});

// Create exam
const exam = await prisma.exam.create({
  data: {
    userId: user.id,
    name: 'My Exam',
    // ...
  },
});
```

## 🔧 Available Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Browse database with GUI
npm run prisma:studio

# Pull schema from existing database
npm run prisma:pull

# Push schema changes to database
npm run prisma:push

# Create migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:deploy
```

## 🆚 Prisma v6 vs v7 Comparison

| Feature | v6 | v7 |
|---------|-----|-----|
| **Config Location** | schema.prisma | prisma.config.ts |
| **URL in schema** | ✅ Yes | ❌ No |
| **directUrl** | ✅ Yes | ❌ No |
| **Env Variables** | DATABASE_URL + DIRECT_URL | DATABASE_URL only |
| **Configuration** | Less flexible | More flexible |

## ⚠️ Migration from v6 to v7

If you had Prisma v6:

1. **Create** `prisma.config.ts`:
   ```typescript
   import 'dotenv/config';
   import { defineConfig, env } from 'prisma/config';
   
   export default defineConfig({
     schema: 'prisma/schema.prisma',
     datasource: {
       url: env('DATABASE_URL'),
     },
   });
   ```

2. **Update** `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     // Remove: url and directUrl lines
   }
   ```

3. **Remove** `DIRECT_URL` from `.env.local` (not needed anymore)

4. **Regenerate**:
   ```bash
   npm run prisma:generate
   ```

## 🐛 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
```bash
# Check .env.local exists
cat .env.local

# Make sure DATABASE_URL is defined
echo 'DATABASE_URL="postgresql://..."' >> .env.local
```

### Error: "datasource property url is no longer supported"

**Solution:** You're using old schema format. Update per this guide.

### Error: "Cannot find module 'prisma/config'"

**Solution:** Make sure you have Prisma v7+:
```bash
npm install prisma@latest @prisma/client@latest
npm run prisma:generate
```

## ✅ Quick Test

```bash
# 1. Check Prisma version
npx prisma -v
# Should show v7.x.x

# 2. Generate client
npm run prisma:generate

# 3. Open Studio
npm run prisma:studio

# 4. Start dev server
npm run dev
```

## 📚 Resources

- [Prisma v7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-to-prisma-7)
- [prisma.config.ts Reference](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [Prisma + Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)

---

**Setup Time:** ~5 minutes  
**Difficulty:** 🟢 Easy  
**Status:** ✅ Ready for Prisma v7
